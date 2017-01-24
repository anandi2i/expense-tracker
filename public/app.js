'use strict';

/**
 * Defining angular application
 */
var expenseApp = angular.module('expenseTracker', ['ngRoute', 'ngMaterial']);

// configure our routes
expenseApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
  // route for the home page
  .when('/', {
      templateUrl : 'home/views/home.html'

  })
  .otherwise({redirectTo: '/'});

  // use the HTML5 History API
  $locationProvider.html5Mode(true);
}]);
