const MdWoo = require('../../../middle/woo/middleWoo');
const MdFile = require('../../../middle/local/middleFile');
const Conf = require('../../../config/conf');

exports.prods = async(req, res) => {
	// console.log("/prods")
	try{
		const crUser = req.session.crUser;
		let url = "products?";
		let errorInfo = null;

		if(req.query.search) {
			url += "&search="+req.query.search;
		}
		if(req.query.status) {
			if(Conf.prod.status.arr.includes(req.query.status)) {
				url += "&status="+req.query.status;
			} else {
				errorInfo = "产品状态参数错误"
			}
		}
		if(req.query.featured) {
			if(["true", "false"].includes(req.query.featured)) {
				url += "&featured="+req.query.featured;
			} else {
				errorInfo = "产品精选参数错误"
			}
		}
		if(req.query.type) {
			if(Conf.prod.type.arr.includes(req.query.type)) {
				url += "&type="+req.query.type;
			} else {
				errorInfo = "产品类型参数错误"
			}
		}

		let per_page = 10;
		if(req.query.per_page && !isNaN(parseInt(req.query.per_page))) per_page=parseInt(req.query.per_page);
		url += "&per_page="+per_page;

		let page = 1;
		if(req.query.page && !isNaN(parseInt(req.query.page))) page = parseInt(req.query.page);
		url += "&page="+page;

		const prods = await MdWoo.wooGet_Prom(url, crUser.firm);
		return res.render('./mger/prod/list', {
			title: '产品列表',
			crUser,
			errorInfo,
			prods,
			page,
			per_page
		})
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=您没有权限登陆操作界面&error='+error);
	}
};

exports.prodAdd = async(req, res) => {
	// console.log("/prods")
	try{
		const crUser = req.session.crUser;

		const categories = await MdWoo.wooGet_Prom("products/categories?per_page=100", crUser.firm);
		return res.render('./mger/prod/add', {
			title: '新产品',
			crUser,
			categories
		})
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=您没有权限登陆操作界面&error='+error);
	}
};

exports.prodPost = async(req, res) => {
	console.log("/prodPost")
	try{
		const crUser = req.session.crUser;
		const images = req.body.files;
		const data= req.body.data;
		const attributes = req.body.attributes;
		if(!data.type) return res.json({status: 400, message: "需要传入 产品类型"});
		if(data.type == "variable") {
			if(!attributes || attributes.length == 0) return res.json({status: 400, message: "因为您上传的是多规格产品, 需要上传属性"});
			if(!attributes[0] || !attributes[0].name) return res.json({status: 400, message: "因为您上传的是多规格产品, 需要上传属性"});
			attributes.forEach(item => {
				item.visible = true;
				item.variation = true;
			});
			data.attributes = attributes;
		}

		data.images = new Array();
		images.forEach(img => {
			const image = new Object();
			image.src=process.env.DNS+img
			data.images.push(image)
		})
		data.status = "private";
		const prod = await MdWoo.wooPost_Prom("products", data, crUser.firm);
		images.forEach(img => {
			MdFile.delFile(img)
		})
		if(!prod || !prod.id) return res.json({status: 400, message: "产品创建错误"});

		if(data.type == "variable") {
			const dataAttr = {attributes: [], status: 'publish'};
			dataAttr.regular_price = data.regular_price;
			dataAttr.sale_price = data.sale_price;
			const variation = await MdWoo.wooPost_Prom("products/"+prod.id+"/variations", dataAttr, crUser.firm);
		}
		return res.redirect("/prod/"+prod.id);
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=prodPost &error='+error);
	}
};

