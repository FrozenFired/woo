const Conf = require('../../../config/conf.js')
const MdFilter = require('../../../middle/middleFilter');
const _ = require('underscore');

const User = require('../../../models/login/user');
const Firm = require('../../../models/login/firm');

exports.adUsers = async(req, res) => {
	try{
		const crAder = req.session.crAder;
		const users = await User.find()
		.populate('firm')
		.sort({'shelf': -1, 'firm': 1, 'role': 1})
		return res.render('./ader/user/list', {title: '用户列表', crAder, users })
	} catch(error) {
		return res.redirect('/?info=adUsers,Error&error='+error)
	}
}

exports.adUserAdd = async(req, res) => {
	try{
		const crAder = req.session.crAder;
		const firms = await Firm.find({'shelf': Conf.shelf.put.num});
		if(!firms || firms.length == 0) return res.redirect('/?info=请先添加公司');
		return res.render('./ader/user/add', {title: 'Add 用户', crAder, firms})
	} catch(error) {
		return res.redirect('/?info=adUserAdd,Error&error='+error)
	}
}

exports.adUserNew = async(req, res) => {
	try{
		const obj = req.body.obj
		obj.code = await MdFilter.userCode_FilterProm(obj.code);
		obj.pwd = await MdFilter.userPwdBcrypt_FilterProm(obj.pwd);
		const firm = await Firm.findOne({'_id': obj.firm});
		if(!firm) return res.redirect('/?info=没有找到此公司,请重新选择');
		if(!Conf.roleNums.includes(parseInt(obj.role))) return res.redirect('/?info=用户角色参数错误');
		if(obj.shelf != -1 && obj.shelf != 1) return res.redirect('/?info=用户上下架参数错误');
		
		// const userSame = await User.findOne({'code': obj.code, firm: obj.firm });
		const userSame = await User.findOne({'code': obj.code});
		if(userSame) return res.redirect('/?info=已有此账号，请重新注册');

		const _object = new User(obj)
		const userSave = await _object.save();
		return res.redirect('/adUsers')
	} catch(error) {
		console.log(error)
		return res.redirect('/?info=adUserNew,Error&error='+error)
	}
}

exports.adUserUpdInfo = async(req, res) => {
	try{
		const obj = req.body.obj
		if(obj.code) return res.redirect('/?info=不允许有账户参数');
		if(obj.pwd) return res.redirect('/?info=不允许有密码参数');
		if(obj.firm) return res.redirect('/?info=不允许有公司参数');
		if(!Conf.roleNums.includes(parseInt(obj.role))) return res.redirect('/?info=用户角色参数错误');
		if(obj.shelf != -1 && obj.shelf != 1) return res.redirect('/?info=用户上下架参数错误');
		
		const user = await User.findOne({'_id': obj._id})
		if(!user) return res.redirect('/?info=没有找到此用户');
		
		const _object = _.extend(user, obj)
		const userSave = await _object.save();
		return res.redirect("/adUser/"+userSave._id)
	} catch(error) {
		console.log(error)
		return res.redirect('/?info=adUserUpdInfo,Error&error='+error)
	}
}
exports.adUserUpdPwd = async(req, res) => {
	try{
		const userId = req.body.userId
		const user = await User.findOne({'_id': userId})
		if(!user) return res.redirect('/?info=没有找到此用户');
		
		user.pwd = await MdFilter.userPwdBcrypt_FilterProm(req.body.pwd);
		const userSave = await user.save();
		return res.redirect("/adUser/"+userSave._id)
	} catch(error) {
		console.log(error)
		return res.redirect('/?info=adUserUpdPwd,Error&error='+error)
	}
}
exports.adUserUpdCode = async(req, res) => {
	try{
		const userId = req.body.userId
		const user = await User.findOne({'_id': userId})
		if(!user) return res.redirect('/?info=没有找到此用户');
		
		code = await MdFilter.userCode_FilterProm(req.body.code);
		// const userSame = await User.findOne({'code': code, firm: user.firm})
		const userSame = await User.findOne({'code': code})
		.where('_id').ne(user._id);
		if(userSame) return res.redirect('/?info=已有此账号');

		user.code = code;
		const userSave = await user.save();
		return res.redirect("/adUser/"+userSave._id);
	} catch(error) {
		console.log(error)
		return res.redirect('/?info=adUserUpdCode,Error&error='+error)
	}
}

exports.adUser = async(req, res) => {
	try{
		const crAder = req.session.crAder;
		const id = req.params.id;
		const user = await User.findOne({'_id': id}).populate('firm', 'code nome nick');
		if(!user) return res.redirect('/?info=没有找到此账号');
		return res.render('./ader/user/detail', {title: '用户详情', crAder, user});
	} catch(error) {
		console.log(error)
		return res.redirect('/?info=adUser,Error&error='+error)
	}
}
exports.adUserDel = async(req, res) => {
	try{
		const id = req.params.id;
		const userDel = await User.deleteOne({'_id': id});
		return res.redirect("/adUsers");
	} catch(error) {
		console.log(error)
		return res.redirect('/?info=adUserDel,Error&error='+error)
	}
}