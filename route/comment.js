var comment = require('../model/comment')

const all = {
    path: '/api/comment/all',
    method: 'get',
    func: (request, response) => {
        var comments = comment.all()
        var r = JSON.stringify(comments)
        response.send(r)
    }
}

const add = {
    path: '/api/comment/add',
    method: 'post',
    func: (request, response) => {
        var form = request.body
        var b = comment.new(form)
        var r = JSON.stringify(b)
        response.send(r)
    }
}

var routes = [
    all,
    add,
]

module.exports.routes = routes
