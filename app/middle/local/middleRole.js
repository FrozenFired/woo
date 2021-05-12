const Conf = require('../../config/conf.js');

exports.aderIsLogin = function(req, res, next) {
	let crAder = req.session.crAder;
	if(!crAder) {
		return res.redirect('/?info=需要您的Administrator账户');
	} else {
		next();
	}
};

exports.mgerIsLogin = function(req, res, next) {
	const crUser = req.session.crUser;
	if(!crUser) {
		return res.redirect('/?info=请登陆您的账号');
	} else if(crUser.role == Conf.roleUser.owner.num) {
		next();
	} else if(crUser.role == Conf.roleUser.manager.num) {
		next();
	} else {
		return res.redirect('/?info=没有相应权限');
	}
};