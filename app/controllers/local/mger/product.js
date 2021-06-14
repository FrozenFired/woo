const MdWoo = require('../../../middle/woo/middleWoo');
const MdFile = require('../../../middle/local/middleFile');
const Conf = require('../../../config/conf');

exports.products = async(req, res) => {
	// console.log("/products")
	try{
		const crUser = req.session.crUser;
		let url = "products?";
		let errorInfo = null;

		if(req.query.search) {
			url += "&search="+req.query.search;
		}
		if(req.query.status) {
			if(Conf.product.status.arr.includes(req.query.status)) {
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
			if(Conf.product.type.arr.includes(req.query.type)) {
				url += "&type="+req.query.type;
			} else {
				errorInfo = "产品类型参数错误"
			}
		}

		url += "&per_page=100"
		const products = await MdWoo.wooGet_Prom(url, crUser.firm);
		return res.render('./mger/product/list', {
			title: '产品列表',
			crUser,
			errorInfo,
			products,
		})
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=您没有权限登陆操作界面&error='+error);
	}
};

exports.productAdd = async(req, res) => {
	// console.log("/products")
	try{
		const crUser = req.session.crUser;

		const categories = await MdWoo.wooGet_Prom("products/categories", crUser.firm);
		return res.render('./mger/product/add', {
			title: '新产品',
			crUser,
			categories
		})
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=您没有权限登陆操作界面&error='+error);
	}
};

exports.productPost = async(req, res) => {
	// console.log("/productPost")
	try{
		const crUser = req.session.crUser;
		const images = req.body.files;
		const data= req.body.data;
		data.images = new Array();
		images.forEach(img => {
			const image = new Object();
			image.src=process.env.DNS+img
			data.images.push(image)
		})
		data.status = "private";
		const product = await MdWoo.wooPost_Prom("products", data, crUser.firm);
		images.forEach(img => {
			MdFile.delFile(img)
		})
		if(product && product.id) return res.redirect("/products")
		return res.redirect('/mger?errorInfo=productPost 创建错误');
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=productPost &error='+error);
	}
};

exports.product = async(req, res) => {
	// console.log("/product")
	try{
		const crUser = req.session.crUser;
		const id = req.params.id;
		const product = await MdWoo.wooGet_Prom("products/"+id, crUser.firm);

		let errorInfo = "";
		if(req.query.errorInfo) errorInfo = req.query.errorInfo;

		if(!product || !product.id) errorInfo += "查无此产品";
		const categories = await MdWoo.wooGet_Prom("products/categories?per_page=100", crUser.firm);
		const variations = await MdWoo.wooGet_Prom("products/"+id+"/variations?per_page=100", crUser.firm);
		// console.log(variations)

		return res.render('./mger/product/detail', {
			title: '产品: '+product.name,
			crUser,
			errorInfo,
			product,
			variations,
			categories
		})
	} catch(error) {
		// console.log(error);
		return res.redirect('/errormger?errorInfo=您没有权限登陆操作界面&error='+error);
	}
};
exports.productPutAjax = async(req, res) => {
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

exports.productDel = async(req, res) => {
	// console.log("/product")
	try{
		const crUser = req.session.crUser;
		const id = req.params.id;

		const product = await MdWoo.wooGet_Prom("products/"+id, crUser.firm);
		if(product.status == "publish") return res.redirect("/product/"+id+"?errorInfo=删除时没有找到此产品");
		let images = product.images;
		if(!images) images = new Array();

		const variations = await MdWoo.wooGet_Prom("products/"+id+"/variations", crUser.firm);
		variations.forEach(variation => {
			images.push(variation.image);
		})

		const delObject = await MdWoo.wooDelete_Prom("products/"+id, crUser.firm);
		if(!delObject || !delObject.id) return res.redirect("/product/"+id+"?errorInfo=删除失败");

		images.forEach(async(media) => {
			const delMedia = await MdWoo.wooDelete_Prom("media/"+media.id+"?force=true", crUser.firm);
		})

		return res.redirect('/products')
	} catch(error) {
		console.log(error);
		if(product.status == "publish") return res.redirect("/product/"+id+"?errorInfo=删除失败 error="+er);
	}
};







exports.productDelImage = async(req, res) => {
	// console.log("/productDelImage")
	try{
		const crUser = req.session.crUser;
		const id = req.params.id;

		const product_id = req.query.product_id;

		console.log(id)
		const media = await MdWoo.wooDelete_Prom("media/"+id+"?force=true", crUser.firm);
		console.log(media)
		return res.redirect("/product/"+product_id)
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=productDelImage&error='+error);
	}
}

exports.productPutImages = async(req, res) => {
	// console.log("/productPutImages")
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
			console.log(image)
		})
		data.status = "private";
		
		const product = await MdWoo.wooPut_Prom("products/"+id, data, "String", crUser.firm);

		images.forEach(img => {MdFile.delFile(img) }); // 刪除本地服务器的图片

		if(product && product.id) {
			return res.redirect("/product/"+id);
		} else {
			console.log(product)
			return res.redirect('/mger?errorInfo=productPutImages 更新错误');
		}
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=productPutImages &error='+error);
	}
};



exports.productPutAttributes = async(req, res) => {
	console.log("/productPutAttributes")
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

		const product = await MdWoo.wooPut_Prom("products/"+id, data, "String", crUser.firm);

		if(product && product.id) {
			return res.redirect("/product/"+id);
		} else {
			console.log(product);
			return res.redirect('/mger?errorInfo=productPutAttributes 更新错误');
		}
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=productPutAttributes &error='+error);
	}
};