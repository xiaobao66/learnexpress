var express = require('express'),
    users = require('./routes/users');
var app = express();

//加载模板引擎ejs
app.set('views', ['./views']);
app.set('view engine', 'ejs');

//静态文件处理
app.use('/static', express.static('./public'));

//挂载点为/user路由
app.use('/user', users);

app.get('/', function(req, res) {
    res.render('index', {
        user: 'xiaobao',
        message: 'welcome to this system'
    });
});

app.listen(3000, function() {
    console.log('server starts');
});
