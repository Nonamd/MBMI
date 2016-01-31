// js/services/daygoals.js
angular.module('daygoalService', [])

// super simple service
// each function returns a promise object 
.factory('Daygoals', function($http) {
    return {
        get : function() {
            return $http.get('/api/daygoals');
        },
        create : function(daygoalData) {
            return $http.post('/api/daygoals', daygoalData);
        },
        delete : function(id) {
            return $http.delete('/api/daygoals/' + id);
        }
    }
});