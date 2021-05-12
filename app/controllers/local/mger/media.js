const MdWoo = require('../../../middle/woo/middleWoo');

exports.medias = async(req, res) => {
	try{
		const crUser = req.session.crUser;

		const medias = await MdWoo.wooGet_Prom("media");
		return res.render('./mger/media/list', {
			title: '文件',
			crUser,
			medias,
		})
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=您没有权限登陆操作界面&error='+error);
	}
};

exports.media = async(req, res) => {
	// console.log("/media")
	try{
		const crUser = req.session.crUser;
		const id = req.params.id;

		const media = await MdWoo.wooGet_Prom("media/"+id);
		let errorInfo = null;
		if(!media || !media.id) {
			errorInfo = "查无此文件";
		}
		return res.render('./mger/media/detail', {
			title: '文件: '+media.slug,
			crUser,
			media,
		})
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=您没有权限登陆操作界面&error='+error);
	}
};

exports.mediaDel = async(req, res) => {
	// console.log("/media")
	try{
		const crUser = req.session.crUser;
		const id = req.params.id;

		console.log(id)
		const media = await MdWoo.wooDelete_Prom("media/"+id+"?force=true");
		console.log(media)
		return res.redirect('/medias')
	} catch(error) {
		console.log(error);
		return res.redirect('/?info=您没有权限登陆操作界面&error='+error);
	}
};

exports.mediaPutAjax = async(req, res) => {
	try {
		const media = req.result;
		if(media && media.id) {
			return res.json({status: 200, media})
		} else {
			return res.json({status: 500, message: "操作错误"})
		}
	} catch(error) {
		console.log(error);
		return res.json({status: 500, message: "/mediaPutAjax error"})
	}
}