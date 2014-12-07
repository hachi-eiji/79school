'use strict';

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// schema 定義
var bookSchema = mongoose.Schema({
  name: {type: String, require: true},
  create_at: {
    type: Number,
    default: function () {
      return Date.now();
    }
  },
  update_at: Number,
  published: {type: Boolean, default: false},
  description: {type: String, default: null},
  keywords: {type: [String], default: []}
});

bookSchema.pre('save', function (next) {
  console.log('save pre');
  var self = this;
  console.log(self);
  if (!self.update_at) {
    self.update_at = Date.now();
  }
  return next();
});

bookSchema.method({
  buy: function (quantity, customer, callback) {
    var self = this;
    console.log(self);
    return callback(quantity, customer);
    //return callback(results);
  },
  refund: function (customer, callback) {
    return callback();
    //return callback(results);
  }
});
bookSchema.static({
  getZeroInventoryReport: function (callback) {
    var self = this;
    return callback();
    //return callback(books);
  },
  getCountOfById: function (bookId, callback) {
    return callback();
    //return callback(count);
  }

});

var Book = mongoose.model('Book', bookSchema);
Book.getZeroInventoryReport(function () {
  console.log('call getZeroInventoryReport');
});
var practicalBook = new Book({name: 'Practical Node.js'});
practicalBook.buy(1, 2, function (quantity, customer) {
  console.log(quantity, customer);
});
practicalBook.save(function (err, results) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.info(results);
  process.exit(0);
});

