const log = console.log.bind(console)

const ajax = function(request) {
    var r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.contentType != undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = function() {
        if (r.readyState == 4) {
            request.callback(r.response)
        }
    }
    if (request.method == 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
}

const e = (selector) => {
    var element = document.querySelector(selector)
    if (element == null) {
        var s = `${selector} not exist`
        alert(s)
    } else {
        return element
    }
}

const templateBlog = (blog) => {
    var id = blog.id
    var title = blog.title
    var author = blog.author
    var d = new Date(blog.created_time * 1000)
    var time = d.toLocaleString()
    var t = `
        <div class="blog-cell" data-id="${id}" >
            <div class="">
                <a class="blog-title" href="/blog/${id}" >
                    ${title}
                </a>
                <button class="blog-delete">删除文章</button>
            </div>
            <div class="">
                <span>${author}</span> @ <time>${time}</time>
            </div>
            <div class="blog-comments">
                <div class="new-comment">
                    <input class="comment-blog-id" type=hidden value="${id}">
                    <input class="comment-author" placeholder="Author" value="" required>
                    <input class="comment-content" placeholder="Content" value="">
                    <button class="comment-add">添加评论</button>
                </div>
            </div>
        </div>
    `
    return t
}

const insertBlogAll = (blogs) => {
    var html = ''
    for (var i = 0; i < blogs.length; i++) {
        var b = blogs[i]
        var t = templateBlog(b)
        html += t
    }
    // 把数据写入 .blogs 中，直接用覆盖式写入
    var div = document.querySelector('.blogs')
    div.innerHTML = html
}

const apiBindDelete = (data, callback) => {
    const request = {
        method: 'POST',
        url: '/api/blog/delete',
        data: data,
        contentType: 'application/json',
        callback: callback,
    }
    ajax(request)
}

const apiBlogNew = (data, callback) => {
    const request = {
        method: 'POST',
        url: '/api/blog/add',
        data: data,
        contentType: 'application/json',
        callback: callback,
    }
    ajax(request)
}

const apiBlogAll = (callback) => {
    var request = {
        method: 'GET',
        url: '/api/blog/all',
        contentType: 'application/json',
        callback: callback,
    }
    ajax(request)
}

const apiAddComment = (data, callback) => {
    const request = {
        method: 'POST',
        url: '/api/comment/add',
        contentType: 'application/json',
        data: data,
        callback: callback,
    }
    ajax(request)
}

const apiCommentAll = (callback) => {
    var request = {
        method: 'GET',
        url: '/api/comment/all',
        contentType: 'application/json',
        callback: callback,
    }
    ajax(request)
}

const blogAll = () => {
    apiBlogAll(function (response) {
        console.log('响应', response)
        var blogs = JSON.parse(response)
        window.blogs = blogs
        insertBlogAll(blogs)
    })
}

const commentAll = () => {
    apiCommentAll(function (response) {
        var comments = JSON.parse(response)
        log('comments', comments)
    })
}

const actionAdd = () => {
    var form = {
        title: e('#id-input-title').value,
        author: e('#id-input-author').value,
        content: e('#id-input-content').value,
    }
    var data = JSON.stringify(form)
    apiBlogNew (data, function (response) {
        // 不考虑错误情况（断网、服务器返回错误等等）
        var res = JSON.parse(response)
        var t = templateBlog(res)
        e('.blogs').insertAdjacentHTML('beforeend', t)
    })
}

const actionDelete = (self) => {
    const blogCell = self.closest('.blog-cell')
    blogCell.remove()
    var form = {
        id: blogCell.dataset.id,
    }
    var data = JSON.stringify(form)
    apiBindDelete(data, function (response) {
        log('result', response)
    })
}

const actionAddComment = (self) => {
    var f = self.closest('.new-comment')
    var blogId = f.querySelector('.comment-blog-id').value
    var author = f.querySelector('.comment-author').value
    var content = f.querySelector('.comment-content').value
    var form = {
        blog_id: blogId,
        author: author,
        content: content,
    }
    var data = JSON.stringify(form)
    apiAddComment(data, function(response) {
        var comment = JSON.parse(response)
        log('新评论', comment)
    })
}

const bindDeligates = () => {
    e('#id-button-submit').addEventListener('click', function () {
        actionAdd()
    })
    const blogsContainer = e('.blogs')
    blogsContainer.addEventListener('click', function () {
        var self = event.target
        var has = self.classList.contains.bind(self.classList)
        if (has('blog-delete')) {
            actionDelete(self)
        } else if (has('comment-add')) {
            actionAddComment(self)
        }
    })
}

var __main = () => {
    bindDeligates()
    blogAll()
    commentAll()
}

__main()


