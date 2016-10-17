angular.module('starter.filters', [])
  .filter('branchList', function () {

    return function(branchList, myPosition, searchRadius, ATMorBranch) {

      return _.filter(branchList, function(branch){

        if(getDistance(myPosition, {lat: branch.latitude, lng: branch.longitude}) > searchRadius ){
          return false;
        }

        if(ATMorBranch === 'ATM' && !branch.type.includes('ATM'))
          return false;
        else if (ATMorBranch === 'Branch' && branch.type.includes('ATM'))
          return false;

        return true;

      });


    }

  });
