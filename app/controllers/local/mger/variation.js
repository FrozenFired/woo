const MdWoo = require('../../../middle/woo/middleWoo');
const MdFile = require('../../../middle/local/middleFile');

exports.variation = async(req, res) => {
	console.log("/variation")
	try{
		const crUser = req.session.crUser;
		let errorInfo = "";
		if(req.query.errorInfo) errorInfo = req.query.errorInfo;
		const id = req.params.id;
		const product_id = req.query.product_id;
		const variation = await MdWoo.wooGet_Prom("products/"+product_id+"/variations/"+id, crUser.firm);
		if(!variation || !variation.id) errorInfo="variation 没有找到此SKU";
		const product = await MdWoo.wooGet_Prom("products/"+product_id, crUser.firm);
		if(!product || !product.id) errorInfo = "variation 没有找到对应的产品";

		return res.render('./mger/variation/detail', {
			title: '产品sku: #'+variation.id,
			crUser,
			errorInfo,

			variation,
			product,
		})
	} catch(error) {
		// console.log(error);
		return res.redirect('/errormger?errorInfo=variation &error='+error);
	}
};

exports.variationPost = async(req, res) => {
	// console.log("/variationPost")
	try{
		const crUser = req.session.crUser;

		let image = null;
		if(req.body.files) {
			image = req.body.files[0];
		}
		const product_id= req.body.product_id;
		const data = req.body.data;
		data.image = new Object();
		if(image) {
			data.image.src = process.env.DNS + image;
		} else {
			const product =  await MdWoo.wooGet_Prom("products/"+product_id, crUser.firm);
			if(product && product.images) {
				data.image.src = product.images[0].src;
			}
		}
		data.status = "publish";
		const variation = await MdWoo.wooPost_Prom("products/"+product_id+"/variations", data, crUser.firm);
		if(image) MdFile.delFile(image);
		if(variation && variation.id) return res.redirect("/product/"+product_id);
		return res.redirect('/mger?errorInfo=variationPost 创建错误');
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=variationPost &error='+error);
	}
};

exports.variationPutAjax = async(req, res) => {
	try {
		const crUser = req.session.crUser;

		const id = req.params.id;
		const product_id = req.query.product_id;
		let data = req.body.data;
		const type = req.body.type;
		const variation = await MdWoo.wooPut_Prom("products/"+product_id+"/variations/"+id, data, type, crUser.firm);
		if(variation && variation.id) {
			return res.json({status: 200, variation})
		} else {
			return res.json({status: 500, message: "操作错误"})
		}
	} catch(error) {
		console.log(error);
		return res.json({status: 500, message: "/variationPutAjax error"})
	}
}

exports.variationDelAjax = async(req, res) => {
	try {
		const crUser = req.session.crUser;

		const id = req.params.id;
		const product_id = req.query.product_id;
		const product =  await MdWoo.wooGet_Prom("products/"+product_id, crUser.firm);
		if(!product || !product.id) return res.json({status: 500, message: "variationDel相应产品不存在"});
		if(product.status == "publish") return res.json({status: 500, message: "variationDel 请先下架产品再删除 SKU"});

		const variation = await MdWoo.wooDelete_Prom("products/"+product_id+"/variations/"+id, crUser.firm);
		if(!variation || !variation.id) return res.json({status: 500, message: "variationDelAjax 删除SKU失败"});
		const image = variation.image;
		let images = product.images;
		if(!images) images = new Array();

		if(image) {
			let i = 0;
			for(; i < images.length; i++) {
				if(image.id == images[i].id) break;
			}
			if(i == images.length) {
				const delMedia = await MdWoo.wooDelete_Prom("media/"+image.id+"?force=true", crUser.firm);
			}
		}

		return res.json({status: 200, variation})
	} catch(error) {
		console.log(error);
		return res.json({status: 500, message: "/variationDelAjax error"})
	}
}





exports.variationPutImages = async(req, res) => {
	// console.log("/variationPutImages")
	try{
		const crUser = req.session.crUser;

		let image = null;
		if(req.body.files) {
			image = req.body.files[0];
		}
		if(!image) return res.redirect('/mger?errorInfo=variationPutImages 请上传图片'); 

		const data = new Object();
		data.image = new Object();
		data.image.src = process.env.DNS+image;

		const id = req.body.id;
		const product_id = req.body.product_id;

		const product = await MdWoo.wooGet_Prom("products/"+product_id, crUser.firm);
		if(!product || !product.id) return res.redirect('/mger?errorInfo=variationPutImages 没有找到此产品');
		const org = await MdWoo.wooGet_Prom("products/"+product_id+"/variations/"+id, crUser.firm);
		if(!org || !org.id) return res.redirect('/mger?errorInfo=variationPutImages 没有找到此产品SKU');
		const media = org.image;
		let images = product.images;
		if(!images) images = new Array();
		if(media) {
			let i = 0;
			for(; i < images.length; i++) {
				if(media.id == images[i].id) break;
			}
			if(i == images.length) {
				const delMedia = await MdWoo.wooDelete_Prom("media/"+media.id+"?force=true", crUser.firm);
			}
		}
		const variation = await MdWoo.wooPut_Prom("products/"+product_id+"/variations/"+id, data, "String", crUser.firm);

		if(image) MdFile.delFile(image);
		if(!variation || !variation.id) return res.redirect("/variation/"+id+"?product_id="+product_id+"&errorInfo=variationPutImages 图片更新错误");

		return res.redirect("/variation/"+id+"?product_id="+product._id);
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=variationPutImages &error='+error);
	}
};