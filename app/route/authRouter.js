const User = require('../models/login/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const MdAuth = require('../middle/middleAuth');
const MdFilter = require('../middle/middleFilter');
const MdGenerate = require('../middle/middleGenerate');
const MdVerify = require('../middle/middleVerify');

module.exports = function(app){
	app.post('/api/login', loginFunc)
	app.get('/api/isLogin', MdAuth.isUser, isLoginFunc)

	app.post('/api/refreshtoken', refreshtokenFunc)

	app.delete('/api/logout', logoutFunc)
};


const isLoginFunc = async(req, res) => {
	res.json({status: 200, message: '登陆状态', data: {user: req.user}})
}
// 用户登出
const logoutFunc = async(req, res) => {
	const refreshToken = req.body.refreshtoken
	try {
		const payload = await MdVerify.token_VerifyProm(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		let user = await User.findOne({_id: payload._id});
		if(user && user.refreshToken == refreshToken) {
			user.refreshToken = null;
			const userSave = await user.save();
			return res.json({status: 200, message: '成功从服务器登出'});
		} else {
			return res.json({status: 400, message: '服务器未删除'});
		}
	} catch(error) {
		return res.json({status: 400, message: '未登出'});
	}
}

// 用refreshToken刷新 accessToken
const refreshtokenFunc = async(req, res) => {
	const refreshToken = req.body.refreshtoken
	try {
		const payload = await MdVerify.token_VerifyProm(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		const user = await User.findOne({_id: payload._id});
		if(!user || (user.refreshToken != refreshToken)) {
			return res.json({status: 403, message: '授权过期 请重新登录 错误码:refreshtokenFunc[1]'});
		}

		const accessToken = MdGenerate.generateAccessToken(user);
		return res.json({
			status: 200,
			message: '刷新token成功',
			data: {accessToken}
		});
	} catch(error) {
		return res.json({status: 403, message: '授权过期 请重新登录 错误码:refreshtokenFunc[2]'});
	}

}

// 用户登录
const loginFunc = async(req, res) => {
	try{
		let code = req.body.code.replace(/^\s*/g,"").toUpperCase();
		let pwd = String(req.body.pwd).replace(/^\s*/g,"");
		if(pwd.length == 0) pwd = " ";
		let user = await User.findOne({code: code});
		if(!user) return res.json({status: 403, message: '用户名不正确', });
		let isMatch = await bcrypt.compare(pwd, user.pwd);
		if(!isMatch) return res.json({status: 403, message: '密码不匹配'});

		const accessToken = MdGenerate.generateAccessToken(user);
		const refreshToken = MdGenerate.generateRefreshToken(user);

		user.logAt = Date.now();
		user.refreshToken = refreshToken;
		const userSave = await user.save();

		// res.cookie('accessToken', accessToken, {httpOnly: true})
		return res.json({
			status: 200,
			message: '登录成功',
			data: {accessToken, refreshToken},
		})
	} catch(error) {
		console.log(error)
		return res.json({status: 500, message: '系统登录错误, 请联系管理员。 错误码: loginFunc[1]'})
	}
}
