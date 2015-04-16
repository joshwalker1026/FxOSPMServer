var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ProjectSchema   = new Schema({
    name:       String,
    BugzillaID: Number

});

module.exports = mongoose.model('project', ProjectSchema);