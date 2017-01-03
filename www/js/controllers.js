
angular.module('starter.controllers', [])

.controller('AppCtrl', function($ionicBackdrop, $scope, $ionicModal, $timeout, $state, $http, $ionicSlideBoxDelegate, $ionicPopup, $q, NewUserRequestTemplate, NationalityCountriesRaceList, ionicDatePicker, $ionicPlatform, $cordovaDeviceOrientation, $cordovaGeolocation, $cordovaCamera, partyData, productData) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $timeout(function () {
    $scope.animateForm= true;
  },4500);

  //initialize components
  console.log("===========initializing components===========")
  $scope.convert = new X2JS();
  $scope.activateSpinner= false;

  $scope.startPosition={};
  $scope.currentPosition={};
  $scope.currentPosition_v2={};

  $scope.deviceOrientation= {};
  $scope.deviceOrientation_v2= {};

  $ionicPlatform.ready(function() {

    var options = {
      frequency: 500,
      filter: true     // if frequency is set, filter is ignored
    }
    //------------------------Configure Device Orientation-----------------------------------
    var watchHeading = $cordovaDeviceOrientation.watchHeading(options).then(
      null,
      function(error) {
        // An error occurred
        if($scope.deviceOrientation_v2)
           $scope.deviceOrientation= angular.copy($scope.deviceOrientation_v2);
        else{
          $scope.deviceOrientation= {
            magneticHeading: 0,
            trueHeading : 0,
            headingAccuracy : 0,
            timestamp: new Date.getHours() + ':' + new Date.getMinutes() + ':' + new Date.getSeconds()
          };
          $scope.deviceOrientation_v2= angular.copy($scope.deviceOrientation);

          console.log("could not get device orientation");
        }


      },
      function(result) {   // updates constantly (depending on frequency value)
        $scope.deviceOrientation= angular.copy(result);
        $scope.deviceOrientation_v2= angular.copy($scope.deviceOrientation);
        console.log("current orientation:", $scope.deviceOrientation );
      });
  });

  $scope.log= function() {
    console.log($scope);
  }

  var watchPosition= function () {
    var watch= $cordovaGeolocation.watchPosition({frequency: 500, timeout : 10000, enableHighAccuracy: true});

    watch.then(null, function (error) {

      console.log("could not get location: ", error);

      if(!$scope.currentPosition_v2.lat){
        $scope.currentPosition= angular.copy($scope.startPosition);
        $scope.currentPosition_v2= angular.copy($scope.startPosition);
      }
      else
        $scope.currentPosition= angular.copy($scope.currentPosition_v2);

      $cordovaGeolocation.clearWatch(watch);
      watchPosition();

    }, function (position) {

      console.log("current position:", position);

      $scope.currentPosition={
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      $scope.currentPosition_v2= angular.copy($scope.currentPosition);
    });
  }

  //------------------------Configure Geolocation-----------------------------------
  $cordovaGeolocation.getCurrentPosition({frequency: 500, timeout : 10000, enableHighAccuracy: true}).then(function(position){

    $scope.startPosition= angular.copy({
      lat:  position.coords.latitude,
      lng:  position.coords.longitude
    });

    $scope.currentPosition= angular.copy($scope.startPosition);
    $scope.currentPosition_v2= angular.copy($scope.startPosition);

    watchPosition();

  }, function(error) {
    console.log("Could not get location");

    //Default Position in Sydney
    $scope.startPosition = {
      lat: -34.397,
      lng: 150.644
    };
  });

  // Form data for the login modal
  $scope.loginData = { };

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope,
    animation: 'slide-in-right',
    backdropClickToClose: false,
    hardwareBackButtonClose: false
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.show();
  });

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();

  };

  //------------------------------Necessary Handshake for User Login-----------------------------------

  $scope.accessToken= '';
  $scope.partyID= '';
  $scope.partyCin= '';
  $scope.partyData= {};
  $scope.productData= {};

  $scope.apikey = 'da8514e7-f8a4-49d2-ac96-5da80a10da53';
  $scope.uuid = 'STest20160719_K00001';

  var apikey= 'da8514e7-f8a4-49d2-ac96-5da80a10da53';
  var uuid= 'STest20160719_K00001';

  // Perform the login action when the user submits the login form

  $scope.doLogin = function() {

    console.log('Doing login', $scope.loginData);
    $scope.activateSpinner= true;
    $ionicBackdrop.retain();

    //'apikey':  'da8514e7-f8a4-49d2-ac96-5da80a10da53',
    //'uuid'  : 'STest20160719_K00001'
    partyData.getAccessToken(apikey, uuid).then(function(data){

      $scope.accessToken= data;

      partyData.searchParty(apikey, uuid, $scope.accessToken, $scope.loginData.username, '').then(function(data){

        $scope.partyID= data.partiesList.item[0].partyId;
        $scope.partyCin= data.partiesList.item[0].partyInternalId.CISCIN;

        partyData.retrieveParty(apikey, uuid, $scope.accessToken, $scope.partyID).then(function(data){

          $scope.partyData= angular.copy(data);

        }, function(error){

          //TODO: Prompt and Quit Application that Internet Access is Problematic or Server is down

        });

        productData.getList(apikey, uuid, $scope.accessToken, $scope.partyID ).then(function(data){

          $scope.productData = angular.copy(data);
          console.log("productData:", $scope.productData.partiesProducts.productsList.item);

        }, function(response){
          //toDo: Throw an exception
        });

      }, function(error){

        //Login Unsuccessful
        //TODO: Write logic for unsuccessful login

      });

    }, function(error) {
      console.log(error);
      //TODO: Prompt and Quit Application if No AccessToken is Retrieved
      //
      //ionic.Platform.exitApp()
    });


    //------Let's temporarily do this while waiting for Data to come in------
    partyData.retrievePartyMock(apikey,uuid, $scope.accessToken, $scope.partyID).then(function(data){

      $scope.partyData= angular.copy(data);

    }, function(error){

    });
    productData.getListMock(apikey, uuid, $scope.accessToken, $scope.partyID ).then(function(data){

      $scope.productData = angular.copy(data);
      console.log("productData:", $scope.productData.partiesProducts.productsList.item);

    }, function(response){
      //toDo: Throw an exception
    });
    //-----------------------------------------------------------------------


    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.modal.hide();
      $scope.activateSpinner= false;
      $ionicBackdrop.release();
      $state.go('app.playlists');
    }, 1000);
  };

  //-----------------Configurable scope variables---------------------
  $scope.addAccountDLGTitle= "Register as New User";

  NewUserRequestTemplate.getTemplate().then(function (data) {
    $scope.newUserDetails= data;
    console.log("newUserDetails", data)
  },function(response){
    console.log(response);
  });

  var submitNewUserRequest= function (newUserReq) {

    var defer= $q.defer();

    partyData.createParty(apikey, uuid, $scope.accessToken, newUserReq).then(function(response){

      defer.resolve(response);

    },function(error){

      defer.reject(error);

    });

    return defer.promise;

  }

  $ionicModal.fromTemplateUrl('templates/add-user.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal2 = modal;
  });

  $scope.disableSwipe= function () {
    $ionicSlideBoxDelegate.$getByHandle('add-user-dlg').enableSlide(false);
  }

  $scope.closeAddAccountDLG = function() {
    $scope.showConfirmtionPopup().then(function(res){
      if(res){
        NewUserRequestTemplate.getTemplate().then(function (data) {
          $scope.newUserDetails= angular.copy(data);
          console.log("newUserDetails", data)
        },function(response){
          console.log(response);
        });
        $ionicSlideBoxDelegate.$getByHandle('add-user-dlg').slide(0);
        $scope.modal2.hide();
      }
    });
  }

  $scope.animatingWelcomePage=false;

  $scope.openAddAccountDLG = function() {

    console.log("----------------Opening a New Account------------------");

    NewUserRequestTemplate.getTemplate().then(function (data) {
      $scope.newUserDetails= angular.copy(data);
      console.log("newUserDetails", data)
    },function(response){
      console.log(response);
    });

    $scope.newUserDetails.parties.partyDetl.partyRetail.partyName.name.firstName="New User";
    $scope.newUserDetails.parties.partyDetl.partyRetail.educationLevelDesc= getEducationLevelDesc($scope.educationLevelList,  $scope.newUserDetails.parties.partyDetl.partyRetail.educationLevel);


    $scope.animatingWelcomePage=false;
    $scope.addAccountDLGTitle= "Register as New User";
    $ionicSlideBoxDelegate.$getByHandle('add-user-dlg').slide(0);
    $scope.modal2.show();
    $scope.animatingWelcomePage=true;
    $timeout(function () {
      $scope.animatingWelcomePage=false;
      document.getElementById("new-username").focus();
    },2000);


  }

  //-----------------------------Slide Mechanisms---------------------------------
  $scope.enablePrevious= function () {
    var currentSlide= $ionicSlideBoxDelegate.$getByHandle('add-user-dlg').currentIndex();
    var predicate= true;

    switch(currentSlide){
      case ($ionicSlideBoxDelegate.$getByHandle('add-user-dlg').slidesCount() - 1):
        predicate= false;
        break;
      case 0:
        predicate= false;
        break;
      case 1:
        break;
      default:
        break;
    };

    return predicate;

  }
  $scope.previousSlide= function () {
    var currentSlide= $ionicSlideBoxDelegate.$getByHandle('add-user-dlg').currentIndex();
    if(currentSlide>0)
      $ionicSlideBoxDelegate.$getByHandle('add-user-dlg').slide(currentSlide - 1);
  }

  $scope.enableNext= function () {
    var currentSlide= $ionicSlideBoxDelegate.$getByHandle('add-user-dlg').currentIndex();
    var predicate= true;

    switch(currentSlide){
      case $ionicSlideBoxDelegate.$getByHandle('add-user-dlg').slidesCount() - 1:
        predicate= false;
        break;
      case 0:
        if($scope.animatingWelcomePage)
          predicate= false;
        break;
      case 1:
        break;
      default:
        break;
    };

    return predicate;
  }
  $scope.nextSlide= function () {
    console.log("$scope.newUserDetails: ", $scope.newUserDetails);
    var currentSlide= $ionicSlideBoxDelegate.$getByHandle('add-user-dlg').currentIndex();

    if(currentSlide == $ionicSlideBoxDelegate.$getByHandle('add-user-dlg').slidesCount() - 2)
    {
      //Confirmation Page -> Submission
      submitNewUserRequest($scope.newUserDetails).then(function(tokenizedPartyID){



      }, function(error){

      });
    }

    if(currentSlide < $ionicSlideBoxDelegate.$getByHandle('add-user-dlg').slidesCount() - 1)
      $ionicSlideBoxDelegate.$getByHandle('add-user-dlg').slide(currentSlide + 1);
  }

  $scope.closeAddAccount = {};

  $scope.showConfirmtionPopup = function() {
    var defer= $q.defer();
    var myPopup = $ionicPopup.confirm({
      template: 'Closing this session will cause all session information to be lost',
      title: 'Close this Register User Session?'
    });
    myPopup.then(function(res){
      defer.resolve(res);
    });

    return defer.promise;
  }

  $scope.slideChanged= function (slideIndex) {

    switch(slideIndex){
      case $ionicSlideBoxDelegate.$getByHandle('add-user-dlg').slidesCount() - 1:
        $scope.addAccountDLGTitle= 'Registration Successful!';
        $scope.confirmNewUserDetails= false;
        break;
      case $ionicSlideBoxDelegate.$getByHandle('add-user-dlg').slidesCount() - 2:
        $scope.addAccountDLGTitle= 'Confirm New User Details';
        $scope.confirmNewUserDetails= true;
        break;
      case 0:
        break;
      case 1:
        break;
      default:
        $scope.addAccountDLGTitle= "Register as New User";
        $scope.confirmNewUserDetails= false;
        break;
    };

  }

