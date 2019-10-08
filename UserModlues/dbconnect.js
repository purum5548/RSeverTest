var mongoose = require('mongoose');
// DB제어
mongoose.connect('mongodb://localhost:27017/RSever');
var db = mongoose.connection;
db.on('error', function(){
    console.log('Connection Failed!');
});
db.once('open', function() {
    console.log('Connected!');
});

const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: String,
    password: String,
    nickname:String,
    joindate:{ type: Date, default: Date.now  }
});
const User = mongoose.model('users', userSchema);

const docSchema = new Schema({
    id: String,
    nickname:String,
    title:String,
    data:String,
    postdate:{ type: Date, default: Date.now  }
});
const Docs = mongoose.model('docs', docSchema);


exports.User = User;
exports.Docs = Docs;
