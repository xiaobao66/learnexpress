var express = require('express'),
    url = require('url');
users = require('./routes/users'),
    proxy = require('./routes/proxy');
var app = express();

var globalScriptContent = [];
var globalRandoms = [];

function getMozEcName(weburl, number, callback) {
    console.log(weburl);
    proxy.getProxy(weburl, function(data) {
        var evalContent = data.match(/eval\((.*)\)/)[1];
        eval("globalScriptContent[" + number + "]= " + evalContent + ";");
        var mozEcName = globalScriptContent[number].match(/document\.mozEcName\.push\(.*?\)/ig);
        console.log(mozEcName);
        for (var i = 0; i < mozEcName.length; i++) {
            globalRandoms.push(mozEcName[i].match(/document\.mozEcName\.push\((.*)\)/i)[1]);
        }
        console.log(globalRandoms);
        callback();
    });
}

//静态文件处理
app.use('/static', express.static('./public'));

//挂载点为/user路由
app.use('/user', users);

app.get('/', function(req, res) {
    res.send('hello world');
});

app.get('/proxy', function(req, res) {
    var weburl = req.query.url;
    var weburlObj = url.parse(weburl),
        protocol = weburlObj.protocol,
        hostname = weburlObj.hostname;
    proxy.getProxy(weburl, function(data) {
        var scripts = data.match(/<script type=\"text\/javascript\" charset=\"utf-8\" src=\"(.*?)\"><\/script>/g);
        var scriptUrl = scripts[0].match(/<script type=\"text\/javascript\" charset=\"utf-8\" src=\"(.*?)\"><\/script>/)[1];
        getMozEcName(protocol + '//' + hostname + scriptUrl, 0, function() {
            var scriptUrl = scripts[1].match(/<script type=\"text\/javascript\" charset=\"utf-8\" src=\"(.*?)\"><\/script>/)[1];
            getMozEcName(protocol + '//' + hostname + scriptUrl, 1, function() {
                res.end('proxy finish');
            });
        });
    });
})

app.listen(3000, function() {
    console.log('server starts');
});
