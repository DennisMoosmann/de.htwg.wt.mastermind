/**
 * Main module of the application.
 */

angular.module('mastermindApp', ['ui.router', 'ui.bootstrap'])
    .config(function($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'assets/partials/home.html',
                controller: 'AuthCtrl'
            })
            .state('game', {
                url: '/game',
                templateUrl: 'assets/partials/game.html',
                controller: 'MasterCtrl'
            })
    });