//------------------------Configure Add/Edit Document Modal-------------------------------------------

  var findDocument= function(DocNo){

    for(var i= 0; i < $scope.newUserDetails.parties.partyDoc.item.length; i++)
    {
      if($scope.newUserDetails.parties.partyDoc.item[i].docNumber === DocNo)
        return i
    }

    return -1;

  }

  $scope.docTypeList= NationalityCountriesRaceList.getDocType();
  $scope.countryList= NationalityCountriesRaceList.getCountryList();
  convertToLowerCasing($scope.countryList);

  var findDocTypeDesc= function(DocTypeCode){

    for(var i =0; i< $scope.docTypeList.length;i++){

      if($scope.docTypeList[i].docType === DocTypeCode)
      {
        return $scope.docTypeList[i].docTypeDesc;
      }

    }

    return -1;

  }

  var findDocType= function(DocDesc){

    for(var i =0; i< $scope.docTypeList.length;i++){

      if($scope.docTypeList[i].docTypeDesc === DocDesc)
      {
        return $scope.docTypeList[i].docType;
      }

    }

    return -1;

  }

  $scope.documentBuffer= {};

  $ionicModal.fromTemplateUrl('templates/add-edit-doc.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal3 = modal;
  });

  $scope.showDocumentPopup = function(docNo) {

    var templateURL= 'templates/add-edit-doc.html';
    $scope.title= {};
    $scope.docListIndex= {};
    $scope.documentBuffer= {};

    if(docNo === 'add-doc')
    {
      $scope.addOrEditDoc='add';
      $scope.docListIndex= $scope.newUserDetails.parties.partyDoc.item.length;
      $scope.title= 'Add a New Document';
    }
    else
    {
      $scope.addOrEditDoc='edit';
      $scope.docListIndex= findDocument(docNo);
      $scope.documentBuffer= angular.copy($scope.newUserDetails.parties.partyDoc.item[$scope.docListIndex]);
      $scope.documentBuffer.docTypeDesc= findDocTypeDesc($scope.documentBuffer.docType);


      $scope.title= 'Edit Document ' + docNo;
    }

    $scope.modal3.show();

  }

  $scope.$watch('documentBuffer.docTypeDesc', function(newV, oldV){
      console.log('documentBuffer.docTypeDesc', newV);
      $scope.documentBuffer.docType= findDocType(newV);
  });

  $scope.documentRevert= function () {
    $scope.documentBuffer= {};
    $scope.modal3.hide();
  }

  $scope.documentUpdate= function () {
    $scope.newUserDetails.parties.partyDoc.item[$scope.docListIndex]= angular.copy($scope.documentBuffer);
    $scope.modal3.hide();
  }

  var ipObj1 = {
    callback: function (val) {  //Mandatory
      console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      var day= new Date(val).getDate(),
        month= new Date(val).getMonth() + 1,
        year= new Date(val).getFullYear();
      $scope.documentBuffer.docIssueDate= year + "-" + month  + "-" + day;
    },
    from: new Date(1900, 1, 1), //Optional
    to: new Date(),             //Optional
    mondayFirst: true,          //Optional
    templateType: "modal"       //Optional
  };
  var ipObj2 = {
    callback: function (val) {  //Mandatory
      console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      var day= new Date(val).getDate(),
        month= new Date(val).getMonth() + 1,
        year= new Date(val).getFullYear();
      $scope.documentBuffer.docExpiryDate= year + "-" + month  + "-" + day;
    },
    from: new Date(1900, 1, 1), //Optional
    to: new Date(),             //Optional
    mondayFirst: true,          //Optional
    templateType: "modal"       //Optional
  };


  $scope.openDatePickerDateOfIssue = function() {
    ionicDatePicker.openDatePicker(ipObj1);
  }
  $scope.openDatePickerDateOfExpiry = function() {
    ionicDatePicker.openDatePicker(ipObj2);
  }

