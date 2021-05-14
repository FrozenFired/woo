const MdWoo = require('../../../middle/woo/middleWoo');
exports.categories = async(req, res) => {
	try{
		const crUser = req.session.crUser;

		const url = "products"+req.url;
		const categories = await MdWoo.wooGet_Prom(url, crUser.firm);
		return res.render('./mger/category/list', {
			title: '产品分类',
			crUser,
			categories,
		})
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=您没有权限登陆操作界面&error='+error)
	}
};

exports.category = async(req, res) => {
	// console.log("/category")
	try{
		const crUser = req.session.crUser;

		const url = "products"+req.url;
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
		return res.redirect('/?info=您没有权限登陆操作界面&error='+error);
	}
};

exports.categoryPutAjax = async(req, res) => {
	try {
		const category = req.result;
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