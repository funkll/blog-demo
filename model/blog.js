const fs = require('fs')

//读取db
const blogFilePath = 'db/blog.json'
const loadBlogs = () => {
    // 确保文件有内容，这里就不用处理文件不存在或者内容错误的情况了
    var content = fs.readFileSync(blogFilePath, 'utf8')
    var blogs = JSON.parse(content)
    return blogs
}
//把db读到的数据载入
var b = {
    data: loadBlogs(),
}

class ModelBlog {
    constructor(form) {
        this.title = form.title || ''
        this.author = form.author || ''
        this.content = form.content || ''
        this.created_time = Math.floor(new Date() / 1000)
    }
}

b.new = function(form) {
    var m = new ModelBlog(form)
    var d = this.data[this.data.length - 1]
    if (d == undefined) {
        m.id = 1
    } else {
        m.id = d.id + 1
    }
    this.data.push(m)
    this.save()
    return m
}

b.all = function () {
    var blogs = this.data
    return blogs
}

b.save = function() {
    var s = JSON.stringify(this.data, null, 2)
    fs.writeFile(blogFilePath, s, (error) => {
        if (error != null) {
            console.log('error', error)
        } else {
            console.log('保存成功')
        }
    })
}

b.get = function(id) {
    var blogs = this.data
    for (var i = 0; i < blogs.length; i++) {
        var blog = blogs[i]
        if (blog.id == id) {
            // var comment = require('./comment')
            // var comments = comment.all()
            // var cs = []
            // for (var j = 0; j < comments.length; j++) {
            //     var c = comments[j]
            //     if (blog.id == c.blog_id) {
            //         cs.push(c)
            //     }
            // }
            // blog.comments = cs
            return blog
        }
    }
    return {}
}

module.exports = b