//------------------------End of Configure Add/Edit Document Modal------------------------------------


  var ipObj3 = {
    callback: function (val) {  //Mandatory
      console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      var day= new Date(val).getDate(),
        month= new Date(val).getMonth() + 1,
        year= new Date(val).getFullYear();
      $scope.newUserDetails.parties.partyDetl.partyRetail.birthDate= year + "-" + month  + "-" + day;
    },
    from: new Date(1900, 1, 1), //Optional
    to: new Date(),             //Optional
    mondayFirst: true,          //Optional
    templateType: "modal"       //Optional
  };


  $scope.openDatePickerBirthDate = function() {
    ionicDatePicker.openDatePicker(ipObj3);
  }

  $scope.nationalityList= NationalityCountriesRaceList.getNationalityList();
  $scope.raceList= NationalityCountriesRaceList.getRaceList();

  $scope.educationLevelList= NationalityCountriesRaceList.getEducationLevelList();

  //------------------------Configure Add/Edit Contact Modal-------------------------------------------



  $ionicModal.fromTemplateUrl('templates/add-edit-contact.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal4 = modal;
  });

  $scope.contactBuffer= {};
  $scope.phoneTypeList=  NationalityCountriesRaceList.getPhoneTypeList();


  $scope.showContactPopup= function (contactIndex) {

    if(contactIndex === 'add-contact'){
      $scope.contactBuffer={};
      $scope.contactBuffer.phone={};
      $scope.title= "Add a Contact";
    }
    else{
      $scope.contactIndex= contactIndex;
      $scope.contactBuffer= angular.copy($scope.newUserDetails.parties.contacts.phoneDetl.item[contactIndex]);
      $scope.contactBuffer.phoneTypeDesc= getPhoneTypeDesc($scope.phoneTypeList,  $scope.contactBuffer.phone.phoneType);
      $scope.title= "Edit Contact: " + $scope.newUserDetails.parties.contacts.phoneDetl.item[contactIndex].contactName;
    }
    $scope.modal4.show();
  }

  var ipObj4 = {
    callback: function (val) {  //Mandatory
      console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      var day= new Date(val).getDate(),
        month= new Date(val).getMonth() + 1,
        year= new Date(val).getFullYear();
      $scope.contactBuffer.phone.effectiveDate= year + "-" + month  + "-" + day;
    },
    from: new Date(1900, 1, 1), //Optional
    to: new Date(),             //Optional
    mondayFirst: true,          //Optional
    templateType: "modal"       //Optional
  };


  $scope.openDatePickerEffectiveDate = function() {
    ionicDatePicker.openDatePicker(ipObj4);
  }

  var ipObj5 = {
    callback: function (val) {  //Mandatory
      console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      var day= new Date(val).getDate(),
        month= new Date(val).getMonth() + 1,
        year= new Date(val).getFullYear();
      $scope.contactBuffer.phone.expiryDate= year + "-" + month  + "-" + day;
    },
    from: new Date(1900, 1, 1), //Optional
    to: new Date(),             //Optional
    mondayFirst: true,          //Optional
    templateType: "modal"       //Optional
  };


  $scope.openDatePickerExpiryDate = function() {
    ionicDatePicker.openDatePicker(ipObj5);
  }

  $scope.contactUpdate= function () {
    $scope.newUserDetails.parties.contacts.phoneDetl.item[$scope.contactIndex]= angular.copy($scope.contactBuffer);
    $scope.modal4.hide();
  }

  $scope.contactRevert= function () {
    $scope.contactBuffer= {};
    $scope.modal4.hide();
  }
  //------------------------End of Add/Edit Contact Modal-------------------------------------------


  $scope.closeAddUserDLG= function () {
    NewUserRequestTemplate.getTemplate().then(function (data) {
      $scope.newUserDetails= angular.copy(data);
      console.log("newUserDetails", data)
    },function(response){
      console.log(response);
    });

    $ionicSlideBoxDelegate.$getByHandle('add-user-dlg').slide(0);
    $scope.modal2.hide();
  }
  //-------------------------Configurables for Camera Plugin-----------------------------------------------------------

  $scope.photoTakenFlag= false;
  $scope.imgData= '';

  $scope.takePicture= function(){

    $ionicPlatform.ready(function() {

      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation:true
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        var image = document.getElementById('welcome-page-profile');
        image.src = "data:image/jpeg;base64," + imageData;
        $scope.imgData= imageData;

      }, function(err) {
          console.log('Could not Intialize Camera', err);
      });


    });



  }

  //-------------------------End of Camera Plugin----------------------------------------------------------------------

})

