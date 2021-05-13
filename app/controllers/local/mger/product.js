const MdWoo = require('../../../middle/woo/middleWoo');
const MdFile = require('../../../middle/local/middleFile');
const Conf = require('../../../config/conf');

exports.products = async(req, res) => {
	// console.log("/products")
	try{
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

		const crUser = req.session.crUser;
		const products = await MdWoo.wooGet_Prom(url);
		return res.render('./mger/product/list', {
			title: '产品列表',
			crUser,
			errorInfo,
			products,
		})
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=您没有权限登陆操作界面&error='+error);
	}
};

exports.productAdd = async(req, res) => {
	// console.log("/products")
	try{
		const crUser = req.session.crUser;

		const categories = await MdWoo.wooGet_Prom("products/categories");
		return res.render('./mger/product/add', {
			title: '新产品',
			crUser,
			categories
		})
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=您没有权限登陆操作界面&error='+error);
	}
};

exports.productPost = async(req, res) => {
	// console.log("/productPost")
	try{
		const images = req.body.files;
		const data= req.body.data;
		data.images = new Array();
		images.forEach(img => {
			const image = new Object();
			image.src=process.env.DNS+img
			data.images.push(image)
		})
		data.status = "private";
		const product = await MdWoo.wooPost_Prom("products", data);
		images.forEach(img => {
			MdFile.delFile(img)
		})
		if(product && product.id) return res.redirect("/products")
		return res.redirect('/?info=productPost 创建错误');
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=productPost &error='+error);
	}
};

exports.product = async(req, res) => {
	// console.log("/product")
	try{
		const crUser = req.session.crUser;
		const id = req.params.id;
		const product = await MdWoo.wooGet_Prom("products/"+id);

		let errorInfo = null;
		if(!product || !product.id) {
			errorInfo = "查无此产品";
		}
		const categories = await MdWoo.wooGet_Prom("products/categories");
		const variations = await MdWoo.wooGet_Prom("products/"+id+"/variations");
		// console.log(variations)

		return res.render('./mger/product/detail', {
			title: '产品: '+product.name,
			crUser,
			product,
			variations,
			categories
		})
	} catch(error) {
		// console.log(error);
		return res.redirect('/?info=您没有权限登陆操作界面&error='+error);
	}
};
exports.productPutAjax = async(req, res) => {
	try {
		const id = req.params.id;
		let data = req.body.data;
		const type = req.body.type;
		const product = await MdWoo.wooPut_Prom("products/"+id, data, type);
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
		const id = req.params.id;

		const product = await MdWoo.wooGet_Prom("products/"+id);
		if(product.status == "publish") return res.redirect('/?info=productDel 请先下架 再删除');
		let images = product.images;
		if(!images) images = new Array();

		const variations = await MdWoo.wooGet_Prom("products/"+id+"/variations");
		variations.forEach(variation => {
			images.push(variation.image);
		})

		const delObject = await MdWoo.wooDelete_Prom("products/"+id);
		if(!delObject || !delObject.id) return res.redirect("/?info=productDel 产品删除失败");

		images.forEach(async(media) => {
			const delMedia = await MdWoo.wooDelete_Prom("media/"+media.id+"?force=true");
		})

		return res.redirect('/products')
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=您没有权限登陆操作界面&error='+error);
	}
};







exports.productDelImage = async(req, res) => {
	// console.log("/productDelImage")
	try{
		const crUser = req.session.crUser;
		const id = req.params.id;

		const product_id = req.query.product_id;

		// console.log(id)
		const media = await MdWoo.wooDelete_Prom("media/"+id+"?force=true");
		// console.log(media)
		return res.redirect('/product/'+product_id)
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=productDelImage&error='+error);
	}
}

exports.productPutImages = async(req, res) => {
	// console.log("/productPutImages")
	try{
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
		
		const product = await MdWoo.wooPut_Prom("products/"+id, data, "String");

		images.forEach(img => {MdFile.delFile(img) }); // 刪除本地服务器的图片

		if(product && product.id) {
			return res.redirect('/product/'+id);
		} else {
			console.log(product)
			return res.redirect('/?info=productPutImages 更新错误');
		}
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=productPutImages &error='+error);
	}
};



exports.productPutAttributes = async(req, res) => {
	console.log("/productPutAttributes")
	try{
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

		const product = await MdWoo.wooPut_Prom("products/"+id, data, "String");

		if(product && product.id) {
			return res.redirect('/product/'+id);
		} else {
			console.log(product);
			return res.redirect('/?info=productPutAttributes 更新错误');
		}
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=productPutAttributes &error='+error);
	}
};