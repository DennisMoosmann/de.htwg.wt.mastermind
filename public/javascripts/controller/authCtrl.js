angular.module('mastermindApp').controller('AuthCtrl', function($scope, $modal, $rootScope, $state, AuthService) {
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
        if (name != null) {
            $rootScope.userMail = name;
            $rootScope.isSignedIn = true;
            $state.go('game');
        } else {
            $scope.open();
        }
    };

    /*source: http://angular-ui.github.io/bootstrap/*/
    $scope.open = function (size) {
        $modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'AuthCtrl',
            size: size
        });
    };

    $scope.ok = function () {
        $modalInstance.close();
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

    //Prevent multiple '@-Signs' in email
    $(function() {
        var keys = {};
        $('#mail').keydown(function(e) {
            keys[e.which] = true;
            if (keys[17] && keys[81]) {
                var count = 0;
                for (var i = 0; i < mail.value.length; i++) {
                    if (mail.value[i] == '@') {
                        count++;
                    }
                }

                if (count > 0) {
                    e.preventDefault();
                }
            }
        });

        $('#mail').keyup(function(e) {
            delete keys[e.which];
        });
    });

    /**
        desc: On press enter log in
    **/
    $scope.inputKeyDown = function(e) {
        if (e.keyCode == 13) {
            $scope.login($scope.userMail, $scope.userPassword);
        }
    };

    $scope.auth();
});