.controller('PlaylistsCtrl', function($scope, productData, $ionicModal, $ionicSlideBoxDelegate, $ionicPopup, $q) {

  $scope.playlists = $scope.$parent.$parent.productData;
  console.log("productData:", $scope.playlists.partiesProducts.productsList.item);

  //----------------------Configurable scope variables---------------------
  $scope.addAccountDLGTitle= "Add An Account";

  $scope.addAccountDetails= {};
  $ionicModal.fromTemplateUrl('templates/add-account.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.disableSwipe= function () {
    $ionicSlideBoxDelegate.$getByHandle('add-account-dlg').enableSlide(false);
  }

  $scope.closeAddAccountDLG = function() {
    $scope.showConfirmtionPopup().then(function(res){
      if(res){
        $scope.addAccountDetails = {};
        $ionicSlideBoxDelegate.$getByHandle('add-account-dlg').slide(0);
        $scope.modal.hide();
      }
    });
  }
  $scope.openAddAccountDLG = function() {
    $scope.addAccountDLGTitle= "Add An Account";
    $ionicSlideBoxDelegate.$getByHandle('add-account-dlg').slide(0);
    $scope.modal.show();
  }

  //-----------------------------Slide Mechanisms---------------------------------
  $scope.enablePrevious= function () {
    var currentSlide= $ionicSlideBoxDelegate.$getByHandle('add-account-dlg').currentIndex();
    var predicate= true;

    switch(currentSlide){
      case 0:
          predicate= false;
        break;
      case 1:
        break;
      default:
        break;
    };

    return predicate;

  }
  $scope.previousSlide= function () {
    var currentSlide= $ionicSlideBoxDelegate.$getByHandle('add-account-dlg').currentIndex();
    if(currentSlide>0)
      $ionicSlideBoxDelegate.$getByHandle('add-account-dlg').slide(currentSlide - 1);
  }

  $scope.enableNext= function () {
    var currentSlide= $ionicSlideBoxDelegate.$getByHandle('add-account-dlg').currentIndex();
    var predicate= true;

    switch(currentSlide){
      case $ionicSlideBoxDelegate.$getByHandle('add-account-dlg').slidesCount() - 1:
        predicate= false;
        break;
      case 0:
        break;
      case 1:
        break;
      default:
        break;
    };

    return predicate;
  }
  $scope.nextSlide= function () {
    var currentSlide= $ionicSlideBoxDelegate.$getByHandle('add-account-dlg').currentIndex();
    if(currentSlide < $ionicSlideBoxDelegate.$getByHandle('add-account-dlg').slidesCount() - 1)
      $ionicSlideBoxDelegate.$getByHandle('add-account-dlg').slide(currentSlide + 1);
  }

  $scope.closeAddAccount = {};
  $scope.showConfirmtionPopup = function() {
    var defer= $q.defer();
    var myPopup = $ionicPopup.confirm({
      template: 'Closing this session will cause all session information to be lost',
      title: 'Close this Add Account Session?'
    });
    myPopup.then(function(res){
      defer.resolve(res);
    });

    return defer.promise;
  }

  //-------------------------Utility functions for initializing donutChart-------------------

  $scope.donutChartData= [];
  var donutChartColorData= [];


  var convertProductlistToDonutChartData= function () {

    var productList= angular.copy($scope.playlists.partiesProducts.productsList.item);

    for(var i = 0; i< productList.length; i++) {
      var obj = {};
      obj.productId = productList[i].depositAccount.productDesc;
      obj.frequency= 0;
      obj.objects= [];
      var objCode= productList[i].depositAccount.productCode;

      for (var j = i; j < productList.length; j++)
        if(objCode === productList[j].depositAccount.productCode){
          obj.frequency++;
          obj.objects.push(productList.splice(j,1).depositAccount);
        }
      $scope.donutChartData.push(obj);
    }

    for(var i = 0; i< $scope.donutChartData.length; i++) {
      donutChartColorData.push(getRandomColor());
    }
  }

  convertProductlistToDonutChartData();

  $scope.donutColorFunction = function() {
    return function(d, i) {
      return donutChartColorData[i];
    };
  }

  $scope.xFunction= function () {
    return function(d){
      return d.productId;
    };
  }

  $scope.yFunction= function () {

    return function(d){
      return d.frequency;
    };

  }

  //---------------------------Sign in With iBanking----------------------------------------

  var SignInWithIBanking= function () {

  }



})

