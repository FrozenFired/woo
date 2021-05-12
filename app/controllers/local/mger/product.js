const MdWoo = require('../../../middle/woo/middleWoo');
const MdFile = require('../../../middle/local/middleFile');

exports.products = async(req, res) => {
	// console.log("/products")
	try{
		const crUser = req.session.crUser;
		const products = await MdWoo.wooGet_Prom("products");
		const media = await MdWoo.wooGet_Prom("media");
		return res.render('./mger/product/list', {
			title: '产品列表',
			crUser,
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
		const variations = await MdWoo.wooGet_Prom("products/"+req.params.id+"/variations");
		// console.log(variations[0])

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
		if(product.status == "publish") return res.redirect('/?info=请先下架 再删除');
		const images = product.images;
		const delObject = await MdWoo.wooDelete_Prom("products/"+id);
		images.forEach(async(media) => {
			const delMedia = await MdWoo.wooDelete_Prom("media/"+media.id+"?force=true");
		})

		return res.redirect('/products')
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=您没有权限登陆操作界面&error='+error);
	}
};








exports.mediasAjax = async(req, res) => {
	
}
exports.mediaDel = async(req, res) => {
	// console.log("/media")
	try{
		const crUser = req.session.crUser;
		const id = req.params.id;

		const productId = req.query.product;

		// console.log(id)
		const media = await MdWoo.wooDelete_Prom("media/"+id+"?force=true");
		// console.log(media)
		return res.redirect('/product/'+productId)
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=您没有权限登陆操作界面&error='+error);
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
			data.images.unshift(image)
		})
		data.status = "private";
		
		console.log(data)
		console.log(images)
		const product = await MdWoo.wooPut_Prom("products/"+id, {images}, "String");

		// images.forEach(img => {
		// 	MdFile.delFile(img)
		// })

		if(product && product.id) {
			return res.redirect('/product/'+id);
		} else {
			console.log(product)
			return res.redirect('/productPutImages 更新错误');
		}
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=productPutImages &error='+error);
	}
};