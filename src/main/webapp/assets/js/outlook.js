var app = angular.module('main', ['ui.router', 'oc.lazyLoad']);

  app.controller('outlookCtrl', ['$scope', '$http', function($scope, $http) {

      $http.post('/get_weekly_weather').then(function (response) {
         $scope.$parent.temperatureWeekly = response;
      });

      $http.post('/get_detailed_forecast').then(function (response) {
          $scope.$parent.detailedTemp = response;
          readyGet(response, $scope.local.typeTemp)
      });

      $http.post('/get_astronomy').then(function (response) {
          $scope.$parent.coordinates = response.data['coordinates'];
          $scope.$parent.moon_phase_index = 'images/svg/oplao_moon_'+response.data['moon_phase_index']+'.svg';
      });

      $http.post('/get_weekly_ultraviolet_index').then(function (response) {
          var colorsUV = ['greenLow', 'yellowAverage', 'orangeHigh', 'redHigh', 'redExtreme'];
          $scope.$parent.ultraviolet = response.data;
          $scope.$parent.colorsUV = response.data.map (function (value) {
              value = parseInt(value.index);
              if(value<=2){
                  return colorsUV[0];
              }else if (value<=5 && value>=3) {
                  return colorsUV[1];
              }else if (value<=7 && value>=6) {
                  return colorsUV[2];
              }else if (value<=10 && value>=8) {
                  return colorsUV[3];
              }else {
                  return colorsUV[4];
              }
          });
      });

  }]);