.controller('PlaylistCtrl', function($scope, $stateParams,productData) {

  var finditem= function(id) {

    var playlist = $scope.$parent.$parent.productData;

    for (var i = 0; i < playlist.partiesProducts.productsList.item.length; i++) {

      if (id == playlist.partiesProducts.productsList.item[i].depositAccount.accountId)
        return playlist.partiesProducts.productsList.item[i];
    }
    return null;

  }

  $scope.account= finditem($stateParams.playlistId);

})
  .controller('AboutMeCtrl', function($scope, $ionicPopup,$ionicModal, $ionicPopover, partyData, ionicDatePicker, NationalityCountriesRaceList, $ionicBackdrop, $timeout, $ionicSlideBoxDelegate) {

        $scope.personalDetails= $scope.$parent.$parent.partyData;
        console.log("personalDetails",  $scope.personalDetails )

        $scope.buffer= angular.copy($scope.personalDetails);
        $scope.forComparison= angular.copy($scope.personalDetails);

        $scope.editModeFlag= false;

        $scope.cardItems=[

          [{
          "icon1":"icon ion-person",
          "icon2": null,
          "label":"Name:",
          "value":$scope.buffer.parties.partyDetl.partyRetail.partyName.salutation + " " + $scope.buffer.parties.partyDetl.partyRetail.partyName.fullName,
          "editMode": false,
          "isEdited": false
        },
          {
            "icon1":"icon ion-happy",
            "icon2": null,
            "label":"Birth Date:",
            "value": $scope.buffer.parties.partyDetl.partyRetail.birthDate,
            "editMode": false,
            "isEdited": false
          },
          {
            "icon1":"icon ion-female",
            "icon2": "icon ion-male",
            "label":"Gender:",
            "value": $scope.buffer.parties.partyDetl.partyRetail.gender,
            "editMode": false,
            "isEdited": false

          },
          {
            "icon1":"icon ion-earth",
            "icon2": null,
            "label":"Nationality:",
            "value": $scope.buffer.parties.partyDetl.partyRetail.nationalityDesc,
            "editMode": false,
            "isEdited": false

          },

          {
            "icon1":"icon ion-ios-color-filter",
            "icon2": null,
            "label":"Race:",
            "value": $scope.buffer.parties.partyDetl.partyRetail.raceDesc,
            "editMode": false,
            "isEdited": false

          }],
          [{
            "icon1":"icon ion-home",
            "icon2": null,
            "label":"Country of Residence:",
            "value": $scope.buffer.parties.partyDetl.partyRetail.residenceCtryDesc,
            "editMode": false,
            "isEdited": false

          },
          {
            "icon1":"icon ion-ios-telephone",
            "icon2": null,
            "label":"Contact:",
            "value": $scope.buffer.parties.contacts.phoneDetl.item[0].phone.phoneNumber,
            "editMode": false,
            "isEdited": false

          },
          {
            "icon1":"icon ion-ios-email",
            "icon2": null,
            "label":"Email:",
            "value": $scope.buffer.parties.contacts.emailDetl.item[0].emailAddressDetl.emailAddress,
            "editMode": false,
            "isEdited": false

          }],
          [{
            "icon1":"icon ion-hammer",
            "icon2": null,
            "label":"Employer:",
            "value": $scope.buffer.parties.partyDetl.partyRetail.employment.employerName,
            "editMode": false,
            "isEdited": false

          },{
            "icon1":"icon ion-settings",
            "icon2": null,
            "label":"Occupation:",
            "value": $scope.buffer.parties.partyDetl.partyRetail.employment.occupation,
            "editMode": false,
            "isEdited": false

          }]];

    $scope.backup= angular.copy($scope.cardItems);

    $scope.toggleEditMode= function(parentIndex,index){
      for(var i=0;i<$scope.cardItems.length; i++)
        for(var j=0;j<$scope.cardItems[i].length;j++)
          $scope.cardItems[i][j].editMode= i===parentIndex && j===index;
    }

    $scope.editModecheck= function(){
      $scope.editModeFlag= false
      for(var i=0;i<$scope.cardItems.length; i++)
        for(var j=0;j<$scope.cardItems[i].length;j++)
          if($scope.cardItems[i][j].editMode === true)
            $scope.editModeFlag= true;
    }

    $ionicModal.fromTemplateUrl('templates/edit.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.closeEdit = function() {
      console.log("buffer", $scope.buffer);
      console.log("value", $scope.cardItems[0][0].value);
      $scope.modal.hide();
    }
    $scope.revert= function(){
      $scope.buffer= angular.copy($scope.personalDetails);
      $scope.closeEdit();
    }

    $scope.apply= function(parentIndex, index, value){
      updateCardItems(parentIndex, index, value)

      $scope.personalDetails= angular.copy($scope.buffer);
      $scope.editModeFlag= true;

        $scope.closeEdit();
    }

    $scope.edit= function(labelToEdit, parentIndex, index){

      $scope.labelToEdit= labelToEdit;
      $scope.index= index;
      $scope.parentIndex= parentIndex;

      if(labelToEdit === "Birth Date:"){
        $scope.openDatePicker();
      }
      else{
        $scope.modal.show();
      }

    }

    var updateCardItems= function(parentIndex,index, value){
          $scope.cardItems[parentIndex][index].value= value;
          $scope.cardItems[parentIndex][index].isEdited= true;
    }

    var ipObj1 = {
      callback: function (val) {  //Mandatory
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        var day= new Date(val).getDate(),
            month= new Date(val).getMonth() + 1,
            year= new Date(val).getFullYear();
        $scope.buffer.parties.partyDetl.partyRetail.birthDate= year + "-" + month  + "-" + day;
        updateCardItems($scope.parentIndex, $scope.index, $scope.buffer.parties.partyDetl.partyRetail.birthDate);
        $scope.personalDetails= angular.copy($scope.buffer);
        $scope.editModeFlag= true;
      },
      from: new Date(1900, 1, 1), //Optional
      to: new Date(),             //Optional
      mondayFirst: true,          //Optional
      templateType: "modal"       //Optional
    };

    $scope.openDatePicker = function() {
      ionicDatePicker.openDatePicker(ipObj1);
    }

    $scope.nationalityList= NationalityCountriesRaceList.getNationalityList();

    convertToUpperCasing($scope.nationalityList);

    $scope.raceList= NationalityCountriesRaceList.getRaceList();
    convertToUpperCasing($scope.raceList);

    $scope.countriesList= NationalityCountriesRaceList.getCountryList();
    convertToUpperCasing($scope.countriesList);


    $scope.doNotSubmit=function () {
      $scope.personalDetails= angular.copy($scope.forComparison);
      $scope.buffer= angular.copy($scope.forComparison);
      $scope.cardItems= angular.copy($scope.backup);
      $scope.editModeFlag= false;
      $scope.submissionList=[];

    }

    $scope.submissionList=[]

    var harvestSubmissionList= function () {

      $scope.submissionList=[]

      for(var i=0;i<$scope.cardItems.length;i++)
        for(var j=0; j<$scope.cardItems[i].length;j++)
          if($scope.cardItems[i][j].isEdited){
            $scope.submissionList.push($scope.cardItems[i][j]);
          }
    }

    $scope.confirmationDLGTitle="Confirm Submission?";

    $ionicModal.fromTemplateUrl('templates/confirmation.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal2 = modal;
    });

    $scope.successfulSubmission= false;
    $scope.closeConfirmation = function() {
      $scope.modal2.hide();
      $ionicSlideBoxDelegate.$getByHandle('confirmation-dlg').slide(0);
      $scope.confirmationDLGTitle="Confirm Submission?";
    }

    $scope.confirmationDoNotSubmit= function(){
      //$scope.doNotSubmit();
      $scope.closeConfirmation();
    }

    $scope.openConfirmation= function(){
      harvestSubmissionList();
      $scope.modal2.show();
    }

    $scope.removeSubmissionRecord= function (index) {
      $scope.submissionList.splice(index, 1);

    }

    $scope.activateSpinner= false;

    $scope.submit=function () {

      $scope.activateSpinner= true;
      $ionicBackdrop.retain();

      //put http code here
      $timeout(function() {
        $ionicBackdrop.release();
        $scope.confirmationDLGTitle="Submission Confirmed!";
        $scope.activateSpinner= false;
        $scope.successfulSubmission= true;

        //if submission successful
        if($scope.successfulSubmission)
        {
          for(var i=0;i<$scope.cardItems.length;i++)
            for(var j=0; j<$scope.cardItems[i].length;j++)
              $scope.cardItems[i][j].isEdited= false;

          $scope.$parent.$parent.partyData= angular.copy($scope.personalDetails);
          $scope.forComparison= angular.copy($scope.personalDetails);
          $scope.buffer= angular.copy($scope.personalDetails);
          $scope.backup= angular.copy($scope.cardItems);
          $scope.editModeFlag= false;
          $scope.submissionList=[];

          console.log("personalDetails",$scope.personalDetails);
          console.log("forComparison",$scope.forComparison);
          console.log("buffer",$scope.buffer);
          console.log("cardItems",$scope.cardItems);
          console.log("backup",$scope.backup);
        }
        $ionicSlideBoxDelegate.$getByHandle('confirmation-dlg').slide(1);
      }, 5000);

    }

    $scope.disableSwipe= function () {
      console.log("Im Here!")
      $ionicSlideBoxDelegate.$getByHandle('confirmation-dlg').enableSlide(false);
    }

    $scope.$on('modal2.hidden', function() {
      $scope.modal.remove();
    });

  })
