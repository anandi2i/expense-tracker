'use strict';
/*
 * Expense Module
 */
angular.module('expenseTracker.expense', ['ngRoute', 'ngMaterial', 'ngMdIcons'])
/*
 * Services related to Expense
 * A common platform to communicate the expense to other controllers.
 */
.factory('Expenses', ['$resource', function($resource) {
  return $resource('api/expenses/:expenseId', {
    expenseId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  })
}])
.service('ExpenseService', [ '$mdDialog', 'Expenses', 'Categories', function($mdDialog, Expenses, Categories) {
  var self = this;
  //Expense Literal
  this.expense = {};

  /**
   * To return expense List - REST API call
   * @param  {function} successCB
   * @param  {[function]} errorCB
   * @return {[void]}
   */
  this.getExpenseDetails = function(successCB, errorCB) {
    /* Remove Once the Details retrived form DB */

    // self.expense.expenseDetails = [{
    //   _id: self.generateId(),
    //   title: 'Dhangal',
    //   amount: 2000,
    //   notes: 'Went film and spent more than 5 hours.',
    //   category: 'Fuel'
    // }, {
    //   _id: self.generateId(),
    //   title: 'D16',
    //   amount: 3000,
    //   notes: '',
    //   color: 'yellow',
    //   category: 'Food'
    // }, {
    //   _id: self.generateId(),
    //   title: 'K',
    //   amount: 3500,
    //   notes: '',
    //   color: 'orange',
    //   category: 'Shopping'
    // }, {
    //   _id: self.generateId(),
    //   title: 'FM',
    //   amount: 12500,
    //   notes: '',
    //   color: 'green',
    //   category: 'Entertainment'
    // }, {
    //   _id: self.generateId(),
    //   title: 'YYY',
    //   amount: 2500,
    //   notes: '',
    //   color: 'blue',
    //   category: 'entertainment'
    // }, {
    //   _id: self.generateId(),
    //   title: 'NNN',
    //   amount: 2500,
    //   notes: '',
    //   color: '#faf',
    //   category: 'entertainment'
    // },{
    //   _id: self.generateId(),
    //   title: 'CVcc',
    //   amount: 2323,
    //   notes: '',
    //   color: '#fef',
    //   category: 'Finance'
    // }, {
    //   _id: self.generateId(),
    //   title: 'UUU',
    //   amount: 2500,
    //   notes: '',
    //   color: 'blue',
    //   category: 'Electronics'
    // }, {
    //   _id: self.generateId(),
    //   title: 'MMMM',
    //   amount: 2500,
    //   notes: '',
    //   color: 'orange',
    //   category: 'Subscriptions'
    // }, {
    //   _id: self.generateId(),
    //   title: 'BBBB',
    //   amount: 2500,
    //   notes: '',
    //   color: '#2196F3',
    //   category: 'Electronics'
    // }];
    Expenses.query({}, function(response) {
      if(response && response.length > 0) {
        self.expense.expenseDetails = [];
        Array.prototype.push.apply(self.expense.expenseDetails, response);
        successCB(response);
      }
    }, errorCB);
  }

  /**
   * To get category details - REST API
   * @return {[List]}
   */
  this.getCategoryDetails = function(successCB, errorCB) {
    /* Remove the mock details once the data retrived from Database */

    // self.expense.categoryDetails = [{
    //     name: 'Fuel'
    //   },{
    //     name: 'Food'
    //   }, {
    //     name: 'Shopping'
    //   }, {
    //     name: 'Electronics'
    //   }, {
    //     name: 'Subscriptions'
    // }];
    Categories.query({}, function(response) {
      if(response && response.length > 0) {
        self.expense.categoryDetails = [];
        Array.prototype.push.apply(self.expense.categoryDetails, response);
        successCB(response);
      }
    }, errorCB);
  }

  /**
   * Dialogue service method to open a mdDialog in angular material
   * @param  {[Object]} Properties for $mdDialog
   * @param  {[function]} successCB- callback
   * @param  {[function]} errorCB - callback
   */
  this.createCustomDialogue = function(dialogueObj, successCB, errorCB) {
    $mdDialog.show({
      controller: dialogueObj.controller,
      controllerAs: dialogueObj.controllerAs,
      templateUrl: dialogueObj.templateUrl,
      targetEvent: dialogueObj.ev,
      parent: angular.element(document.body),
      clickOutsideToClose:true
    })
    .then(successCB, errorCB);
  }

  /**
   * To create an expense - REST API call
   * @param  {Object} newExpense - {title, name, notes, category}
   * @param  {[function]} successCB - callback
   * @param  {[function]} errorCB - callback
   * @return {Object} - Created expense
   */
  this.createExpense = function(newExpense, successCB, errorCB) {
    newExpense.category = self.getIdOfCategory(newExpense.category, self.expense.categoryDetails);
    var expense = new Expenses(newExpense);
    expense.$save(function(response) {
      self.expense.expenseDetails.unshift(response);
      successCB();
    }, errorCB);
  }

  /**
   * To remove an expense - REST API CAll
   * @param  {object} currentExpense - Object to remove
   * @param  {function} successCB
   * @param  {function} errorCB
   * @return {object}  Removed object
   */
  this.deleteExpense = function(currentExpense, successCB, errorCB) {
    var removedId = currentExpense._id;
    currentExpense.$remove({}, function(response) {
       var removeIndex = _.findIndex(self.expense.expenseDetails, function(expense) {
         return expense._id === removedId;
       });
       self.expense.expenseDetails.splice(removeIndex, 1);
      successCB();
    }, errorCB);
  }

  /**
   * To update an expense - REST API CAll
   * @param  {object} currentExpense - Object to update
   * @param  {function} successCB
   * @param  {function} errorCB
   * @return {object}  updated object
   */
  this.updateExpense = function(currentExpense, successCB, errorCB) {
    currentExpense.$update(currentExpense, function(response) {
     _.map(self.expense.expenseDetails, function(expense) {
       if(expense._id === response._id) {
         expense = _.extend(expense, response);
       }
     });
     successCB();
   }, errorCB);
  }

  /**
   * To genreate unique Id
   * @return {String} A random string
   */
  this.generateId = function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  /**
   * To show an information message to user using
   * @param  {[type]} type [description]
   * @param  {[type]} msg  [description]
   * @return {[type]}      [description]
   */
  this.showToast = function(type, msg) {
     var position = {
       bottom: false,
       top: true,
       left: false,
       right: true
     }
    $mdToast.show(
     $mdToast.simple()
       .textContent(msg)
       .hideDelay(2000)
   );
  }

  /**
   * To return Id of the selected category name
   * @param  {String} categoryName
   * @param  {Array} CAtegory List
   * @return {STring}  category id
   */
  this.getIdOfCategory = function(categoryName, list) {
    var filteredCat = _.filter(list, function(categoryObj) {
      return categoryName === categoryObj.name;
    })
    return filteredCat[0]._id ? filteredCat[0]._id : "";
  }

}])
/*
 * Expense controller
 */
