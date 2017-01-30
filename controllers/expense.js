  'use strict';
  /**
   * Module dependencies.
   */
  var mongoose = require('mongoose'),
    Expense = mongoose.model('Expense'),
    Category = mongoose.model('Category'),
    _ = require('underscore-node');
  module.exports = function() {
    return {
      getExpenses: function(req, res) {

        Expense.find({}).populate('category').exec(function(err, expenseList){
          if(err) {
            res.status(500).json({
              msg: "Error occured while getting expese List",
              err: err
            });
            return;
          }
          res.status(200).json(expenseList);
        });
      },
      createExpense: function(req, res) {
        req.assert('title', 'Title is required for an expense').notEmpty();
        req.assert('amount', 'Amount is required').notEmpty();

        var errors = req.validationErrors();
        if(errors) {
          res.status(500).json(errors);
          return;
        }
        var expense = new Expense(req.body);
        expense.save(function(err, data){
          if(err) {
            res.status(500).json({
              err: err,
              msg: "Error occured on creating a new expense"
            });
            return;
          }
          Category.populate(data, {
            path: "category"
          }, function(err, updatedExpense) {
            res.status(200).json(updatedExpense);
          });
        });
      },

      updateExpense: function(req, res) {
        Expense.findById(req.params.id, function(err, expense){
          expense = _.extend(expense, req.body);
          expense.save(function(err, updatedExpense){
            if(err) {
              res.status(500).json({
                msg: "Error occured on update a expense",
                err: err
              });
              return;
            }
            Category.populate(updatedExpense, {
              path: "category"
            }, function(err, updateVal) {
              res.status(200).json(updateVal);
            });
          });
        });
      },

      deleteExpense: function(req, res){
        Expense.remove({_id: req.params.id}, function(err, data){
          if(err) {
            res.status(500).json({
              msg: "Error occured on deleting a expense",
              err: err
            });
            return;
          }
          res.status(200).json(data);
        });
      }
    }
  }
