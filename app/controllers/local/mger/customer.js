const Category = require('./category.js');
const MdWoo = require('../../../middle/woo/middleWoo');

exports.customers = async(req, res) => {
	// console.log("/customers")
	try{
		const crUser = req.session.crUser;

		const url = "customers";
		const customers = await MdWoo.wooGet_Prom(url, crUser.firm);
		// console.log(customers[0])

		return res.render('./mger/customer/list', {
			title: '产品列表',
			crUser,
			customers,
		})
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=您没有权限登陆操作界面&error='+error);
	}
};
exports.customer = async(req, res) => {
	// console.log("/customer")
	try{
		const crUser = req.session.crUser;

		const id = req.params.id;
		const url = "customers/"+id;
		const customer = await MdWoo.wooGet_Prom(url, crUser.firm);
		let errorInfo = null;
		if(!customer || !customer.id) {
			errorInfo = "查无此产品";
		}
		return res.render('./mger/customer/detail', {
			title: '产品: '+customer.name,
			crUser,
			customer,
		})
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=您没有权限登陆操作界面&error='+error);
	}
};

exports.customerPutAjax = async(req, res) => {
	try {
		const crUser = req.session.crUser;

		const id = req.params.id;
		const url = "customers/"+id;
		const data = req.body.data;
		const type = req.body.type;
		const customer = await MdWoo.wooPut_Prom(url, data, type, crUser.firm);
		if(customer && customer.id) {
			return res.json({status: 200, customer})
		} else {
			return res.json({status: 500, message: "操作错误"})
		}
	} catch(error) {
		console.log(error);
		return res.json({status: 500, message: "/customerPutAjax error"})
	}
}