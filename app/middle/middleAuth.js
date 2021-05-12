const Conf = require('../config/conf.js');
const MdVerify = require('./middleVerify.js');


const isAuth = async(req, res, next, roleFunc) => {
	// console.log(req.cookies.accessToken)
	const accessToken = req.headers['authorization'];
	try {
		let user = await MdVerify.token_VerifyProm(accessToken, process.env.ACCESS_TOKEN_SECRET);
		roleFunc(user);
	} catch(error) {
		return res.json({status: 403, message: '授权过期 请重新登录'});
	}
}
exports.isUser = async(req, res, next) => {
	isAuth(req, res, next, (user) => {
		if(!Conf.roleNums.includes(user.role)) {
			return res.json({status: 400, message: "权限参数错误"})
		} else {
			req.user = user;
			next();
		}
	})
}
exports.isOwer = (req, res, next) => {
	isAuth(req, res, next, (user) => {
		if(user.role != Conf.roleUser.owner.num) {
			return res.json({status: 403, message: '您没有此权限'})
		} else {
			req.user = user;
			next();
		}
	})
}
exports.isMger = (req, res, next) => {
	isAuth(req, res, next, (user) => {
		if(user.role != Conf.roleUser.manager.num && user.role != Conf.roleUser.owner.num) {
			return res.json({status: 403, message: '您没有此权限'})
		} else {
			req.user = user;
			next();
		}
	})
}

exports.isBser = (req, res, next) => {
	isAuth(req, res, next, (user) => {
		if(user.role != Conf.roleUser.manager.num && !Conf.roleAdmins.includes(user.role)) {
			return res.json({status: 403, message: '您没有此权限'})
		} else {
			req.user = user;
			next();
		}
	})
}