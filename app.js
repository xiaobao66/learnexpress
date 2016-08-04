var express = require('express'),
    users = require('./routes/users');
var app = express();

var testData = {
    user: 'xiaobao',
    message: 'welcome to this system'
};

//加载模板引擎ejs
app.set('views', './views');
app.set('view engine', 'ejs');

//静态文件处理
app.use('/static', express.static('./public'));

//挂载点为/user路由
app.use('/user', users);

app.get('/', function(req, res) {
    res.render('index', testData);
});

app.listen(3000, function() {
    console.log('server starts');
});
