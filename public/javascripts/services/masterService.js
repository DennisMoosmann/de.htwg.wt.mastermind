angular.module('mastermindApp')

.service('MasterService', function($http) {
    return {
        getGameGrid: function() {
            return $http.get('/getGameGrid');
        },
        getStickGrid: function() {
            return $http.get('/getStickGrid');
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
        },
        getRowsAmount: function() {
            return $http.get('/getRowsAmount');
        },
        getColumnsAmount: function() {
            return $http.get('/getColumnsAmount');
        }
    };
});