const Conf = require('../../../config/conf.js');
const User = require('../../../models/login/user')
const MdFilter = require('../../../middle/middleFilter');
const _ = require('underscore')

// get
exports.users = async(req, res) => {
	try {
		const crUser = req.session.crUser;

		const users = await User.find()
		.where('role').gt(crUser.role)
		.sort({'role': 1})

		users.unshift(crUser)
		return res.render('./mger/user/list', {
			title: '用户列表',
			crUser,
			users
		})
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=您没有权限登陆操作界面&error='+error)
	}
}

// post
exports.userNew = async(req, res) => {
	try {
		const crUser = req.session.crUser;
		const obj = req.body.obj;
		if(crUser.role >= obj.role) return res.redirect('/mger?errorInfo=添加用户错误&redirectUrl=/users&error=您无权此操作');
		obj.code = await MdFilter.userCode_FilterProm(obj.code);
		obj.pwd = await MdFilter.userPwdBcrypt_FilterProm(obj.pwd);

		const userSame = await User.findOne({'code': obj.code, 'firm': obj.firm});
		// console.log(userSame)
		if(userSame) return res.redirect('/mger?errorInfo=添加用户错误&redirectUrl=/users&error=此账号重复');

		const _object = new User(obj)
		const userSave = await _object.save();
		return res.redirect('/users')

	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=添加用户错误&redirectUrl=/users&error='+error)
	}
}

// get
exports.user = async(req, res) => {
	try {
		const crUser = req.session.crUser;
		const userId = req.params.userId;

		let user;
		if(userId == crUser._id) {
			user = crUser;
		} else {
			user = await User.findOne({_id: userId})
			.where('role').gt(crUser.role)
			if(!user) return res.redirect('/mger?errorInfo=查看用户信息错误&redirectUrl=/users&error=找不到此用户信息');
		}
		return res.render('./mger/user/detail', {
			title: '用户信息',
			crUser: crUser,
			user: user
		})
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=查看用户信息错误&redirectUrl=/users&error='+error)
	}
}

// get
exports.userDel = async(req, res) => {
	try {
		const crUser = req.session.crUser;
		const userId = req.params.userId;
		const user = await User.findOne({_id: userId})
		.where('role').gt(crUser.role)
		if(!user) return res.redirect('/mger?errorInfo=删除用户错误&redirectUrl=/users&error=找不到此用户信息');

		await User.deleteOne({_id: userId});
		return res.redirect('/users')
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=删除用户错误&redirectUrl=/users&error='+error)
	}
}

exports.userUpd = (req, res) => {
	let crUser = req.session.crUser;
	let obj = req.body.obj
	if(obj.code) {
		obj.code = obj.code.replace(/^\s*/g,"").toUpperCase();
	}
	User.findOne({_id: obj._id}, (err, user) => {
		if(err) {
			info = "mger UserUpd, User Findone Error!";
			Err.usError(req, res, info);
		} else if(!user) {
			info = "此用户已经被删除";
			Err.usError(req, res, info);
		} else {
			if(crUser.role == user.role) {
				if(obj.pw || obj.pw == "") {
					usUser_changePwd(req, res, obj, user);
				} else {
					usUser_save(req, res, obj, user);
				}
			} else if(Conf.roleAdmins.includes(crUser.role) && crUser.role < user.role) {
				if(obj.code && obj.code != user.code) {
					usUser_changeCode(req, res, obj, user);
				} else {
					usUser_save(req, res, obj, user);
				}
			} else {
				info = "您无权修改此人信息";
				Err.usError(req, res, info);
			}
		}
	})
}
let bcrypt = require('bcryptjs');
let usUser_changePwd = (req, res, obj, user) => {
	let crUser = req.session.crUser;
	if(crUser.role == user.role) {
		obj.pw = obj.pw.replace(/^\s*/g,"");
		bcrypt.compare(obj.pw, user.pwd, (err, isMatch) => {
			if(err) console.log(err);
			if(!isMatch) {
				info = "原密码错误，请重新操作";
				Err.usError(req, res, info);
			}
			else {
				usUser_save(req, res, obj, user);
			}
		});
	} else {
		usUser_save(req, res, obj, user);
	}
}
let usUser_changeCode = (req, res, obj, user) => {
	User.findOne({code: obj.code})
	.where('_id').ne(obj._id)
	.exec((err, objSame) => {
		if(err) {
			info = "mger User ChangeCode, User Findone Error!";
			Err.usError(req, res, info);
		} else if(objSame) {
			info = "此用户名已经存在";
			Err.usError(req, res, info);
		} else {
			usUser_save(req, res, obj, user);
		}
	})
}
let usUser_save = (req, res, obj, user) => {
	let _user = _.extend(user, obj)
	_user.save((err, userSave) => {
		if(err) {
			info = "mger User_Save, User Save Error!"
			Err.usError(req, res, info);
		} else {
			if(req.session.crUser._id == userSave._id) {
				User.findOne({_id: userSave._id})
				.populate('firm')
				.exec((err, crUser) => {
					req.session.crUser = crUser;
					res.redirect('/user/'+userSave._id)
				})
			} else {
				res.redirect('/user/'+userSave._id)
			}
		}
	})
}