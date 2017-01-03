// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives', 'starter.filters', 'offClick', 'ionic-datepicker', 'ui.rCalendar', 'ngCordova', 'ngAnimate', 'nvd3ChartDirectives'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('callback', {
      url: '/callback',
      templateUrl: 'templates/callback.html',
      controller: 'CallbackCtrl'
    })
    .state('app', {
    url: '/app',
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html',
          controller: 'AboutMeCtrl'
        }
      }
    })
      .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

    .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  })
    .state('app.branchLocater', {
      url: '/branchLocater',
      views: {
        'menuContent': {
          templateUrl: 'templates/branch-locator.html',
          controller: 'BranchesCtrl'
        }
      }
    })
    .state('app.appointments', {
    url: '/appointments',
    views: {
      'menuContent': {
        templateUrl: 'templates/appointments.html',
        controller: 'AppointmentsCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app');
});


//---------------Utility Methods---------------------------------------
var convertToUpperCasing= function(array){
  for(var i=0;i<array.length;i++){
    array[i]= array[i].toUpperCase();
  }
}

var convertToLowerCasing= function(array){
  for(var i=0;i<array.length;i++){
    array[i]= array[i].toLowerCase();
  }
}

function initMap() {
  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    scrollwheel: false,
    zoom: 8
  });
}

var getEducationLevelDesc= function (list, educationLevel) {

  for(var i =0; i<list.length; i++){
    if(list[i].educationLevel === educationLevel)
    {
      return list[i].educationLevelDesc;
    }
  }

  return -1;

}


var getPhoneTypeDesc= function (list, phoneType) {

  for(var i =0; i<list.length; i++){
    if(list[i].phoneType === phoneType)
    {
      return list[i].phoneTypeDesc;
    }
  }

  return -1;

}

var getDistance = function(point1, point2){

  return Math.sqrt(((point1.lat - point2.lat)*(point1.lat - point2.lat) + (point1.lng - point2.lng)*(point1.lng - point2.lng)));

}

var getRandomColor= function() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
