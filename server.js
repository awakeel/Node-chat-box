var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var dbUrl = "mongodb://a:abc123@ds155833.mlab.com:55833/chatbox";
var mongoose = require('mongoose');
var app = express();
var Message = mongoose.model('Message', {
    name: String,
    message: String
})
mongoose.connect(dbUrl, { useNewUrlParser: true }, (err) => {

    console.log('conected');
})
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static(path.resolve('./html')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var s = http.listen(3000, function() {
    console.log('I am listening on', s.address())
});

app.get('/messages', (req, res) => {
    Message.find({}, (e, messages) => {
        res.send(messages);
    })

})
app.post('/messages', (req, res) => {
    var b = new Message(req.body);
    b.save((err) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            io.emit('message', req.body);
            res.send(req.body);
        }
    });

})
io.on('connection', function() {
    console.log('I am listening');
})