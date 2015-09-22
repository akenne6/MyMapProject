angular.module('starter').factory('PlacesService', ['$http', function ($http) {
    var places = {};
    places.savedLocations = [];

    $http.jsonp('https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=5000&gscoord=40.741934%7C-74.004897&gslimit=5&format=json&callback=JSON_CALLBACK')
        .then(function (data) {
            var rawPlaces = data.query.geosearch;
            for (var i = 0; i < rawPlaces.length; i++) {
                place = {
                    lat: rawPlaces[i].lat,
                    lng: rawPlaces[i].lng,
                    message: rawPlaces[i].title
                }
                places.savedLocations.push(place);
            };
        });

    return places;
}]);