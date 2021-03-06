angular.module('starter').controller('MapController', [
    '$scope',
    '$cordovaGeolocation',
    '$stateParams',
    '$ionicModal',
    '$ionicPopup',
    'PlacesService',
    'LocationsService',
    'InstructionsService',
    function(
      $scope,
      $cordovaGeolocation,
      $stateParams,
      $ionicModal,
      $ionicPopup,
      PlacesService,
      LocationsService,
      InstructionsService
      ) {

        /**
        * Once state loaded, get put map on scope.
        */
        $scope.$on("$stateChangeSuccess", function() {
            console.log("State Change Event!!!!!!!!!!!!!!!!!!!!!!!!");
            $scope.map = {
                defaults: {
                    tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                    maxZoom: 18,
                    zoomControlPosition: 'bottomleft'
                },
                markers: {},
                events: {
                    map: {
                        enable: ['context'],
                        logic: 'emit'
                    }   
                },
                center: {}
            };
            $scope.locations = [];
            $scope.locate();
            $scope.newLocation;

            if(!InstructionsService.instructions.newLocations.seen) {

                var instructionsPopup = $ionicPopup.alert({
                    title: 'Add Locations',
                    template: InstructionsService.instructions.newLocations.text
                });
                instructionsPopup.then(function(res) {
                    InstructionsService.instructions.newLocations.seen = true;
                });

            }

        });

        var Location = function() {
            if ( !(this instanceof Location) ) return new Location();
            this.lat  = "";
            this.lng  = "";
            this.name = "";
        };

        $ionicModal.fromTemplateUrl('templates/addLocation.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        /**
        * Detect user long-pressing on map to add new location
        */
        $scope.$on('leafletDirectiveMap.contextmenu', function(event, locationEvent){
            $scope.newLocation = new Location();
            $scope.newLocation.lat = locationEvent.leafletEvent.latlng.lat;
            $scope.newLocation.lng = locationEvent.leafletEvent.latlng.lng;
            $scope.modal.show();
        });

        $scope.saveLocation = function() {
            $scope.locations.push($scope.newLocation);
            $scope.modal.hide();
            $scope.goTo($scope.locations.length - 1);
        };

        /**
        * Center map on specific saved location
        * @param locationKey
        */
        $scope.goTo = function(locationKey) {
            if ($scope.locations.length === 0) {
            } else {
                var location = $scope.locations[locationKey];
                console.log(location);
                $scope.map.center = {
                    lat: location.lat,
                    lng: location.lng,
                    zoom: 15
                };

                $scope.map.markers[locationKey] = {
                    lat: location.lat,
                    lng: location.lng,
                    message: location.message,
                    focus: true,
                    draggable: false
                };
            }
        };

        /**
        * Center map on user's current position
        */
        $scope.locate = function () {
            $cordovaGeolocation
                .getCurrentPosition()
                .then(function (position) {
                    $scope.map.center = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        zoom: 15
                    };
                    PlacesService($scope.map.center.lat, $scope.map.center.lng).then(function (data) {
                        $scope.locations = data.savedLocations;
                        $scope.map.markers = $scope.locations;
                        console.log($scope.locations);
                    });
                    var locationMarker = {
                        lat:position.coords.latitude,
                        lng:position.coords.longitude,
                        message: "You Are Here",
                        icon: {
                            type: 'extraMarker',
                            icon: 'fa-circle',
                            markerColor: 'orange', //'red', 'darkred', 'orange', 'green', 'darkgreen', 'blue', 'purple', 'darkpuple', 'cadetblue'
                            iconColor: 'white', //'white', 'black'
                            prefix: 'fa',
                            shape: 'circle'
                        },
                        focus: true,
                        draggable: false
                    };
                    $scope.map.markers.push(locationMarker);

                }, function(err) {
                    // error
                    console.log("Location error!");
                    console.log(err);
                });
        };
}]);