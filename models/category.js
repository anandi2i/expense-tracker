var mongoose = require("mongoose");
// Instance of Schema
var mongoSchema = mongoose.Schema;
// Category schema
var categorySchema  = {
    name :{
      type: String,
      required: true
    },
    created_at: {
      type: Date,
      default: Date.now
    }
};
// model creation
module.exports = mongoose.model('Category', categorySchema);