exports.prod = async(req, res) => {
	// console.log("/prod")
	try{
		const crUser = req.session.crUser;
		const id = req.params.id;
		const prod = await MdWoo.wooGet_Prom("products/"+id, crUser.firm);

		let errorInfo = "";
		if(req.query.errorInfo) errorInfo = req.query.errorInfo;

		if(!prod || !prod.id) errorInfo += "查无此产品";
		const categories = await MdWoo.wooGet_Prom("products/categories?per_page=100", crUser.firm);
		const variations = await MdWoo.wooGet_Prom("products/"+id+"/variations?per_page=100", crUser.firm);
		// console.log(variations)

		return res.render('./mger/prod/detail', {
			title: '产品: '+prod.name,
			crUser,
			errorInfo,
			prod,
			variations,
			categories
		})
	} catch(error) {
		// console.log(error);
		return res.redirect('/errormger?errorInfo=您没有权限登陆操作界面&error='+error);
	}
};
exports.prodAjax = async(req, res) => {
	// console.log("/prodAjax")
	try{
		const crUser = req.session.crUser;
		const id = req.params.id;
		const prod = await MdWoo.wooGet_Prom("products/"+id, crUser.firm);

		return res.json({status: 200, data: {object: prod}})
	} catch(error) {
		// console.log(error);
		return res.redirect('/errormger?errorInfo=您没有权限登陆操作界面&error='+error);
	}
};

exports.itemAjax = async(req, res) => {
	// console.log("/itemAjax")
	try{
		const crUser = req.session.crUser;
		const pd = parseInt(req.params.pd);
		const vr = parseInt(req.params.vr);

		let object = null;
		if(vr && vr != 0) {
			object = await MdWoo.wooGet_Prom("products/"+pd+"/variations/"+vr, crUser.firm);
		} else {
			object = await MdWoo.wooGet_Prom("products/"+pd, crUser.firm);
		}

		if(!object || !object.id) return res.status(400).json({status: 400, message: '没有找到此产品, 请给客户打电话确认'});
		return res.status(200).json({status: 200, data: {object}})
	} catch(error) {
		console.log(error);
		return res.status(500).json({status: 500, message: "[服务器错误] itemAjax"});
	}
};

exports.prodPut = async(req, res) => {
	// console.log("/prodPut")
	try {
		const crUser = req.session.crUser;

		const id = req.params.id;
		const data = req.body.data;
		if(req.query.variation) {
			const vid = req.query.variation;
			const variation = await MdWoo.wooPut_Prom("products/"+id+"/variations/"+vid, data, "Object", crUser.firm);
			if(!variation || !variation.id) return res.json({status: 400, message: "错误操作"});
		} else {
			const prod = await MdWoo.wooPut_Prom("products/"+id, data, "Object", crUser.firm);
			if(!prod || !prod.id) return res.json({status: 400, message: "操作错误"});
		}
		return res.redirect('/prod/'+id);
	} catch(error) {
		console.log(error);
		return res.json({status: 500, message: "/prodPut error"})
	}
}
exports.prodPut = async(req, res) => {
	try {
		const crUser = req.session.crUser;

		const id = req.params.id;
		let data = req.body.data;
		const type = req.body.type;
		const product = await MdWoo.wooPut_Prom("products/"+id, data, type, crUser.firm);
		if(product && product.id) {
			return res.json({status: 200, product})
		} else {
			return res.json({status: 500, message: "操作错误"})
		}
	} catch(error) {
		console.log(error);
		return res.json({status: 500, message: "/productPutAjax error"})
	}
}
exports.prodPutAjax = async(req, res) => {
	// console.log("/prodPutAjax")
	try {
		const crUser = req.session.crUser;

		const id = req.params.id;
		let data = req.body.data;
		const type = req.body.type;

		let typeChange = 0;
		let regular_price = 0, sale_price =0;
		if(data.type == "variable") {	// 判断 产品从 简单到复杂 需要系统自动 添加sku 及价格
			const prodOrg = await MdWoo.wooGet_Prom("products/"+id, crUser.firm);
			if(prodOrg.type != "variable") {
				typeChange = 1;
				data.regular_price = prodOrg.regular_price;
				data.sale_price = prodOrg.sale_price;
				if(!prodOrg.attributes || prodOrg.attributes.length == 0) {
					return res.json({status: 400, message: "请先添加产品属性"});
				}
			}
		} else if(data.type == "simple") {	// 判断 产品 从复杂到简单 需要把sku中的价格取出 赋值给产品
			const variations = await MdWoo.wooGet_Prom("products/"+id+"/variations", crUser.firm);
			if(variations && variations[0] && variations[0].id) {
				const variation  = variations[0];
				typeChange = 2;

				data.regular_price = variation.regular_price;
				data.sale_price = variation.sale_price;
			}
		}

		const prod = await MdWoo.wooPut_Prom("products/"+id, data, type, crUser.firm);
		if(typeChange == 1) {
			const dataAttr = {attributes: [], status: 'publish'};
			dataAttr.regular_price = data.regular_price;
			dataAttr.sale_price = data.sale_price;
			const variation = await MdWoo.wooPost_Prom("products/"+prod.id+"/variations", dataAttr, crUser.firm);
		}

		if(prod && prod.id) {
			return res.json({status: 200, prod})
		} else {
			return res.json({status: 500, message: "操作错误"})
		}
	} catch(error) {
		console.log(error);
		return res.json({status: 500, message: "/prodPutAjax error"})
	}
}

