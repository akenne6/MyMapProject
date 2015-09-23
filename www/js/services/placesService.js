angular.module('starter').factory('PlacesService', ['$http', function ($http) {
    var places = {};
    places.savedLocations = [];

    var getMessage = function (title) {
        var url = "http://en.wikipedia.org/wiki/" + title;
        return "<a target='_blank' href='" + url + "'>" + title + "</a>";
    }

    return function (longitude, latitude) {
        console.log("LONG: " + longitude + ", LAT: " + latitude);
        return $http({
            method: 'JSONP',
            url: 'https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=5000&gscoord=' + longitude + '%7C' + latitude + '&gslimit=10&format=json&callback=JSON_CALLBACK'
        }).then(function (data) {
            var rawPlaces = data.data.query.geosearch;
            places.savedLocations = [];
            for (var i = 0; i < rawPlaces.length; i++) {
                place = {
                    lat: rawPlaces[i].lat,
                    lng: rawPlaces[i].lon,
                    message: getMessage(rawPlaces[i].title),
                    name: rawPlaces[i].title,
                    icon: {
                        type: 'extraMarker',
                        icon: 'fa-circle',
                        markerColor: 'purple', //'red', 'darkred', 'orange', 'green', 'darkgreen', 'blue', 'purple', 'darkpuple', 'cadetblue'
                        iconColor: 'white', //'white', 'black'
                        prefix: 'fa',
                        shape: 'circle'
                    },
                    focus: true,
                    draggable: false

                }
                places.savedLocations.push(place);
            };
            return places;
        });
    };
}]);