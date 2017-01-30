  'use strict';
  /**
  * Defining angular application
  */
  //Sub Modules to distinguish the packages from Main module
  angular.module('expenseTracker.expense', []);
  angular.module('expenseTracker.category', []);
  //Main app
  var expenseApp = angular.module('expenseTracker', ['ngRoute', 'ngMaterial','ngMdIcons','ngResource',
  'expenseTracker.expense', 'expenseTracker.category']);

  // Routing configuration
  expenseApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
      templateUrl: '/expense/views/expense.html',
    })
    .when('/expense', {
      templateUrl: '/expense/views/expense.html',
    })
    .when('/category', {
      templateUrl: '/category/views/category.html',
    })
    .otherwise({redirectTo: '/'});
    // use the HTML5 History API - Inorder to avoid '#' - appending in Single page application
    $locationProvider.html5Mode(true);
  }])
