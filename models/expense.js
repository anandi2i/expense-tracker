  var mongoose = require("mongoose");
  // Instance of Schema
  var mongoSchema = mongoose.Schema;
  // Expense schema
  var expenseSchema  = {
      title :{
        type: String,
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      notes: {
        type: String
      },
      categories:[{
        type: mongoSchema.ObjectId,
        ref: 'Category'
      }],
      spent_on: {
        type: Date,
        default: Date.now
      },
      created_at: {
        type: Date,
        default: Date.now
      }
  };
  // model creation
  module.exports = mongoose.model('Expense', expenseSchema);
