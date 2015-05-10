var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TaskSchema   = new Schema({
    name:       String,
    BugzillaID: Number,
    project:    String
});

module.exports = mongoose.model('task', TaskSchema);