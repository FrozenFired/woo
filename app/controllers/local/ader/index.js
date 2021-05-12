const Ader = require('../../../models/login/ader');
const bcrypt = require('bcryptjs');

exports.aderHome = (req, res, next) => {
	if(!req.session.crAder) {
		res.redirect('/aderLogin');
	} else {
		res.render('./ader/index/index', {
			title: '平台管理',
			crAder : req.session.crAder,
		});
	}
};

exports.aderLogin = (req, res) => {
	res.render('./ader/index/login', {
		title: 'Adminnistrator Login'
	});
};

exports.loginAder = async(req, res) => {
	try {
		const code = req.body.code.replace(/^\s*/g,"").toUpperCase();
		const pwd = req.body.pwd.replace(/^\s*/g,"");
		let ader = await Ader.findOne({code: code});
		if(!ader) return res.redirect('/?info=Adminnistrator Code 不正确, 请重新登陆');

		const isMatch = bcrypt.compare(pwd, ader.pwd);
		if(!isMatch) return res.redirect('/?info=Adminnistrator Code 密码不符, 请重新登陆');

		req.session.crAder = ader
		return res.redirect('/ader')
	} catch(error) {
		return res.redirect('/?info=admin登录时数据库错误, 请联系管理员');
	}
}

exports.aderLogout = (req, res) => {
	delete req.session.crAder
	res.redirect('/')
}