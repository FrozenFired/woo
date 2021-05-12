const Conf = require('../../../config/conf.js');
const Stint = require('../../../config/stint.js');
const Firm = require('../../../models/login/firm');
const User = require('../../../models/login/user');
const _ = require('underscore');

exports.adFirms = async(req, res) => {
	try{
		const crAder = req.session.crAder;
		const firms = await Firm.find()
		.sort({'shelf': -1})
		return res.render('./ader/firm/list', {title: '公司列表', crAder, firms });
	} catch(error) {
		return res.redirect('/?info=adFirms Error &error='+error)
	}
}
exports.adFirmAdd = (req, res) => {
	res.render('./ader/firm/add', {
		title: '添加新公司',
		crAder : req.session.crAder,
	})
}

const aderFirmBasicFilter_FuncProm = (obj) => {
	return new Promise((resolve, reject) => {
		let info = null;

		obj.code = obj.code.replace(/^\s*/g,"").toUpperCase();
		const regexp = new RegExp(Stint.extent.firm.code.regexp);
		if(obj.code.length != Stint.extent.firm.code.len || !regexp.test(obj.code)) info = "公司编号长度必须是"+Stint.extent.firm.code.len+"位英文字母";
		obj.nome = obj.nome.replace(/^\s*/g,"").toUpperCase();
		if(obj.nome.length < Stint.extent.firm.nome.min) info = "公司名称长度不能小于"+Stint.extent.firm.nome.min;
		obj.nick = obj.nick.replace(/^\s*/g,"").toUpperCase();
		if(obj.nick.length < Stint.extent.firm.nome.min) info = "公司代称长度不能小于"+Stint.extent.firm.nome.min;
		if(!Conf.categFirmNums.includes(parseInt(obj.categFirm))) info = "公司类型参数错误";
		if(obj.shelf != -1 && obj.shelf != 1) info ="公司上下架参数错误";

		if(info) {
			reject({info})
		} else {
			resolve(obj)
		}
	})
}

exports.adFirmNew = async(req, res) => {
	try{
		let obj = req.body.obj;
		obj = await aderFirmBasicFilter_FuncProm(obj);

		const param = {
			$or:[
				{'code': obj.code},
				{'nome': obj.nome},
				{'nick': obj.nick}
			]
		};
		const firmSame = await Firm.findOne(param);
		if(firmSame) {
			let info = "不可添加";
			if(firmSame.code == obj.code) info = "此公司编号已经存在";
			if(firmSame.nome == obj.nome) info = "此公司名称已经存在";
			if(firmSame.nick == obj.nick) info = "此公司代称已经存在";
			return res.redirect('/?info='+info);
		}
		const _object = new Firm(obj)
		const firmSave = await _object.save();
		return res.redirect('/adFirms');
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=adFirmNew,Error&error='+error)
	}
}
exports.adFirmUpd = async(req, res) => {
	try{
		let obj = req.body.obj
		obj = await aderFirmBasicFilter_FuncProm(obj);
		const param = {
			$or:[
				{'code': obj.code},
				{'nome': obj.nome},
				{'nick': obj.nick}
			]
		};
		const object = await Firm.findOne({_id: obj._id});
		if(!object) res.redirect('/?info=没有找到此公司');
				
		const firmSame = await Firm.findOne(param).where('_id').ne(obj._id)
		if(firmSame) {
			let info = "不可添加";
			if(firmSame.code == obj.code) info = "此公司编号已经存在";
			if(firmSame.nome == obj.nome) info = "此公司名称已经存在";
			if(firmSame.nick == obj.nick) info = "此公司代称已经存在";
			return res.redirect('/?info='+info);
		}
		const _object = _.extend(object, obj)
		const firmSave = await _object.save();
		return res.redirect("/adFirm/"+firmSave._id)
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=adFirmUpd,Error&error='+error)
	}
}


exports.adFirm = async(req, res) => {
	try{
		const crAder = req.session.crAder;
		const id = req.params.id;
		const firm = await Firm.findOne({_id: id});
		if(!firm) return res.redirect('/?info=没有找到此公司');

		return res.render('./ader/firm/detail', {title: '公司详情', crAder, firm})
	} catch(error) {
		return res.redirect('/?info=adFirm,Error&error='+error)
	}
}

exports.adFirmDel = async(req, res) => {
	try{
		const id = req.params.id;
		const firm = await Firm.findOne({_id: id});
		if(!firm) return res.redirect('/?info=没有找到此公司');

		const user = await User.findOne({firm: id});
		if(user) return res.redirect('/?info=此公司中还有员工，请先删除此公司的员工');
				
		const firmDel = await Firm.deleteOne({_id: id});
		return res.redirect("/adFirms");
	} catch(error) {
		return res.redirect('/?info=adFirmDel,Error&error='+error)
	}
}