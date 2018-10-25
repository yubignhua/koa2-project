const path = require('path')
const Koa = require('koa')
const convert = require('koa-convert')
const views = require('koa-views')
const koaStatic = require('koa-static')
const bodyParser = require('koa-bodyparser')
const koaLogger = require('koa-logger')
const session = require('koa-session-minimal')
const MysqlStore = require('koa-mysql-session')
const chalk = require('chalk');
const ora = require('ora');

const spinner = ora('begin to start the server...');
spinner.start();

const config = require('./../config')
const routers = require('./routers/index')

const app = new Koa()

// session存储配置
const sessionMysqlConfig= {
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST,
}

// 配置session中间件
app.use(session({
  key: 'USER_SID',
  store: new MysqlStore(sessionMysqlConfig)
}))

// 配置控制台日志中间件
app.use(koaLogger())

// 配置ctx.body解析中间件
app.use(bodyParser())

// 配置静态资源加载中间件
app.use(koaStatic(
  path.join(__dirname , './../static')
))

// 配置服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}))

// 初始化路由中间件
app.use(routers.routes()).use(routers.allowedMethods())

// 监听启动端口
app.listen( config.port )
spinner.stop();
console.log(chalk.green(`the server is start at port: ${config.port} \n`))
console.log(chalk.cyan(
  `Tip: start are meant to be served over an HTTP server.\n     to access it Opening ${chalk.red(`http://localhost:${config.port}`)}  \n` 
))
