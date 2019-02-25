var log = console.log.bind(console)

var ajax = function(request) {
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

var e = function(selector) {
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
        <div class="gua-blog-cell">
            <div class="">
                <a class="blog-title" href="/blog/${id}" data-id="${id}">
                    ${title}
                </a>
            </div>
            <div class="">
                <span>${author}</span> @ <time>${time}</time>
            </div>
            <div class="blog-comments">
                <div class="new-comment">
                    <input class="comment-blog-id" type=hidden value="${id}">
                    <input class="comment-author" value="">
                    <input class="comment-content" value="">
                    <button class="comment-add">添加评论</button>
                </div>
            </div>
        </div>
    `
    return t
}

var apiBlogNew = (data, callback) => {
    var request = {
        method: 'POST',
        url: '/api/blog/add',
        data: data,
        contentType: 'application/json',
        callback: callback,
    }
    ajax(request)
}

var bindAdd = () => {
    e('#id-button-submit').addEventListener('click', function () {
        var form = {
            title: e('#id-input-title').value,
            author: e('#id-input-author').value,
            content: e('#id-input-content').value,
        }
        var data = JSON.stringify(form)
        apiBlogNew (data, function (response) {
            // 不考虑错误情况（断网、服务器返回错误等等）
            console.log('响应', response)
            var res = JSON.parse(response)
            var t = templateBlog(res)
            e('.blogs').insertAdjacentHTML('beforeend', t)
        })
    })
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

const blogAll = () => {
    apiBlogAll(function (response) {
        var blogs = JSON.parse(response)
        insertBlogAll(blogs)
    })
}

var insertBlogAll = function(blogs) {
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

var bindEvents = () => {
    bindAdd()
}

var __main = () => {
    blogAll()
    bindEvents()
}

__main()


