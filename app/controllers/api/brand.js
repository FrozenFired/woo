const Conf = require('../../config/conf.js');
const Brand = require('../../models/basic/brand');
const MdFilter = require('../../middle/middleFilter');
const MdFiles = require('../../middle/middleFiles');

exports.brandFunc = async(req, res) => {
	// console.log("/brand")
	try {
		const crUser = req.user;
		const brandId = req.params.brandId;
		const {param, filter} = brandParamFilter(req.params.brandId, crUser);
		const brand = await Brand.findOne(param, filter)
		.populate("nation", "code")
		.populate({path: "bnCategSec", populate: {path: "bnCategFir"}})
		.populate({path: "discounts", populate: {path: "stream"}})
		if(!brand) return res.json({status: 400, message: "没有此品牌"});
		// console.log(brand)
		return res.status(200).json({
			status: 200,
			message: '成功获取',
			data: {brand}
		});
	} catch(error) {
		console.log(error)
		res.json({status: 400, message: error})
	}
}


exports.brandNewFunc = async(req, res) => {
	console.log("/brandNew");
	try {
		const crUser = req.user;
		const obj = req.obj;

		if(obj.code) {
			console.log(obj.code)
			obj.code = obj.code.replace(/^\s*/g,"").toUpperCase();
		}
		obj.nome = obj.nome.replace(/^\s*/g,"").toUpperCase();
		const existBrand = await Brand.findOne({"nome": obj.nome, "firm": crUser.firm});
		if(existBrand) return res.json({status: 400, message: '已经有此账号, 请重更换账号'});

		obj.firm = crUser.firm;
		obj.weight = 100;

		const _object = new Brand(obj)
		const brandSave = await _object.save();
		res.json({status: 200, message: '创建成功'})
	} catch(error) {
		console.log(error);
		return res.json({status: 500, message: 'brandNewFunc, error[1]'});
	}
}

exports.brandsFunc = async(req, res) => {
	// console.log("/brands")
	try{
		const crUser = req.user;
		const {param, filter, sortBy, page, pagesize, skip} = brandsParamFilter(req, crUser);
		// console.log(param)

		const count = await Brand.countDocuments(param);
		// console.log(count);

		const brands = await Brand.find(param, filter)
		.populate("nation", "code")
		.populate("bnCategSec", "code")
		.skip(skip).limit(pagesize)
		.sort({'weight': -1, 'shelf': -1, 'updAt': -1})
		// console.log(count)
		return res.status(200).json({
			status: 200,
			message: '成功获取',
			data: {brands, count, page, pagesize}
		});
	} catch(error) {
		return res.json({status: 500, message: '系统登录错误, 请联系管理员。 错误码: get/brands[1]'})
	}
}








const brandsParamFilter = (req, crUser) => {
	let param = {
		"firm": crUser.firm,
	};
	const filter = {};
	const sortBy = {};

	if(req.query.nome) {
		let symbConb = String(req.query.nome)
		symbConb = symbConb.replace(/(\s*$)/g, "").replace( /^\s*/, '').toUpperCase();
		symbConb = new RegExp(symbConb + '.*');
		param["nome"] = {'$in': symbConb};
	}

	if(!Conf.roleAdmins.includes(crUser.role)) {
		filter.discounts = 0
	}

	if(req.query.sortKey && req.query.sortVal) {
		let sortKey = req.query.sortKey;
		let sortVal = parseInt(req.query.sortVal);
		if(!isNaN(sortVal) && (sortVal == 1 || sortVal == -1)) {
			sortBy[sortKey] = sortVal;
		}
	}

	sortBy['shelf'] = -1;
	sortBy['updAt'] = -1;

	const {page, pagesize, skip} = MdFilter.page_Filter(req);
	return {param, filter, sortBy, page, pagesize, skip};
}


const brandParamFilter = (brandId, crUser) => {
	const param = {
		"firm": crUser.firm,
		"_id": brandId
	};

	const filter = {'pwd': 0, 'refreshToken': 0};

	if(!Conf.roleAdmins.includes(crUser.role)) {
		param.stream = crUser.stream;
	}

	return {param, filter};
}







exports.brandDelFunc = async(req, res) => {
	try {

		const crUser = req.user;
		const brandId = req.params.brandId;

		const brand = await Brand.findOne({_id: brandId, firm: crUser.firm});
		if(!brand) return res.json({status: 500, message: 'brandDelFunc 没有找到此品牌'});
		if(brand.logo) MdFiles.rmPicture(brand.logo);
		// const pdfir = await Pdfir.findOne({brand: brandId});
		// if(pdfir) return res.json({status: 500, message: '请先删除品牌下的所有产品'});

		const brandDel = await Brand.deleteOne({_id: brandId});
		return res.json({status: 200, message: '成功从服务器删除品牌'});
	} catch(error) {
		return res.json({status: 500, message: '系统登录错误, 请联系管理员。 错误码: get/brands[1]'})
	}
}