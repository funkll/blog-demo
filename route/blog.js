const blog = require('../model/blog')

const add = {
    path: '/api/blog/add',
    method: 'post',
    func: (request, response) => {
        var form = request.body
        // console.log('form', form)
        var b = blog.new(form)
        var r = JSON.stringify(b)
        response.send(r)
    }
}

const all = {
    method: 'get',
    path: '/api/blog/all',
    func: (request, response) => {
        var blogs = blog.all()
        var r = JSON.stringify(blogs, null, 2)
        response.send(r)
    }
}

var deleteBlog = {
    path: '/api/blog/delete',
    method: 'post',
    func: (request, response) => {
        var id = request.body.id
        var success = blog.delete(id)
        var result = {
            success: success,
        }
        var r = JSON.stringify(result)
        response.send(r)
    }
}

var routes = [
    add,
    all,
    deleteBlog,
]

module.exports.routes = routes
