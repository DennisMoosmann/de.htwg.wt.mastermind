angular.module('mastermindApp')

.service('MasterService', function($http) {
    return {
        getGrid: function() {
            return $http.get('/getGrid');
        },
        getStatus: function() {
        	return $http.get('/getStatus');
        },
        showSolution: function() {
            return $http.get('/showSolution');
        },
        setValue: function(row, col, val) {
            return $http.get('/setValue/' + row + '/' + col + '/' + val);
        },
        getActualRow: function() {
            return $http.get('/getActualRow');
        }
    };
});