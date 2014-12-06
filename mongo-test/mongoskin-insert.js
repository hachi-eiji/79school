var mongoskin = require('mongoskin'),
  dbHost = '127.0.0.1',
  dbPort = 27017;

var db = mongoskin.db(dbHost + ':' + dbPort + '/local', {safe: true});

db.bind('messages', {
  findOneAndText: function (text, fn) {
    db.collection('messages').findOne({}, function (error, item) {
      if (error) {
        console.error(error);
        process.exit(1);
      }
      console.info('findOne: ', item);
      item.text = text;
      var id = item._id.toString();
      console.log('before saving', item);
      db.collection('messages').save(item, function (error, count) {
        console.info('save: ', count);
        return fn(count, id);
      });
    });
  }
});

var messages = db.collection('messages');
messages.findOneAndText('hi', function (count, id) {
  messages.find({_id: messages.id(id)}).toArray(function (error, items) {
    console.info('find: ', items);
    db.close();
    process.exit(0);
  });
});
