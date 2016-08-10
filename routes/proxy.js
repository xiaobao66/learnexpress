var url = require('url'),
    http = require('http');

function getProxy(weburl, callback) {
    var weburl = url.parse(weburl);
    var hostname = weburl.hostname,
        path = weburl.path;

    var options = {
        hostname: hostname,
        port: 80,
        path: path,
        method: 'GET'
    }
    var resData = '';

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            resData += chunk;
        });
        res.on('end', function() {
            callback(resData);
        })
    });

    req.on('error', function(e) {
        console.log(weburl + ": " + e.message);
    })

    req.end();
}

exports.getProxy = getProxy;
