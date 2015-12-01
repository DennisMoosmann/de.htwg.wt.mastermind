angular.module('mastermindApp')

.service('MasterService', function($http) {
    return {
        getStatus: function() {
            return $http.get('/getStatus');
        },
        getMastermindColors: function() {
            return $http.get('/getMastermindColors');
        },
        getGameGrid: function() {
            return $http.get('/getGameGrid');
        },
        getStickGrid: function() {
            return $http.get('/getStickGrid');
        },
        newGame: function () {
            return $http.get('/newGame');
        },
        showSolution: function() {
            return $http.get('/showSolution');
        },
        setValue: function(row, col, val) {
            return $http.get('/setValue/' + row + '/' + col + '/' + val);
        },
        confirmRow: function() {
            return $http.get('/confirmRow');
        },
        confirmRow2: function() {
            return $http.get('/confirmRow2');
        },
        getActualRow: function() {
            return $http.get('/getActualRow');
        },
        getRowsAmount: function() {
            return $http.get('/getRowsAmount');
        },
        getColumnsAmount: function() {
            return $http.get('/getColumnsAmount');
        },
        isSolved: function() {
            return $http.get('/isSolved');
        },
        resetSize: function(rows, cols) {
            return $http.get('/resetSize/' + rows + '/' + cols);
        }
    };
});