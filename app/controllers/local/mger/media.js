const MdWoo = require('../../../middle/woo/middleWoo');

exports.medias = async(req, res) => {
	try{
		const crUser = req.session.crUser;

		const medias = await MdWoo.wooGet_Prom("media", crUser.firm);
		return res.render('./mger/media/list', {
			title: '文件',
			crUser,
			medias,
		})
	} catch(error) {
		console.log(error);
		return res.redirect('/mger?errorInfo=您没有权限登陆操作界面&error='+error);
	}
};
