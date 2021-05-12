const MdFilter = require('../../../middle/middleFilter');
const _ = require('underscore')

const Ader = require('../../../models/login/ader')

exports.aderAdd = (req, res) => {
	res.render('./ader/ader/add', {
		title: 'Add Adminnistrator',
		crAder : req.session.crAder,
	})
}

exports.aderNew = async(req, res) => {
	try{
		const obj = req.body.obj
		obj.code = await MdFilter.userCode_FilterProm(obj.code);
		obj.pwd = await MdFilter.userPwdBcrypt_FilterProm(obj.pwd);

		const aderSame = await Ader.findOne({code: obj.code});
		if(aderSame) return res.redirect('/?info=此帐号已经被注册，请重新注册');

		const _ader = new Ader(obj)
		const aderSave = await _ader.save();

		return res.redirect('/aders')
	} catch(error) {
		return res.redirect('/?info=admin添加数据错误&error='+error)
	}
}

exports.aders = async(req, res) => {
	try{
		const crAder = req.session.crAder;
		const aders = await Ader.find();
		return res.render('./ader/ader/list', {title: '用户列表', crAder, aders })
	} catch(error) {
		return res.redirect('/?info=查看adimn列表时,数据库查找错误&error='+error)
	}
}

exports.ader = async(req, res) => {
	try{
		const crAder = req.session.crAder;
		const id = req.params.id;
		const ader = await Ader.findOne({_id: id});
		if(!ader) return res.redirect('/?info=找不到此账号');
		return res.render('./ader/ader/detail', {title: 'admin列表', crAder, ader })
	} catch(error) {
		return res.redirect('/?info=查看adimn信息时,数据库查找错误&error='+error)
	}
}

exports.aderDel = async(req, res) => {
	try{
		const id = req.params.id;
		const ader = await Ader.findOne({_id: id});
		if(!ader) return res.redirect('/?info=找不到此账号');
		const del = await Ader.deleteOne({_id: id});
		res.redirect('/aders')
			
	} catch(error) {
		return res.redirect('/?info=删除adimn时,数据库查找错误&error='+error)
	}
}