angular.module('mastermindApp').controller('AuthCtrl', function($scope, $modal, $rootScope, $state, AuthService) {

    /**
        * @desc: Creates google+ sign in button and determines sign in option parameters.
    **/
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

    /**
        * @desc: Fake login user if email and password is correct.
        * @param: string name - the email-adress of the user
        * @param: string password - the password of the user
    **/
    $scope.login = function(name, password) {
        if (name != null) {
            $rootScope.userMail = name;
            $rootScope.isSignedIn = true;
            $state.go('game');
        } else {
            $scope.openModal();
        }
    };

    /**
        * @desc: Opens an error dialog if email-adress of user is incorrect.
        * @source: http://angular-ui.github.io/bootstrap/
    **/
    $scope.openModal = function () {
        $modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'AuthCtrl'
        });
    };

    /**
        * @desc: Closes error dialog.
    **/
    $scope.ok = function () {
        $modalInstance.close();
    };

    /**
        * @desc: Automatic log in if user is already logged in with google+.
    **/
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

    /***
        *@ desc: Facebook login
    ***/


    /**
        * @desc: Prevents that user can type in more than one @-sign in email-adress input field.
    **/
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
        * @desc: On press enter in input fields.
    **/
    $scope.inputKeyDown = function(e) {
        if (e.keyCode == 13) {
            $scope.login($scope.userMail, $scope.userPassword);
        }
    };

    $scope.auth();
});