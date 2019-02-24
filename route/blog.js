const blog = require('../model/blog')

const add = {
    path: '/api/blog/add',
    method: 'post',
    func: (request, response) => {
        var form = request.body
        console.log('form', form)
        var b = blog.new(form)
        var r = JSON.stringify(b)
        response.send(r)
    }
}

var routes = [
    add
]

module.exports.routes = routes
