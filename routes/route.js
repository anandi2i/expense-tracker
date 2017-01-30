  var express = require('express');
  var router = express.Router();

  var Expense = require('../models/expense');
  var Category = require('../models/category');

  var ExpenseController = require('../controllers/expense')(Expense);
  var CategoryController = require('../controllers/category')(Category);

  router.get('/', function(req, res) {
      res.sendFile('./public/index.html'); // load the single view file
      //(angular will handle the page changes on the front-end)
  });

//Expense
  // Get all Expense List
  router.get('/api/expenses', ExpenseController.getExpenses);

  // Create new Expense
  router.post('/api/expenses', ExpenseController.createExpense);

  // Update a Expense based on :id
  router.put('/api/expenses/:id', ExpenseController.updateExpense);

  // Delete a Expense based on :id
  router.delete('/api/expenses/:id', ExpenseController.deleteExpense);

//Category
  // Get all Category List
  router.get('/api/categories', CategoryController.getCategories);

  // Create new Category
  router.post('/api/categories', CategoryController.createCategory);

  // Update a Category based on :id
  router.put('/api/categories/:id', CategoryController.updateCategory);

  // Delete a Category based on :id
  router.delete('/api/categories/:id', CategoryController.deleteCategory);

  module.exports = router;
