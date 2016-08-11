var express = require('express'),
    url = require('url'),
    async = require('async'),
    users = require('./routes/users'),
    proxy = require('./routes/proxy');
var app = express();

var globalScriptContent = [];
var globalRandoms = [];

function getMozEcName(weburl, number, callback) {
    proxy.getProxy(weburl, function(data) {
        var evalContent = data.match(/eval\((.*)\)/)[1];
        eval("globalScriptContent[" + number + "]= " + evalContent + ";");
        var mozEcName = globalScriptContent[number].match(/document\.mozEcName\.push\(.*?\)/ig);
        for (var i = 0; i < mozEcName.length; i++) {
            globalRandoms.push(mozEcName[i].match(/document\.mozEcName\.push\((.*)\)/i)[1]);
        }
        console.log(globalRandoms);
        callback();
    });
}

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

app.get('/proxy', function(req, res) {
    var weburl = req.query.url;
    var weburlObj = url.parse(weburl),
        protocol = weburlObj.protocol,
        hostname = weburlObj.hostname;
    proxy.getProxy(weburl, function(data) {
        var scripts = data.match(/<script type=\"text\/javascript\" charset=\"utf-8\" src=\"(.*?)\"><\/script>/g);
        var scriptUrls = [];
        for (var i = 0; i < scripts.length; i++) {
            scriptUrls.push(scripts[i].match(/<script type=\"text\/javascript\" charset=\"utf-8\" src=\"(.*?)\"><\/script>/)[1]);
        }
        async.eachSeries(scriptUrls, function(scriptUrl, callback) {
            var number = scriptUrls.indexOf(scriptUrl);
            getMozEcName(protocol + '//' + hostname + scriptUrl, number, function() {
                callback(null);
            });
        }, function(err) {
            res.end('hello world');
        })
        res.end('hello world');
    });
});

app.listen(3000, function() {
    console.log('server starts');
});
