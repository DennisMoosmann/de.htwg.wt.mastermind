angular.module('mastermindApp')

.service('AuthService', function($http) {
    return {
        auth: function() {
            return $http.get('/auth');
        }
    };
});