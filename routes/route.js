  var express = require('express');
  var router = express.Router();

  var Expense = require('../models/expense');
  var Category = require('../models/category');

  var ExpenseController = require('../controllers/expense')(Expense);
  var CategoryController = require('../controllers/category')(Category);

  router.get("/",function(req,res){
      res.status(200).json({"error" : false,"message" : "Try a valid URL."});
  });

//Expense
  // Get all Expense List
  router.get('/expenses', ExpenseController.getExpenses);

  // Create new Expense
  router.post('/expenses', ExpenseController.createExpense);

  // Update a Expense based on :id
  router.put('/expenses/:id', ExpenseController.updateExpense);

  // Delete a Expense based on :id
  router.delete('/expenses/:id', ExpenseController.deleteExpense);

//Category
  // Get all Category List
  router.get('/categories', CategoryController.getCategories);

  // Create new Category
  router.post('/categories', CategoryController.createCategory);

  // Update a Category based on :id
  router.put('/categories/:id', CategoryController.updateCategory);

  // Delete a Category based on :id
  router.delete('/categories/:id', CategoryController.deleteCategory);

  module.exports = router;
