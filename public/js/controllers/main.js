// js/controllers/main.js
angular.module('daygoalController', [])

// inject the Daygoal service factory into our controller
.controller('mainController', function($scope, $http, $timeout, Daygoal, Upload) {
    $scope.formData = {};

    // GET =====================================================================
    // when landing on the page, get all daygoals and show them
    // use the service to get all the daygoals
    Daygoal.get()
        .success(function(data) {
            $scope.daygoals = data;
        });


    $scope.$watch('files', function (files) {
        $scope.formUpload = false;
        if (files != null) {
          if (!angular.isArray(files)) {
            $timeout(function () {
              $scope.files = files = [files];
            });
            return;
          }
          for (var i = 0; i < files.length; i++) {
            $scope.errorMsg = null;
            (function (f) {
              $scope.upload(f);
            })(files[i]);
          }
        }
    });

    $scope.createDaygoal = function (file) {
        $scope.formUpload = true;
        if (file != null) {
          $scope.upload(file)
        }
    };

    $scope.upload = function(file) {
        $scope.errorMsg = null;
        
        file.upload = Upload.upload({
          url: '/api/daygoals',
          data: {info: $scope.formData, file: file}
        });

        file.upload.then(function (response) {
          $timeout(function () {
            $scope.daygoals = response.data;
          });
        }, function (response) {
          if (response.status > 0)
            $scope.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
          // Math.min is to fix IE which reports 200% sometimes
          file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });

        file.upload.xhr(function (xhr) {
          // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
        });
    };


    // DELETE ==================================================================
    // delete a daygoal after checking it
    $scope.deleteDaygoal = function(id) {
        Daygoals.delete(id)
            // if successful creation, call our get function to get all the new daygoals
            .success(function(data) {
                $scope.daygoals = data; // assign our new list of dagoals
            });
    };
});