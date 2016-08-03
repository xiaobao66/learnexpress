var express = require('express'),
    users = require('./routes/users');
var app = express();

//静态文件处理
app.use('/static', express.static('./public'));

//挂载点为/user路由
app.use('/user', users);

app.get('/', function (req, res) {
    res.send('hello world');
});

app.listen(3000, function () {
    console.log('server starts');
});