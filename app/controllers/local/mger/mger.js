const Conf = require('../../../config/conf.js');
const User = require('../../../models/login/user');
const bcrypt = require('bcryptjs');

// get render  cookie值要在logout中设置
exports.index = async(req, res) => {
	const crUser = req.session.crUser;
	if(crUser && crUser.role == Conf.roleUser.owner.num) return res.redirect("/mger");

	return res.render('./index', {
		crUser,
		info: req.query.info,
		error: req.query.error,
		redirectUrl: req.query.redirectUrl
	})
};

// post redirect
exports.loginUser = async(req, res) => {
	// let firmCode = req.body.firm.replace(/^\s*/g,"").toUpperCase();
	try {
		const code = req.body.code.replace(/^\s*/g,"").toUpperCase();
		const pwd = String(req.body.pwd).replace(/^\s*/g,"");

		const user = await User.findOne({code: code, role: Conf.roleUser.owner.num})
			.populate({path: "firm", select: "code nome wpdns wookey woosecret"})
		if(!user) return res.redirect('/?info=没有此用户');

		const isMatch = await bcrypt.compare(pwd, user.pwd);
		if(!isMatch) return res.redirect('/?info=密码不匹配');

		req.session.crUser = user;
		let redirectUrl = '/mger';
		if(req.cookies.redirectUrl) redirectUrl = req.cookies.redirectUrl;
		// console.log(redirectUrl)
		return res.redirect(redirectUrl);
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=请输入登陆账户密码error='+error)
	}
}

// get redirect 主页的cookie值在此设置
exports.logout = (req, res) => {
	res.cookie('redirectUrl', '/');
	if(req.session.crUser) delete req.session.crUser;
	return res.redirect('/');
}

// get render
exports.mger = async(req, res) => {
	try{
		res.cookie('redirectUrl', '/mger');
		const crUser = req.session.crUser;

		return res.render('./mger/index', {
			title: '管理页面',
			crUser,
		})
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=您没有权限登陆操作界面&error='+error)
	}
};