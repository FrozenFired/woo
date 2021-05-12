const Index = require('../controllers/local/ader/index');

const Ader = require('../controllers/local/ader/ader'); // ct control

const Firm = require('../controllers/local/ader/firm')
const User = require('../controllers/local/ader/user')

const MdRole = require('../middle/local/middleRole')

const multipart = require('connect-multiparty')
const postForm = multipart();

module.exports = function(app){

	/* index --------------- Ader 首页 登录页面 登录 登出---------------------- */
	app.get('/ader', Index.aderHome)
	app.get('/aderLogin', Index.aderLogin)
	app.post('/loginAder', Index.loginAder)
	app.get('/aderLogout', Index.aderLogout)

	/* index -------------------- 添加删除(后期要关闭) ----------------------------- */
	app.get('/aderAdd', Ader.aderAdd)
	app.post('/aderNew', Ader.aderNew)
	app.get('/aderDel/:id', MdRole.aderIsLogin, Ader.aderDel)

	app.get('/aders', MdRole.aderIsLogin, Ader.aders)
	app.get('/ader/:id', MdRole.aderIsLogin, Ader.ader)

	/* Firm ---------------------- Firm ---------------------------------- */
	app.get('/adFirms', MdRole.aderIsLogin, Firm.adFirms)
	app.get('/adFirm/:id', MdRole.aderIsLogin, Firm.adFirm)
	app.get('/adFirmDel/:id', MdRole.aderIsLogin, Firm.adFirmDel)

	app.get('/adFirmAdd', MdRole.aderIsLogin, Firm.adFirmAdd)
	app.post('/adFirmNew', MdRole.aderIsLogin, Firm.adFirmNew)
	app.post('/adFirmUpd', MdRole.aderIsLogin, Firm.adFirmUpd)

	/* user ---------------------- user ---------------------------------- */
	app.get('/adUsers', MdRole.aderIsLogin, User.adUsers)
	app.get('/adUser/:id', MdRole.aderIsLogin, User.adUser)
	app.get('/adUserDel/:id', MdRole.aderIsLogin, User.adUserDel)

	app.post('/adUserUpdInfo', MdRole.aderIsLogin, User.adUserUpdInfo)
	app.post('/adUserUpdCode', MdRole.aderIsLogin, User.adUserUpdCode)
	app.post('/adUserUpdPwd', MdRole.aderIsLogin, User.adUserUpdPwd)

	app.get('/adUserAdd', MdRole.aderIsLogin, User.adUserAdd)
	app.post('/adUserNew', MdRole.aderIsLogin, User.adUserNew)
}