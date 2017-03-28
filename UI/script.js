// Code goes here
var appRoot = angular.module('myNgApp', ['ngRoute', 'ui.bootstrap', 'blockUI']);



appRoot.config([
    '$routeProvider', '$locationProvider', '$httpProvider',
    function ($routeProvider, $locationProvider, $httpProvider) {

        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {
                templateUrl: 'ngIndex.html',
                controller: 'IndexCtrl'
            })
            .when('/index', {
                templateUrl: 'ngIndex.html',
                controller: 'IndexCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
]);

appRoot.service('MyService', function ($http, $q) {

    this.slotResource = {

        //******Get All ParkingSpotS***********//

        getParkings: function (param) {
            var deferred = $q.defer();
            // Post request, chage the url according to your need

            var config = {
                method: 'POST',
                url: 'http://10.10.20.6/apigw/devnetlabapi/cdp/v1/devices/parking?UserKey=500109&SensorCustomerKey=500050&AppKey=CDP-App',// You can enter your url here
                headers: {
                    'WSO2-Authorization': 'oAuth Bearer 32b37facf21b4deadc93a261e2dc4f2',
                    'Authorization': 'Bearer 9sY1mKjZgJDa0yw3LHBdaJetU68y',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(param)
            };
            $http(config).then(
                function (r) {
                    var data = r.data;
                    var result = [];

                    spots = data['Find']['Result'];

                    for (var i = 0; i < spots.length; i++) {
                        var spot = spots[i]['ParkingSpot'];
                        var sid = spot['sid'];
                        var label = spot['label'];
                        var occupied = spot['state']['occupied'];

                        result.push({ "sid": sid, "label": label, "occupied": occupied });
                    }

                    deferred.resolve(result);
                },
                function (r) {
                    deferred.reject(r);
                });
            return deferred.promise;
        },

        //******Get All Lights***********//

        getLights: function (param) {
            var deferred = $q.defer();

            var config = {
                method: 'POST',
                url: 'http://10.10.20.6/apigw/devnetlabapi/cdp/v1/devices/lighting?UserKey=500109&SensorCustomerKey=500050&AppKey=CDP-App',// You can enter your url here
                headers: {
                    'WSO2-Authorization': 'oAuth Bearer 32b37facf21b4deadc93a261e2dc4f2',
                    'Authorization': 'Bearer 9sY1mKjZgJDa0yw3LHBdaJetU68y',
                    'Accept': 'application/json'
                },
                data: JSON.stringify(param)
            };
            $http(config).then(
                function (r) {
                    var data = r.data;
                    var result = [];

                    var lights = data['Find']['Result'];


                    for (var i = 0; i < lights.length; i++) {
                        var light = lights[i]['Light']
                        var sid = light['sid'];
                        var intensityLevel = light['state']['intensityLevel'];
                        result.push({ "sid": sid, "intensityLevel": intensityLevel });
                    }

                    deferred.resolve(result);
                },
                function (r) {
                    deferred.reject(r);
                });
            return deferred.promise;
        },

        //******Reserve a parking***********//

        reserve: function (param) {
            var deferred = $q.defer();
            var config = {
                method: 'POST',
                url: 'http://10.10.20.6/apigw/devnetlabapi/cdp/v1/devices/parking?UserKey=500109&SensorCustomerKey=500050&AppKey=CDP-App',// You can enter your url here
                headers: {
                    'WSO2-Authorization': 'oAuth Bearer 32b37facf21b4deadc93a261e2dc4f2',
                    'Authorization': 'Bearer 9sY1mKjZgJDa0yw3LHBdaJetU68y',
                    'Accept': 'application/json'
                },
                data: JSON.stringify(param)
            };
            $http(config).then(
                function (r) {

                    deferred.resolve(r);
                },
                function (r) {
                    deferred.reject(r);
                });
            return deferred.promise;
        },

        updateIntensitylevel: function (param) {
            var deferred = $q.defer();

            var config = {
                method: 'POST',
                url: 'http://10.10.20.6/apigw/devnetlabapi/cdp/v1/devices/lighting?UserKey=500109&SensorCustomerKey=500050&AppKey=CDP-App',// You can enter your url here
                headers: {
                    'WSO2-Authorization': 'oAuth Bearer 32b37facf21b4deadc93a261e2dc4f2',
                    'Authorization': 'Bearer 9sY1mKjZgJDa0yw3LHBdaJetU68y',
                    'Accept': 'application/json'
                },
                data: JSON.stringify(param)
            };
            $http(config).then(
                function (r) {

                    deferred.resolve(r);
                },
                function (r) {
                    deferred.reject(r);
                });
            return deferred.promise;
        },

        //******Cancel a parking***********//

        cancel: function (param) {
            var deferred = $q.defer();
            // Post request, chage the url according to your need

            var config = {
                method: 'POST',
                url: 'http://10.10.20.6/apigw/devnetlabapi/cdp/v1/devices/lighting?UserKey=500109&SensorCustomerKey=500050&AppKey=CDP-App',// You can enter your url here
                headers: {
                    'WSO2-Authorization': 'oAuth Bearer 32b37facf21b4deadc93a261e2dc4f2',
                    'Authorization': 'Bearer 9sY1mKjZgJDa0yw3LHBdaJetU68y',
                    'Accept': 'application/json'
                },
                data: JSON.stringify(param)
            };
            $http(config).then(
                function (r) {

                    deferred.resolve(r);
                },
                function (r) {
                    deferred.reject(r);
                });
            return deferred.promise;
        }
    }
});

appRoot.controller('IndexCtrl', function ($scope, MyService,$route, blockUI) {

    $scope.getLights = function () {
        blockUI.start();
        var params = {
            "Query":
            {
                "Find":
                {
                    "Light":
                    {
                        "sid":
                        { "ne": "" }
                    }
                }
            }
        }
        MyService.slotResource.getLights(params).then(
            function (lights) {
                $scope.lights = lights;
                $scope.getParkings();
                //$scope.slots = slots;
                blockUI.stop();
            },
            function (err) {
                console.log('some error occured', err);
                blockUI.stop();
            });
    }

    $scope.getLights();

    $scope.getParkings = function () {
        var params = {
            "Query":
            {
                "Find":
                {
                    "ParkingSpot":
                    {
                        "sid":
                        { "ne": "" }
                    }
                }
            }
        }

        MyService.slotResource.getParkings(params).then(function (parkings) {
            $scope.parkings = parkings;
            $scope.addIntensityToParking();
        }, function () {

        })
    }

    //******Assign lights to parking spot***********//

    $scope.addIntensityToParking = function () {
        for (i = 0; i < $scope.parkings.length; i++) {
            $scope.parkings[i]['intensityLevel'] = $scope.lights[i].intensityLevel;
        }
        console.log($scope.parkings);
    }

    $scope.reserveSlot = function () {
        $scope.updateParkingSpotStatus(true);
    }

    $scope.cancelSlot = function () {
        $scope.updateParkingSpotStatus(false);
    }

    $scope.getSlotTileClass = function (parking) {
        var cls = !parking.occupied ? 'available ' : 'reserved ';
        cls += ($scope.selectedSlot && $scope.selectedSlot.sid === parking.sid) ? 'selected ' : ' ';
        return cls;
    }

    $scope.selectSlot = function (parking, index) {
        // if (!slot.isAvailable)
        //     return false;
        $scope.selectedSlot = parking;
        $scope.selectedSlot.index = index;
    }

    $scope.getReserveButtonClass = function (selectedSlot) {
        return !selectedSlot || selectedSlot.occupied ? 'disabled' : '';
    }

    $scope.getBulbClass = function (parking) {
        return parking.intensityLevel > 0 ? 'light-on' : 'light-off';
    }


    $scope.updateParkingSpotStatus = function (isReserve) {

        var postParams = {
            "Query": {
                "Find": {
                    "Format": "version",
                    "ParkingSpot": {
                        "sid": $scope.selectedSlot.sid
                    }
                },
                "for": {
                    "each": "spot",
                    "in": "Find.Result.ParkingSpot",
                    "SetLocalData": {
                        "key": "spot.state.occupied.value",
                        "value": isReserve
                    }
                },
                "Update": {
                    "from": "Result",
                    "Include": "$Response.Message.Value.Find"
                }
            }
        };


        MyService.slotResource.reserve(postParams).then(
            function (slot) {
                blockUI.stop();
                $scope.updateLightIntensity(isReserve ? 0 : 100);
            },
            function (err) {
                console.log('some error occured', err);
                blockUI.stop();
            });

    }


    $scope.updateLightIntensity = function (intensity) {
        var sid = $scope.lights[$scope.selectedSlot.index].sid;
        var postParams = {
            "Query": {
                "Find": {
                    "Format": "version",
                    "Light": {
                        "sid": sid
                    }
                },
                "for": {
                    "each": "light",
                    "in": "Find.Result.Light",
                    "SetLocalData": {
                        "key": "light.state.intensityLevel.value",
                        "value": intensity
                    }
                },
                "Update": {
                    "from": "Result",
                    "Include": "$Response.Message.Value.Find"
                }
            }
        };
        MyService.slotResource.updateIntensitylevel(postParams).then(
            function (lights) {
                $scope.getLights();
                //$scope.slots = slots;
                blockUI.stop();
                $route.reload();
            },
            function (err) {
                console.log('some error occured', err);
                blockUI.stop();
            });
    }
});



