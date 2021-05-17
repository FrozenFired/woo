const MdWoo = require('../../../middle/woo/middleWoo');
exports.categories = async(req, res) => {
	try{
		const crUser = req.session.crUser;
		let errorInfo = "";
		if(req.query.errorInfo) errorInfo = req.query.errorInfo;

		const url = "products"+req.url;
		const categories = await MdWoo.wooGet_Prom(url, crUser.firm);
		return res.render('./mger/category/list', {
			title: '产品分类',
			crUser,
			errorInfo,
			categories,
		})
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=您没有权限登陆操作界面&error='+error)
	}
};

exports.category = async(req, res) => {
	// console.log("/category")
	try{
		const crUser = req.session.crUser;
		const id = req.params.id;

		// const url = "products"+req.url;
		const url = "products/categories/"+id
		const category = await MdWoo.wooGet_Prom(url, crUser.firm);
		let errorInfo = null;
		if(!category || !category.id) {
			errorInfo = "查无此分类";
		}
		return res.render('./mger/category/detail', {
			title: '产品分类: '+category.name,
			crUser,
			category,
		})
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=您没有权限登陆操作界面&error='+error);
	}
};



exports.categoryPost = async(req, res) => {
	// console.log("/productPost")
	try{
		const crUser = req.session.crUser;
		const data= req.body.data;
		let image = null;
		if(req.body.files) {
			image = req.body.files[0];
		}
		if(image) {
			data.image = new Object();
			data.image.src = process.env.DNS + image;
		}
		const category = await MdWoo.wooPost_Prom("products/categories", data, crUser.firm);
		if(image) MdFile.delFile(image);
		if(!category || !category.id) return res.redirect('/categories?errorInfo=categoryPost 创建错误');
		return res.redirect("/categories");		
	} catch(error) {
		console.log(error);
		return res.redirect('/categories?errorInfo=categoryPost &error='+error);
	}
}

exports.categoryPutAjax = async(req, res) => {
	// console.log("/categoryPutAjax")
	try {
		const crUser = req.session.crUser;

		const id = req.params.id;
		let data = req.body.data;
		const type = req.body.type;
		const category = await MdWoo.wooPut_Prom("products/categories/"+id, data, type, crUser.firm);
		if(category && category.id) {
			return res.json({status: 200, category})
		} else {
			return res.json({status: 500, message: "操作错误"})
		}
	} catch(error) {
		console.log(error);
		return res.json({status: 500, message: "/categoryPutAjax error"})
	}
}

exports.categoryDelAjax = async(req, res) => {
	try {
		const crUser = req.session.crUser;

		const id = req.params.id;
		const category = await MdWoo.wooDelete_Prom("products/categories/"+id+"?force=true", crUser.firm);
		const image = category.image;
		if(!category || !category.id) return res.json({status: 500, message: "categoryDelAjax 删除SKU失败"});
		if(image && image.id) {
			const delMedia = await MdWoo.wooDelete_Prom("media/"+image.id+"?force=true", crUser.firm);
		}

		return res.json({status: 200, category})
	} catch(error) {
		console.log(error);
		return res.json({status: 500, message: "/variationDelAjax error"})
	}
}