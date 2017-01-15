'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Category = mongoose.model('Category'),
  _ = require('underscore-node');

function getCategoryList(req, res, cb) {
  Category.find({}, function(err, data) {
    if(err) {
      res.status(500).json({
        msg: "Error occured while getting category List",
        err: err
      });
      return;
    }
    cb(data);
  });
}
module.exports = function() {

  return {
    /**
     * @param - req, res
     * @return - List of category
    **/
    getCategories: function(req, res) {
      getCategoryList(req, res, function(data) {
        res.status(200).json({categories: data});
      });
    },

    /**
     * @param - req, res
     * @return - Category
    **/
    createCategory: function(req, res) {
      req.assert('name', 'Name is required to create a category').notEmpty();

      var errors = req.validationErrors();
      if(errors) {
        res.status(500).json(errors);
        return;
      }
      //To check duplicate name
      getCategoryList(req, res, function(data) {
        var duplicateCat = _.filter(data, function(category) {
          return category.name === req.body.name;
        })
        if(duplicateCat.length > 0) {
          res.status(500).json({
            msg: "Category name is already available."
          });
          return;
        }
        var category = new Category(req.body);
        category.save(function(err, data){
          if(err) {
            res.status(500).json({
              err: err,
              msg: "Error occured on creating a new category"
            });
            return;
          }
          res.status(200).json({category: data});
        });
      });
    },

    updateCategory: function(req, res) {
      Category.findById(req.params.id, function(err, category){
        category = _.extend(category, req.body);
        category.save(function(err, updatedCategory){
          if(err) {
            res.status(500).json({
              msg: "Error occured on update a category",
              err: err
            });
            return;
          }
          res.status(200).json({category: updatedCategory});
        });
      });
    },

    deleteCategory: function(req, res){
      Category.remove({_id: req.params.id}, function(err, data){
        if(err) {
          res.status(500).json({
            msg: "Error occured on deleting a category",
            err: err
          });
          return;
        }
        res.status(200).json({category: data});
      });
    }
  }
}