exports.prodDel = async(req, res) => {
	// console.log("/prod")
	try{
		const crUser = req.session.crUser;
		const id = req.params.id;

		const prod = await MdWoo.wooGet_Prom("products/"+id, crUser.firm);
		if(prod.status == "publish") return res.redirect("/prod/"+id+"?errorInfo=删除时没有找到此产品");
		let images = prod.images;
		if(!images) images = new Array();

		const variations = await MdWoo.wooGet_Prom("products/"+id+"/variations", crUser.firm);
		variations.forEach(variation => {
			images.push(variation.image);
		})

		const delObject = await MdWoo.wooDelete_Prom("products/"+id, crUser.firm);
		if(!delObject || !delObject.id) return res.redirect("/prod/"+id+"?errorInfo=删除失败");

		images.forEach(async(media) => {
			const delMedia = await MdWoo.wooDelete_Prom("media/"+media.id+"?force=true", crUser.firm);
		})

		return res.redirect('/prods')
	} catch(error) {
		console.log(error);
		if(prod.status == "publish") return res.redirect("/prod/"+id+"?errorInfo=删除失败 error="+er);
	}
};







exports.prodDelImage = async(req, res) => {
	// console.log("/prodDelImage")
	try{
		const crUser = req.session.crUser;
		const id = req.params.id;

		const prod_id = req.query.prod_id;

		console.log(id)
		const media = await MdWoo.wooDelete_Prom("media/"+id+"?force=true", crUser.firm);
		console.log(media)
		return res.redirect("/prod/"+prod_id)
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=prodDelImage&error='+error);
	}
}

exports.prodPutImages = async(req, res) => {
	// console.log("/prodPutImages")
	try{
		const crUser = req.session.crUser;

		const id = req.body.id;
		let data= req.body.data;
		if(!data) data = new Object();

		const images = req.body.files;
		if(!data.images) data.images = new Array();
		images.forEach(img => {
			const image = new Object();
			image.src=process.env.DNS+img
			data.images.push(image)
		})
		data.status = "private";
		const prod = await MdWoo.wooPut_Prom("products/"+id, data, "String", crUser.firm);

		images.forEach(img => {MdFile.delFile(img) }); // 刪除本地服务器的图片

		if(prod && prod.id) {
			return res.redirect("/prod/"+id);
		} else {
			console.log(prod)
			return res.redirect('/mger?errorInfo=prodPutImages 更新错误');
		}
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=prodPutImages &error='+error);
	}
};



exports.prodPutAttributes = async(req, res) => {
	// console.log("/prodPutAttributes")
	try{
		const crUser = req.session.crUser;

		const id = req.body.id;
		const attrs= req.body.attrs;
		const data = new Object();
		data.attributes = new Array();
		let i = 0;
		for(; i<attrs.length; i++) {
			const attr = attrs[i];

			if(!attr.name || !attr.options) continue;

			const attribute = new Object();
			attribute.visible = true;
			attribute.variation = true;
			attribute.name = String(attr.name).toUpperCase();
			attribute.options = new Array();
			const options = String(attr.options).toUpperCase().split("|");
			options.forEach(option => {
				attribute.options.push(option.replace(/^\s*/g,""));
			})

			data.attributes.push(attribute);
		}
		if(!data.attributes || data.attributes.length == 0) return res.json({status: 400, message: "产品属性不可为空"});

		const prod = await MdWoo.wooPut_Prom("products/"+id, data, "String", crUser.firm);

		if(prod && prod.id) {
			return res.redirect("/prod/"+id);
		} else {
			console.log(prod);
			return res.redirect('/mger?errorInfo=prodPutAttributes 更新错误');
		}
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=prodPutAttributes &error='+error);
	}
};