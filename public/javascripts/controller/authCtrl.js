angular.module('mastermindApp').controller('AuthCtrl', function($scope, $rootScope, $state, AuthService) {
    $scope.auth = function() {
        AuthService.auth().then(function(response) {
            var signInOptParams = {
                'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
                'callback': $scope.authCallback,
                'redirecturi': "postmessage",
                'clientid': response.data.client_id,
                'requestvisibleactions': "http://schemas.google.com/AddActivity",
                'cookiepolicy': "single_host_origin"
            };
            gapi.signin.render('btnGoogle', signInOptParams);
        });
    };

    $scope.login = function(name, password) {
        AuthService.loginWithCredentials(name, password)
            .error(function() {
                $rootScope.isSignedIn = true;
                $state.go('game');
            })
            .then(function() {
                $rootScope.isSignedIn = true;
                $state.go('game');
            });
        $rootScope.userMail = name;
    };

    $scope.authCallback = function(authResult) {
        if ($rootScope.isSignedIn || authResult['access_token']) {
            $rootScope.isSignedIn = true;
            AuthService.getUserInformation(authResult['access_token'])
                .then(function(response) {
                    $rootScope.userId = response.data.user_id;
                    $rootScope.userMail = response.data.email;
                    $state.go('game');
                });

        } else if (authResult['error']) {
            $rootScope.isSignedIn = false;
            console.log('Error:' + authResult['error']);
        }
    };

    /*function afterShowAnimation(scope, element, options) {
        // post-show code here: DOM element focus, etc.
    }*/

    $scope.auth();
});