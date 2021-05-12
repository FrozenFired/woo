const MdWoo = require('../../../middle/woo/middleWoo');
const MdFile = require('../../../middle/local/middleFile');

exports.variation = async(req, res) => {
	// console.log("/variation")
	try{
		const crUser = req.session.crUser;
		const id = req.params.id;
		const productId = req.params.productId;
		const variation = await MdWoo.wooGet_Prom("products/"+productId+"/variations/"+id);
		if(!variation || !variation.id) return res.redirect("/?info=variation 没有找到此SKU");
		const product = await MdWoo.wooGet_Prom("products/"+productId);

		return res.render('./mger/variation/detail', {
			title: '产品sku: #'+variation.id,
			crUser,
			variation,
			product,
		})
	} catch(error) {
		// console.log(error);
		return res.redirect('/?info=variation &error='+error);
	}
};

exports.variationPost = async(req, res) => {
	console.log("/variationPost")
	try{
		let image = null;
		if(req.body.files) {
			image = req.body.files[0];
		}
		const productId= req.body.productId;
		const data= req.body.data;
		if(image) {
			data.image = new Object();
			data.image.src = process.env.DNS + image;
			console.log(image)
		}
		data.status = "publish";
		console.log(data)
		const variation = await MdWoo.wooPost_Prom("products/"+productId+"/variations", data);
		console.log(variation)
		if(image) MdFile.delFile(image);
		if(variation && variation.id) return res.redirect("/product/"+productId);
		return res.redirect('/?info=variationPost 创建错误');
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=variationPost &error='+error);
	}
};

exports.variationPutAjax = async(req, res) => {
	try {
		const id = req.params.id;
		const productId = req.params.productId;
		let data = req.body.data;
		const type = req.body.type;
		const variation = await MdWoo.wooPut_Prom("products/"+productId+"/variations/"+id, data, type);
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


exports.variationDelImage = async(req, res) => {
	// console.log("/variationDelImage")
	try{
		const crUser = req.session.crUser;
		const id = req.params.id;

		const variationId = req.query.variationId;

		// console.log(id)
		const media = await MdWoo.wooDelete_Prom("media/"+id+"?force=true");
		// console.log(media)
		return res.redirect('/variation/'+variationId)
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=variationDelImage &error='+error);
	}
}

exports.variationPutImages = async(req, res) => {
	// console.log("/variationPutImages")
	try{
		const id = req.body.id;
		const productId = req.body.productId;
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
		
		const variation = await MdWoo.wooPut_Prom("products/"+productId+"/variations/"+id, data, "String");

		images.forEach(img => {MdFile.delFile(img) }); // 刪除本地服务器的图片

		if(variation && variation.id) {
			return res.redirect('/variation/'+id);
		} else {
			console.log(variation)
			return res.redirect('/?info=variationPutImages 更新错误');
		}
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=variationPutImages &error='+error);
	}
};