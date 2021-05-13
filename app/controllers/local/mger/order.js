const MdWoo = require('../../../middle/woo/middleWoo');
const Conf = require('../../../config/conf');

exports.orders = async(req, res) => {
	// console.log("/orders")
	try{
		let url = "orders?";
		let errorInfo = null;

		if(req.query.status) {
			if(Conf.order.status.arr.includes(req.query.status)) {
				url += "&status="+req.query.status;
			} else {
				errorInfo = "订单状态参数错误"
			}
		}

		const crUser = req.session.crUser;
		const orders = await MdWoo.wooGet_Prom(url);
		return res.render('./mger/order/list', {
			title: '订单列表',
			crUser,
			errorInfo,
			orders,
		})
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=您没有权限登陆操作界面&error='+error);
	}
};

exports.order = async(req, res) => {
	// console.log("/order")
	try{
		const crUser = req.session.crUser;
		const id = req.params.id;
		const order = await MdWoo.wooGet_Prom("orders/"+id);

		let errorInfo = null;
		if(!order || !order.id) {
			errorInfo = "查无此订单";
		}
		return res.render('./mger/order/detail', {
			title: '订单: '+order.number,
			crUser,
			order,
		})
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=您没有权限登陆操作界面&error='+error);
	}
};

exports.orderPutAjax = async(req, res) => {
	try {
		const id = req.params.id;
		const data = req.body.data;
		const type = req.body.type;
		const order = await MdWoo.wooPut_Prom("orders/"+id, data, type);
		if(order && order.id) {
			return res.json({status: 200, order})
		} else {
			return res.json({status: 500, message: "操作错误"})
		}
	} catch(error) {
		console.log(error);
		return res.json({status: 500, message: "/orderPutAjax error"})
	}
}