.controller('BranchesCtrl', function($scope, $rootScope, BranchLocater, $cordovaGeolocation, $ionicSlideBoxDelegate, $timeout, $ionicPlatform, branchListFilter, $ionicPopover, $q, $ionicModal, Appointments, NotificationManager, $ionicScrollDelegate, $ionicBackdrop) {

  $scope.activeSlide= 0;
  $scope.searchRadius= 0.01;
  $scope.searchRadiusInKilometers= $scope.searchRadius * 112;

  $scope.searchRadiusInKilometersPopover = {
    value: $scope.searchRadiusInKilometers,
    min: 0 ,
    max: 50
  };

  $scope.$watchCollection('searchRadiusInKilometersPopover',function(oldV, newV){

    console.log('searchRadius: ', $scope.searchRadiusInKilometersPopover);

    $scope.searchRadiusInKilometers= $scope.searchRadiusInKilometersPopover.value;
    $scope.searchRadius= $scope.searchRadiusInKilometers / 112;

    //$scope.branchList= branchListFilter($scope.branchList, $scope.$parent.$parent.currentPosition, $scope.searchRadius, 'Branch');
  });



  //Infinite Slide Box Variables
  var head, tail, default_slides_indexes = [ -1, 0, 1 ], default_slides= [], direction = 0;;

  var makeSlide = function ( nr, data ) {
    return angular.extend( data, {
      nr : nr
    });
  };

  var initializeBranchList= function () {

    var defer= $q.defer();

    BranchLocater.getAllBranches().then(function (data) {

      $scope.branchList= data;
      $scope.branchList= branchListFilter($scope.branchList, $scope.$parent.$parent.currentPosition, $scope.searchRadius, 'Branch');

      console.log("branches: ", $scope.branchList);

      default_slides = [
        makeSlide( default_slides_indexes[ 0 ], $scope.branchList[$scope.branchList.length - 1]),
        makeSlide( default_slides_indexes[ 1 ], $scope.branchList[0]),
        makeSlide( default_slides_indexes[ 2 ], $scope.branchList[1])
      ];
      $scope.slidesDisplay = angular.copy( default_slides );
      $scope.selectedSlide = 1; // initial

      head = $scope.slidesDisplay[ 0 ].nr,
        tail = $scope.slidesDisplay[ $scope.slidesDisplay.length - 1 ].nr;

      //timeout to wait for slide-box to compile
      $timeout(function(){
        $ionicSlideBoxDelegate.$getByHandle('branch-locator-dlg').update();
      });

      defer.resolve(true);

    },function (error) {

      console.log(error);
      defer.resolve(false);

    });

    return defer.promise;

  }

  initializeBranchList();

  //---------------------------Configure Google Maps---------------------------------------------

  $ionicPlatform.ready(function() {
    //Wrap in timeout function to wait for DOM to compile
    $timeout(function () {

      var icon = {
        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        scale: 5,
        strokeWeight: 2,
        strokeColor: "#11C1F3",
        fillColor: "#11C1F3",
        fillOpacity: 0.6,
        rotation: $scope.$parent.$parent.deviceOrientation.trueHeading
      };

      var options = {timeout: 10000, enableHighAccuracy: true};

      var myMarker = {};
      var latLng = {};


      if (!_.isEmpty($scope.$parent.$parent.currentPosition))
        latLng = new google.maps.LatLng($scope.$parent.$parent.currentPosition.lat, $scope.$parent.$parent.currentPosition.lng);
      else if (!_.isEmpty($scope.$parent.$parent.startPosition))
        latLng = new google.maps.LatLng($scope.$parent.$parent.startPosition.lat, $scope.$parent.$parent.startPosition.lng);
      else
        latLng = new google.maps.LatLng(-34.397, 150.644);

      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

      $scope.branchMarkerList= [];

      google.maps.event.addListenerOnce($scope.map, 'idle', function () {

        myMarker = new google.maps.Marker({
          icon: icon,
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
        });

        populateBranchMarkerList();

      });

      $scope.$parent.$parent.$watchCollection('deviceOrientation', function (oldV, newV) {

        console.log("deviceRotation changed!");

        icon = {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 5,
          strokeWeight: 2,
          strokeColor: "#11C1F3",
          fillColor: "#11C1F3",
          fillOpacity: 0.6,
          rotation: $scope.$parent.$parent.deviceOrientation.magneticHeading
        };

        if (!_.isEmpty(myMarker)) {
          myMarker.setOptions({
            icon: icon
          });
        }

      });

      $scope.$parent.$parent.$watchCollection('currentPosition', function (oldV, newV) {

        console.log("currentPosition changed! :", $scope.$parent.$parent.currentPosition);

        if (!_.isEmpty(myMarker)) {
          myMarker.setPosition($scope.$parent.$parent.currentPosition);
        }

      });
    });
  });

  var populateBranchMarkerList= function () {

    for(var i=0; i< $scope.branchList.length; i++)
    {
      var targetMarker= new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: {lat: $scope.branchList[i].latitude, lng: $scope.branchList[i].longitude}
      });

      $scope.branchMarkerList[i]= targetMarker;
    }

  }

  var clearAllMarkers= function () {

    for(var i=0; i < $scope.branchMarkerList.length; i++)
      $scope.branchMarkerList[i].setMap(null);

    $scope.branchMarkerList= [];

  }

  var previousMarker= {};
  var firstTimeSwitchFocus= true;

  var switchFocus= function (steps, displayIndex) {

    $scope.map.setCenter({lat: $scope.slidesDisplay[displayIndex].latitude, lng: $scope.slidesDisplay[displayIndex].longitude})
    $scope.map.setZoom(16);


    var i =convertStepsToIndex(steps);

    $scope.branchMarkerList[i].setAnimation(null);

    $timeout(function () {

      $scope.branchMarkerList[i].setAnimation(google.maps.Animation.BOUNCE);
      previousMarker=  $scope.branchMarkerList[i];

    },100);

    if(!firstTimeSwitchFocus){
      previousMarker.setAnimation(null);
    }

    firstTimeSwitchFocus= false;

  }

  //---------------------------End of Google Maps Configuration---------------------------------------------

  //------------------------Configure Slide-box-------------------------------------------------

  var convertStepsToIndex= function(steps){

    var index= 0;

    if(steps < 0 && !(Math.abs(steps) % 10 === 0))
      index = $scope.branchList.length - (Math.abs(steps) % $scope.branchList.length)
    else
      index = Math.abs(steps) > $scope.branchList.length -1 ? Math.abs(steps) % $scope.branchList.length : steps;

    return index;

  }

  $scope.previousSlide = function() {
    $ionicSlideBoxDelegate.$getByHandle('branch-locator-dlg').previous();
  };
  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.$getByHandle('branch-locator-dlg').next();
  };

  $scope.showDefaultSlides = function () {
    var
      i              = $ionicSlideBoxDelegate.$getByHandle('branch-locator-dlg').currentIndex(),
      previous_index = i === 0 ? 2 : i - 1,
      next_index     = i === 2 ? 0 : i + 1;

    angular.copy( default_slides[ 1 ], $scope.slides[ i ] );
    angular.copy( default_slides[ 0 ], $scope.slides[ previous_index ] );
    angular.copy( default_slides[ 2 ], $scope.slides[ next_index ] );
    direction = 0;
    head      = $scope.slides[ previous_index ].nr;
    tail      = $scope.slides[ next_index ].nr;
  };

  $scope.loadSlideDisplay = function ( i ) {

    switchFocus($scope.slidesDisplay[i].nr, i);

    var
      previous_index = i === 0 ? 2 : i - 1,
      next_index     = i === 2 ? 0 : i + 1,
      new_direction  = $scope.slidesDisplay[ i ].nr > $scope.slidesDisplay[ previous_index ].nr ? 1 : -1;

    angular.copy(
      createSlideData( new_direction, direction ),
      $scope.slidesDisplay[ new_direction > 0 ? next_index : previous_index ]
    );
    direction = new_direction;
  };

  var createSlideData = function ( new_direction, old_direction ) {
    var nr;

    if ( new_direction === 1 ) {
      tail = old_direction < 0 ? head + 3 : tail + 1;
    }
    else {
      head = old_direction > 0 ? tail - 3 : head - 1;
    }

    nr = new_direction === 1 ? tail : head;

    var index= {};

    if(nr < 0 && !(Math.abs(nr) % 10 === 0))
      index = $scope.branchList.length - (Math.abs(nr) % $scope.branchList.length)
    else
      index = Math.abs(nr) > $scope.branchList.length -1 ? Math.abs(nr) % $scope.branchList.length : nr;

    /*if ( default_slides_indexes.indexOf( nr ) !== -1 ) {
      return default_slides[ default_slides_indexes.indexOf( nr ) ];
    };*/
    return makeSlide( nr, $scope.branchList[index < 0 ? $scope.branchList.length + index: index]);
  };
  //--------------------End of Slide Box Configuration------------------------------------------

  //--------------------Search Radius Popover Configuration-------------------------------------

  $ionicPopover.fromTemplateUrl('search-radius-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.openSearchRadiusPopover= function ($event) {
    $scope.popover.show($event);
  }

  $scope.$on('popover.hidden', function() {

    initializeBranchList().then(function (success) {
      clearAllMarkers();
      populateBranchMarkerList();

      $scope.map.setCenter($scope.$parent.$parent.currentPosition)

    },function (error) {
      //TODO: Add more error handling
      console.log(error);
    });

  });
  //--------------------End of Search Radius Popover Configuration-------------------------------------
  //--------------------Modal for Scheduler------------------------------------------------------------

  $scope.eventSource= [];

  //Configurables for Scheduler

  var month = ["Jan","Feb","Mar","Apr","May","June","Jul", "Aug","Sep","Oct","Nov","Dec"];

  var convertAppointmentsToEvents= function (appointments) {

    var eventList=[];

    for(var i= 0; i< appointments.apptslots.length; i++){

      var targetDate= appointments.apptslots[i].slotDate.split("-")

      var startyear= targetDate[2];
      var startmonth= targetDate[1];
      var startday= targetDate[0];

      var endyear= targetDate[2];
      var endmonth= targetDate[1];
      var endday= targetDate[0];

      var starthour= 8;
      var endhour= 17;

      switch(appointments.apptslots[i].slotTime){

        case 'Early Morning(8am to 10am) GMT+8':
          starthour= 8;
          endhour= 10;
          break;
        case 'Morning(9am to 12pm) GMT+8':
          starthour= 9;
          endhour= 12;
          break;
        case 'Lunch(12pm to 2pm) GMT+8':
          starthour= 12;
          endhour= 14;
          break;
        case 'Afternoon(2pm to 6pm) GMT+8':
          starthour= 14;
          endhour= 18;
          break;
        default:
          break;
      };

      var start= new Date(parseInt(startyear), parseInt(startmonth) - 1, parseInt(startday), parseInt(starthour), 0, 0, 0),
          end = new Date(parseInt(endyear), parseInt(endmonth) - 1, parseInt(endday), parseInt(endhour), 0, 0, 0);

      eventList[i]={

        title: appointments.apptslots[i].slotDate,
        startTime: start,
        endTime: end,
        allDay: false,
        reserved: false

      }
    }

    return eventList;
  }

  var convertEventToAppointment= function(event){

    var appt= {
      slotDate : event.title
    }

    if(event.startTime.getHours() === 8 && event.endTime.getHours() === 10 ){
        appt.slotTime = 'Early morning (8am - 10am) GMT+8';
    }else if(event.startTime.getHours() === 9 && event.endTime.getHours() === 12 ){
        appt.slotTime = 'Morning(9am to 12pm) GMT+8';
    }else if(event.startTime.getHours() === 12 && event.endTime.getHours() === 14 ){
      appt.slotTime = 'Lunch(12pm to 2pm) GMT+8';
    }else if(event.startTime.getHours() === 14 && event.endTime.getHours() === 18 ){
      appt.slotTime = 'Afternoon(2pm to 6pm) GMT+8';
    }else{
      //Throw exception
    }

    return appt;
  }

  $scope.mode= "month";
  $scope.modalTitle= new Date().getDate() + ' ' + month[parseInt(new Date().getMonth())] + ' ' + new Date().getFullYear();
  $scope.currentDate= new Date();
  $scope.monthviewEventDetailTemplateUrl= "templates/available-appointment.html";

  $ionicModal.fromTemplateUrl('templates/book-appointment.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  var branchSelected= {};

  $scope.openBookAppointmentDLG= function (branch) {

    branchSelected= branch;

    Appointments.getAllAppointmentsMockData($scope.$parent.$parent.apikey, $scope.$parent.$parent.uuid, $scope.$parent.$parent.accessToken, branch.branchId).then(function (data) {

      $scope.eventSource= convertAppointmentsToEvents(data);

      $scope.modal.show();

    },function(error){

      console.log("Could not find appointments for selected Branch", error);

    });
  }

  $scope.onTimeSelected = function (selectedTime, events) {

    console.log(selectedTime);
    $ionicScrollDelegate.$getByHandle('appointment-details').scrollTop();

  };

  $ionicModal.fromTemplateUrl('templates/book-appointment-confirmation.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal1 = modal;
  });

  $scope.bookAppointmentConfirmationData={};
  $scope.activateSpinner= false;

  $scope.onEventSelected= function(event){

      console.log("event selected:", event);

      $scope.bookAppointmentConfirmationData= {
        selectedBranch : branchSelected.name,
        appointmentDate: event.title,
        appointmentTime: convertEventToAppointment(event).slotTime,
        appointmentReason: "",
        event: event
      }

      $scope.modal1.show();

  }

  $scope.requestAppointment= function () {

    var userReq= {
      "customer": {
        "customerSalutation": $scope.$parent.$parent.partyData.parties.partyDetl.partyRetail.partyName.salutation,
        "firstName": $scope.$parent.$parent.partyData.parties.partyDetl.partyRetail.partyName.fullName,
        "lastName": "",
        "idNumber": $scope.$parent.$parent.partyData.parties.partyInternalId.CISInternalId.CISCIN,
        "iWantTo": $scope.bookAppointmentConfirmationData.appointmentReason,
        "isExistingCustomer": true,
        "disclaimerChecked": true
      },
      "appointment": {
        "selectedBranch": branchSelected.name,
        "appointmentDate": event.title,
        "appointmentTime": $scope.bookAppointmentConfirmationData.appointmentTime,
        "sendReminder": true,
        "callMeOnNumber": true,
        "email": $scope.$parent.$parent.partyData.parties.contacts.emailDetl.item[0].emailAddressDetl.emailAddress,
        "mobileNumber": {
          "prefix": "+65",
          "number": $scope.$parent.$parent.partyData.parties.contacts.phoneDetl.item[0].phone.phoneNumber
        },
        "appointmentReason": $scope.bookAppointmentConfirmationData.appointmentReason
      },
      "preferredBranch": branchSelected.name,
      "platform": ionic.Platform.platform()
    };

    Appointments.requestAppointment($scope.$parent.$parent.apikey, $scope.$parent.$parent.uuid, $scope.$parent.$parent.accessToken, userReq).then(function(success){




    }, function(error){

      console.log('Unable to POST appointment request',error);

    });

    NotificationManager.sendSMSNotification('6581860872').then(function(success){

      console.log('NotificationManager:', success);

    }, function(error){

      console.log('NotificationManager:', error);

    });

    /*Simulate a POST request*/

    $scope.activateSpinner= true;
    $ionicBackdrop.retain();

    $timeout(function(){
      $scope.activateSpinner= false;
      $ionicBackdrop.release();
      $scope.modal1.hide();
      $scope.bookAppointmentConfirmationData.event.reserved= true;
    }, 3000);

  }

  $scope.cancelAppointment= function () {

    $scope.modal1.hide();

  }

  $scope.onViewTitleChanged= function(title){
    $scope.modalTitle= title;
  }

  $scope.closeCalendar= function () {
    $scope.modal.hide();
  }

  //---------------------------------------------------------------------------------------------------



}).controller('AppointmentsCtrl', function($scope, $ionicScrollDelegate) {

  //----------------Configurables for Calendar------------------
  $scope.currentDate= new Date();
  $scope.mode= 'month';
  $scope.monthviewEventDetailTemplateUrl= 'templates/booked-appointments.html';

  $scope.eventSource= [{

    title: '',
    startTime: new Date($scope.currentDate.getTime() + (1*24*60*60*1000) + (9*60*60*1000)),
    endTime: new Date($scope.currentDate.getTime() + (1*24*60*60*1000) + (12*60*60*1000)),
    allDay: false,
    reserved: true,
    branchName: 'Sengkang HDB Branch Office'

  }, {

    title: '',
    startTime: new Date($scope.currentDate.getTime() + (1*24*60*60*1000) + (12*60*60*1000)),
    endTime: new Date($scope.currentDate.getTime() + (1*24*60*60*1000) + (14*60*60*1000)),
    allDay: false,
    reserved: true,
    branchName: 'DBS Sports Hub Branch 1'

  },{
    title: '',
    startTime: new Date($scope.currentDate.getTime() + (2*24*60*60*1000) + (8*60*60*1000)),
    endTime: new Date($scope.currentDate.getTime() + (2*24*60*60*1000) + (10*60*60*1000)),
    allDay: false,
    reserved: true,
    branchName: 'Bedok Branch'
  },{
    title: '',
    startTime: new Date($scope.currentDate.getTime() + (5*24*60*60*1000) + (9*60*60*1000)),
    endTime: new Date($scope.currentDate.getTime() + (5*24*60*60*1000) + (12*60*60*1000)),
    allDay: false,
    reserved: true,
    branchName: 'Buona Vista Corp Branch'
  }];

  var month = ["January","February","March","April","May","June","July", "August","September","October","November","December"];
  $scope.viewTitle= month[parseInt($scope.currentDate.getMonth())] + ' ' + new Date().getFullYear();

  $scope.onTimeSelected = function (selectedTime, events) {

    console.log(selectedTime);
    $ionicScrollDelegate.$getByHandle('booked-appointment-details').scrollTop();

  };

  $scope.onViewTitleChanged= function(title){
    $scope.viewTitle= title;
  }


}).controller('CallbackCtrl', function($state, $ionicPlatform, $cordovaInAppBrowser, $window, $scope, $ionicScrollDelegate) {

  $ionicPlatform.ready(function(){

    var isDevice= window.cordova;
    var authCode= '';

    if(isDevice){
      /* Add Code Callback for $cordovaInAppBrowser*/

    }
    else{

      var url= $window.location.href;
      //http://localhost:8100/#/callback?code=123456

      if(url.includes('http://localhost:8100/#/')){

        console.log('redirecting back to App');

        if($window.location.hash.split('/')[1].split('?').length > 1){
          var queryParam= $window.location.hash.split('/')[1].split('?')[1].split('&');
          angular.forEach(queryParam, function(value, key){
            if (value.includes('code')){
              authCode= value.split('=')[1];
            }
          });

          console.log('Returned AuthCode is: ', authCode);
        }
      }

    }

    $state.go('app.playlists');

  });


});
