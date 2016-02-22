'use strict';

angular.module('spotz.map', ['MapServices'])

.controller('mapCtrl', ['$scope', '$rootScope', '$cookies', '$state', 'MapFactory', 'LoginFactory', function ($scope, $rootScope, $cookies, $state, MapFactory, LoginFactory) {
  $scope.mapLoading = true;

  $rootScope.$on('googleMapLoaded', function () {
    $scope.mapLoading = false;
  });

  $rootScope.$on('loadMap', function () {
    $scope.mapLoading = true;
  });

  $rootScope.$on('mapLoaded', function () {
    $scope.mapLoading = false;
  });

  $scope.deleteRule = function (zoneId, ruleId) {
    console.log('deleting rule', ruleId, 'for', zoneId);
    MapFactory.deleteRule(zoneId, ruleId);
  };

  //make sure user is authenticated
  LoginFactory.checkCredentials().then(function (loggedIn) {
    if (!loggedIn) {
      $state.go('login');
    }
  });

  //load the google map, then return map object in callback
  MapFactory.init(function (map) {
    $scope.mapLoading = true;
    var center = map.getCenter();

    //get the parking zones based on the center point
    MapFactory.fetchParkingZones([center.lng(), center.lat()]);

    // map data ready, broadcast to the sibling controller (sideCtrl)
    $rootScope.$broadcast('googleMapLoaded');
  });

},
]);