.controller('ExpenseController',['$scope', 'ExpenseService', '$mdDialog', function($scope, expenseService, $mdDialog) {
  var vm = this;
  //Intitalizing current Scope to service literal;
  vm.expense = expenseService.expense;
  //Object literal for new expense
  vm.expense.newExpense = {
    title: '',
    amount: '',
    notes: '',
    category: ''
  }
  /*
   * Service call to get expense List.
   */
  vm.getExpenseDetails = function() {
    var successCB = function(res) {
    };
    var errorCB = function(err) {
    }
    expenseService.getExpenseDetails(successCB, errorCB);
  }
  /*
   * Service call to get category List
   */
  vm.getCategoryDetails = function() {
    var successCB = function(res) {};
    var errorCB = function(err) {}
    expenseService.getCategoryDetails(successCB, errorCB)
  }

  vm.showAddExpenseDialog = function(ev) {
    var dialogueObj = {
      controller: 'ExpenseController',
      controllerAs: 'expenseCtrl',
      templateUrl: '/expense/views/createExpense.html',
      ev: ev
    }
    var successCB = function() {};
    var errorCB = function() {};
    expenseService.createCustomDialogue(dialogueObj, successCB, errorCB)
  }
  /*
   * To view expense information.
   */
  vm.viewExpenseDialog = function(expense, ev) {
    vm.expense.currentExpense = _.clone(expense);
    var dialogueObj = {
      controller: 'ExpenseController',
      controllerAs: 'expenseCtrl',
      templateUrl: '/expense/views/expenseDialogue.html',
      ev: ev
    }
    var successCB = function() {};
    var errorCB = function() {};
    expenseService.createCustomDialogue(dialogueObj, successCB, errorCB)
  }

  /*
   * Service call to create expense
   */
  vm.createExpense = function() {
   var successCB = function() {
     vm.closeDialog();
   };
   var errorCB = function() {

   }
   expenseService.createExpense(vm.expense.newExpense, successCB, errorCB);
  }

  /*
   * Service call to delete a expense
   */
  vm.deleteExpense = function() {
    var successCB = function(res) {
      vm.closeDialog();
    }
    var errorCB = function() {

    }
    expenseService.deleteExpense(vm.expense.currentExpense, successCB, errorCB);
  }

  vm.updateExpense = function() {
    var successCB = function(res) {
      vm.closeDialog();
    }
    var errorCB = function() {}
    expenseService.updateExpense(vm.expense.currentExpense, successCB, errorCB);
  }
  /*
   * To cancel or close dialog
   */
  vm.closeDialog = function() {
    $mdDialog.cancel();
  }
}])
.directive('dynamicHeight', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, elm, attrs) {
      var parentElm = elm ? elm : $(window);
      var heightForRest = parseInt(window.height() - parentElm.offset().top);
      parentElm.attr('style', 'height:'+heightForRest+'px');
    }
  }
}])
