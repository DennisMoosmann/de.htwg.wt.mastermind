angular.module('mastermindApp')

.service('AuthService', function($http) {
    return {
        auth: function() {
            return $http.get('/auth');
        },
        getUserInformation: function(access_token) {
            return $http.get('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + access_token);
        },
        loginWithCredentials: function(email, password) {
            return $http.get('/signIn/' + email + '/' + password);
        }
    };
});