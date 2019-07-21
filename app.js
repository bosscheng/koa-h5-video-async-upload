'use strict';

const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const convert = require('koa-convert');
const views = require('koa-views');
const koaStatic = require('koa-static');
const app = new Koa();
const router = require('koa-router')();
const koaBody = require('koa-body')({
    multipart: true,
    formLimit: 2000 * 1024 * 1024,
    formidable: {
        uploadDir: __dirname + '/temps'
    }
});


// 设置渲染引擎
app.use(views(__dirname + '/views', {
    extension: 'ejs'
}));

app.use(convert(koaStatic(path.join(__dirname + '/public/'))));


router.get('/', (ctx) => {
    return ctx.render('index');
});

router.get('/result', (ctx) => {
    return ctx.render('result', {
        success: ctx.query.m
    });
});

router.post('/upload', koaBody,
    (ctx) => {
        const file = ctx.request.files && ctx.request.files.file;
        if (file) {
            const reader = fs.createReadStream(file.path);
            const ext = file.name.split('.').pop();
            const dir = path.join(__dirname, `/uploads/${(new Date()).getTime()}.${ext}`);
            const upStream = fs.createWriteStream(dir);
            reader.pipe(upStream);
            return ctx.body = 'success';
        } else {
            return ctx.body = 'error';
        }
    }
);

app.use(router.routes());

const port = process.env.PORT || 3000;
app.listen(port);
console.log('service start at http://localhost:3000');
