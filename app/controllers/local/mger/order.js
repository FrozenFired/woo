const MdWoo = require('../../../middle/woo/middleWoo');
const Conf = require('../../../config/conf');

exports.orders = async(req, res) => {
	// console.log("/orders")
	try{
		const crUser = req.session.crUser;
		let url = "orders?";
		let errorInfo = null;

		if(req.query.status) {
			if(Conf.order.status.arr.includes(req.query.status)) {
				url += "&status="+req.query.status;
			} else {
				errorInfo = "订单状态参数错误"
			}
		}
		url += '&per_page=100'
		const orders = await MdWoo.wooGet_Prom(url, crUser.firm);
		return res.render('./mger/order/list', {
			title: '订单列表',
			crUser,
			errorInfo,
			orders,
		})
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=您没有权限登陆操作界面&error='+error);
	}
};

exports.order = async(req, res) => {
	// console.log("/order")
	try{
		const crUser = req.session.crUser;
		let errorInfo = null;

		const id = req.params.id;
		const order = await MdWoo.wooGet_Prom("orders/"+id, crUser.firm);
		if(!order || !order.id) errorInfo = "查无此订单";

		const customer = await MdWoo.wooGet_Prom("customers/"+order.customer_id, crUser.firm);
		// console.log(customer)
		return res.render('./mger/order/detail', {
			title: '订单: '+order.number,
			crUser,
			order,
			customer
		})
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=您没有权限登陆操作界面&error='+error);
	}
};

exports.orderPutAjax = async(req, res) => {
	try {
		const crUser = req.session.crUser;

		const id = req.params.id;
		const data = req.body.data;
		const type = req.body.type;
		let order = null;
		if(data.status && data.status == "trash") {
			order = await MdWoo.wooDelete_Prom("orders/"+id, crUser.firm);
		} else {
			order = await MdWoo.wooPut_Prom("orders/"+id, data, type, crUser.firm);
		}
		if(!order && !order.id) return res.json({status: 500, message: "操作错误"});
		return res.json({status: 200, order});
	} catch(error) {
		console.log(error);
		return res.json({status: 500, message: "/orderPutAjax error"})
	}
}


exports.orderDelAjax = async(req, res) => {
	try {
		const crUser = req.session.crUser;
		const id = req.params.id;
		const order = await MdWoo.wooDelete_Prom("orders/"+id+"?force=true", crUser.firm);
		if(!order || !order.id) return res.json({status: 500, message: "orderDelAjax 订单删除失败"});
		return res.json({status: 200, order})
	} catch(error) {
		console.log(error);
		return res.json({status: 500, message: "/variationDelAjax error"})
	}
}











exports.payments = async(req, res) => {
	// console.log("/payments")
	try{
		const crUser = req.session.crUser;
		let url = "payment_gateways?";
		let errorInfo = null;
		if(req.query.errorInfo) errorInfo = req.query.errorInfo;

		const payments = await MdWoo.wooGet_Prom(url, crUser.firm);
		return res.render('./mger/order/payment_gateways', {
			title: '付款方式列表',
			crUser,
			errorInfo,
			payments,
		})
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=您没有权限登陆操作界面&error='+error);
	}
};