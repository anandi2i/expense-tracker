  /**
   * Author : Anand N G
   * Test spec - Unit testing
   **/

  var supertest = require("supertest");
  var should = require("should");
  var _= require("underscore-node");
  // This agent refers to PORT where program is runninng.

  var server = supertest.agent("http://localhost:3000");

  var Expense = require('../models/expense');

  describe("Expense API unit test",function() {
    // should return home page
    it("should return home page",function(done) {
      // calling home page api
      server
      .get("/")
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        // HTTP status should be 200
        res.status.should.equal(200);
        // Error key should be false.
        res.body.error.should.equal(false);
        done();
      });
    });

    //Should return valid error message - for Title
    it("Title is empty..",function(done) {
      server
      .post('/expenses')
      .send({amount: 2300}) // this should fail because of empty object
      .expect("Content-type",/json/)
      .expect(500)
      .end(function(err,res){
        res.status.should.equal(500);
        should(res.body[0].msg).exactly('Title is required for an expense');
        done();
      });
    });

    //Should return valid error message - for Amount
    it("Amount is empty..",function(done) {
      server
      .post('/expenses')
      .send({}) // this should fail because of empty object
      .expect("Content-type",/json/)
      .expect(500)
      .end(function(err,res){
        res.status.should.equal(500);
        var arr = _.filter(res.body, function(obj) {
          return obj.param === 'amount'
        });
        should(arr.length).exactly(1);
        done();
      });
    });

    // should 404 error for wrong URL
    it("404 Error Wrong URL",function(done) {
      // calling home page api
      server
      .get("/random-url")
      .expect("Content-type",/json/)
      .expect(404)
      .end(function(err,res){
        // HTTP status should be 200
        res.status.should.equal(404);
        done();
      });
    });

    //should get all expense list
    it('Get all expense list with json', function(done) {
      server
        .get('/expenses')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
    //Should add a expense
    it("should add expense into the list",function(done) {
      server
      .post('/expenses')
      .send({title: 'Food Exp', amount: 3000}) // this should fail because of empty object
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
        should(res.body.expense.title).exactly('Food Exp');
        done();
      });
    });

    //Should not add a expense - empty obj
    it("should not add expense into the list",function(done) {
      server
      .post('/expenses')
      .send({}) // this should fail because of empty object
      .expect("Content-type",/json/)
      .expect(500)
      .end(function(err,res){
        res.status.should.equal(500);
        done();
      });
    });

  });

  //Category List API unit test
  var Category = require('../models/category');

  describe("Category API unit test",function() {
    // should return home page
    it("should return category list",function(done) {
      server
      .get("/categories")
      .expect("Content-type",/json/)
      .expect(200)
      .end(function(err,res) {
        // HTTP status should be 200
        res.status.should.equal(200);
        done();
      });
    });


    //Should return valid error message - for Name
    it("Name is empty..",function(done) {
      server
      .post('/categories')
      .send({}) // this should fail because of empty object
      .expect("Content-type",/json/)
      .expect(500)
      .end(function(err,res){
        res.status.should.equal(500);
        should(res.body[0].param).exactly('name');
        done();
      });
    });

    //Name check
    it("Category creation..",function(done) {
      server
      .post('/categories')
      .send({name: 'Electronics'}) // this should fail because of empty object
      .expect("Content-type",/json/)
      .expect(500)
      .end(function(err,res){
        res.status.should.equal(500);
        done();
      });
    });
  })
