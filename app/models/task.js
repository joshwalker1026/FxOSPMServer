var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TaskSchema   = new Schema({
    name:       String,
    BugzillaID: Number

});

module.exports = mongoose.model('task', TaskSchema);