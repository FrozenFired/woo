const Conf = require('../config/conf.js');
const User = require('../models/login/user');
const MdAuth = require('../middle/middleAuth');
const MdFilter = require('../middle/middleFilter');

module.exports = function(app){
	app.post('/api/userNew', MdAuth.isBser, userNewFunc);
	app.get('/api/users', MdAuth.isUser, usersFunc);
	app.get('/api/user/:userId', MdAuth.isBser, userFunc);
	app.delete('/api/userDel/:userId', MdAuth.isBser, userDelFunc);
};

const userParamFilter = (userId, crUser) => {
	const param = {
		"firm": crUser.firm,
		"_id": userId
	};

	const filter = {'pwd': 0, 'refreshToken': 0};

	if(Conf.roleAdmins.includes(crUser.role)) {
	} else if(crUser.role == Conf.roleUser.boss.num) {
		param.stream = crUser.stream;
	} else {
		param._id = crUser._id;
	}

	return {param, filter};
}
const userDelFunc = async(req, res) => {
	try {
		const crUser = req.user;
		const userId = req.params.userId;

		if(!Conf.roleAdmins.includes(crUser._id)) return res.json({status: 403, message: "您的权限不足"});
		const user = await User.findOne({_id: userId, firm: crUser.firm}, {_id: 1, role: 1});
		// console.log(user);
		if(user.role <= crUser.role) return res.json({status: 403, message: "您的权限不足"});

		const userDel = await User.deleteOne({_id: userId});
		return res.status(200).json({
			status: 200,
			message: '成功删除用户',
		});
	} catch(error) {
		console.log(error);
		res.json({status: 400, message: error});
	}
}
const userFunc = async(req, res) => {
	try {
		const crUser = req.user;
		const userId = req.params.userId;
		const {param, filter} = userParamFilter(req.params.userId, crUser);
		const user = await User.findOne(param, filter).populate("stream", "code nome");
		// console.log(user)
		if(crUser._id != user._id && user.role <= crUser.role) return res.json({status: 403, message: "您的权限不足"});
		return res.status(200).json({
			status: 200,
			message: '成功获取',
			data: {user}
		});
	} catch(error) {
		console.log(error);
		res.json({status: 400, message: error});
	}
}
const userNewFunc = async(req, res) => {
	try {
		const obj = req.body.obj;
		const crUser = req.user;
		if(crUser.role >= obj.role) return res.json({status: 403, message: "您的权限不足"});
		obj.code = await MdFilter.userCode_FilterProm(obj.code);
		const existUser = await User.findOne({"code": obj.code, "firm": obj.firm});
		if(existUser) return res.json({status: 400, message: '已经有此账号, 请重更换账号'});

		obj.pwd = await MdFilter.userPwdBcrypt_FilterProm(obj.pwd);
		obj.firm = crUser.firm;

		const _object = new User(obj)
		const newUser = await _object.save();
		res.json({status: 200, message: '创建成功'});
	} catch(error) {
		console.log(error);
		res.json({status: 400, message: error});
	}
}

const usersParamFilter = (req, crUser) => {
	const param = {
		"firm": crUser.firm,
	};

	let codeSymb = '$ne';
	let codeConb = 'rander[a`a。=]';
	if(req.query.code) {
		codeSymb = '$in';
		codeConb = String(req.query.code);
		codeConb = codeConb.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		codeConb = new RegExp(codeConb + '.*');
	}
	param.code = {[codeSymb]: codeConb};

	let roleSymb = '$gt';
	let roleConb = crUser.role;
	if(req.query.role && !isNaN(parseInt(req.query.role)) && parseInt(req.query.role) > crUser.role) {
		roleSymb = '$eq';
		roleConb = parseInt(req.query.role)
	}
	param.role = {[roleSymb]: roleConb};

	const filter = {'pwd': 0, 'refreshToken': 0};
	let sortBy = {};
	if(req.query.sortKey && req.query.sortVal) {
		let sortKey = req.query.sortKey;
		let sortVal = parseInt(req.query.sortVal);
		if(!isNaN(sortVal) && (sortVal == 1 || sortVal == -1)) {
			sortBy[sortKey] = sortVal;
		}
	}
	sortBy['shelf'] = -1;
	sortBy['updAt'] = -1;

	if(Conf.roleAdmins.includes(crUser.role)) {
		let streamSymb = '$ne';
		let streamConb = '5f1dff1063781676b6a5f6ff';
		if(req.query.stream) {
			streamSymb = '$eq';
			streamConb = req.query.stream;
		}
		if(crUser.role == Conf.roleUser.seller.num) {
			streamSymb = '$eq';
			streamConb = crUser._id;
		}
		param.stream = {[streamSymb]: streamConb};
	} else if(crUser.stream){
		param.stream = crUser.stream;
	}
	const {page, pagesize, skip} = MdFilter.page_Filter(req);
	return {param, filter, sortBy, page, pagesize, skip};
}
const usersFunc = async(req, res) => {
	try {
		const crUser = req.user;
		const {param, filter, sortBy, page, pagesize, skip} = usersParamFilter(req, crUser);
		// console.log(param)
		const count = await User.countDocuments(param);
		const users = await User.find(param, filter).skip(skip).limit(pagesize).sort(sortBy);
		if(page == 1) {
			const self = await User.findOne({"_id": crUser._id}, filter);
			users.unshift(self);
		}

		let isMore = 1; if(page*pagesize >= count) isMore = 0;

		return res.status(200).json({
			status: 200,
			message: '成功获取',
			data: {users, count, page, isMore}
		});
	} catch(error) {
		console.log(error);
		res.json({status: 400, message: error});
	}
}
