'use strict';
/*
 * Category Module
 */
angular.module('expenseTracker.category', ['ngRoute', 'ngMaterial', 'ngMdIcons'])
/*
 * Services related to Category
 * A common platform to communicate Category to other controllers.
 */
.factory('Categories', ['$resource', function($resource) {
   return $resource('api/categories/:categoryId', {
     categoryId: '@_id'
   }, {
     update: {
       method: 'PUT'
     }
   })
 }])
 .service('CategoryService', [ '$mdDialog', 'Categories', '$mdToast', function($mdDialog, Categories, $mdToast) {
   var self = this;
   //Category Literal
   this.category = {};
   /**
    * To get category details - REST API
    * @return {[Array]}
    */
   this.getCategoryDetails = function(successCB, errorCB) {
     Categories.query({}, function(response) {
       if(response && response.length > 0) {
         self.category.categoryDetails = [];
         Array.prototype.push.apply(self.category.categoryDetails, response);
         successCB(response);
       }
     }, errorCB);
   }
   /**
    * To display the custom angular material Dialogue
    * @param  {[Object]} dialogueObj
    * @param  {[function]} successCB
    * @param  {[type]} errorCB
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
    * To create a category
    * @param  {Object} newCategory {name}
    * @param  {[function]} successCB
    * @param  {[function]} errorCB
    */
   this.createCategory = function(newCategory, successCB, errorCB) {
     var category = new Categories(newCategory);

     category.$save(function(response) {
       self.category.categoryDetails.unshift(response);
       successCB(response);
     }, errorCB);
   }
   /**
    * To delete a category
    * @param  {[Object]} Object to delete
    * @param  {[type]} successCB
    * @param  {[type]} errorCB
    */
   this.deleteCategory = function(currentCategory, successCB, errorCB) {
      var removedId = currentCategory._id;
      currentCategory.$remove({}, function(response) {
         var removeIndex = _.findIndex(self.category.categoryDetails, function(category) {
           return category._id === removedId;
         });
         self.category.categoryDetails.splice(removeIndex, 1);
        successCB(response);
      }, errorCB);
   }
   /**
    * To delete a category from the list
    * @param  {[Object]} currentCategory [description]
    * @param  {[type]} successCB       [description]
    * @param  {[type]} errorCB         [description]
    * @return {[type]}                 [description]
    */
   this.updateCategory = function(currentCategory, successCB, errorCB) {
     currentCategory.$update(currentCategory, function(response) {
        _.map(self.category.categoryDetails, function(category) {
          if(category._id === response._id) {
            category = _.extend(category, response);
          }
        });
        successCB(response);
      }, errorCB);
   }

   //Move these methods to UTIl service
   /**
    * To generate randome ID
    * @return {String}
    */
   this.generateId = function() {
     function s4() {
       return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
     }
     return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
       s4() + '-' + s4() + s4() + s4();
   }
   /**
    * To display a infor dialog using angular material.
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

 }])
/*
 * Category controller
 */
.controller('CategoryController',['$scope', 'CategoryService', '$mdDialog', function($scope, categoryService, $mdDialog) {
  var vm = this;
  //Intitalizing current Scope to service literal;
  vm.category = categoryService.category;

  vm.category.newCategory = {
    name: '',
  }
  /*
   * Service call to get category List.
   */
  vm.getCategoryDetails = function() {
    var successCB = function(res) {
    };
    var errorCB = function(err) {

    }
    categoryService.getCategoryDetails(successCB, errorCB);
  }

  vm.showAddCategoryDialog = function(ev) {
    var dialogueObj = {
      controller: 'CategoryController',
      controllerAs: 'categoryCtrl',
      templateUrl: '/category/views/createCategory.html',
      ev: ev
    }
    var successCB = function() {

    };
    var errorCB = function() {

    };
    categoryService.createCustomDialogue(dialogueObj, successCB, errorCB)
  }
  /*
   * To view category information.
   */
  vm.viewCategoryDialog = function(category, ev) {
    vm.category.currentCategory = _.clone(category);
    var dialogueObj = {
      controller: 'CategoryController',
      controllerAs: 'categoryCtrl',
      templateUrl: '/category/views/categoryDialogue.html',
      ev: ev
    }
    var successCB = function() {

    };
    var errorCB = function() {

    };
    categoryService.createCustomDialogue(dialogueObj, successCB, errorCB)
  }

  /*
   * Service call to create category
   */
  vm.createCategory = function() {
   var successCB = function() {
     vm.closeDialog();
   };
   var errorCB = function(err) {
     categoryService.showToast('err', err.data.msg)
     vm.category.newCategory.name = "";
   }
   categoryService.createCategory(vm.category.newCategory, successCB, errorCB);
  }

  /*
   * Service call to delete a category
   */
  vm.deleteCategory = function() {
    var successCB = function(res) {
      vm.closeDialog();
    }
    var errorCB = function() {

    }
    categoryService.deleteCategory(vm.category.currentCategory, successCB, errorCB);
  }

  vm.updateCategory = function() {
    var successCB = function(res) {
      vm.closeDialog();
    }
    var errorCB = function() {

    }
    categoryService.updateCategory(vm.category.currentCategory, successCB, errorCB);
  }
  /*
   * To cancel or close dialog
   */
  vm.closeDialog = function() {
    $mdDialog.cancel();
  }
}])
