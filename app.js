var express = require('express')
var app = express()

var bodyParser = require('body-parser')
app.use(bodyParser.json())

app.use(express.static('static'))

const registerRoutes = (app, routes) => {
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i]
        app[route.method](route.path, route.func)
    }
}

const routeIndex = require('./route/index')
registerRoutes(app, routeIndex.routes)

const routeBlog = require('./route/blog')
registerRoutes(app, routeBlog.routes)

var server = app.listen(8000, () => {
    var host = server.address().address
    var port = server.address().port

    console.log('应用实例，访问地址为 http://%s:%s', host, port)
})


