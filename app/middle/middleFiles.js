const Conf = require('../config/conf.js');

const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

exports.rmPicture = (oldfliepath) => {
	if(oldfliepath) {
		fs.unlink(path.join(__dirname, '../../public' + oldfliepath), (err) => {
			if(err) {
				console.log(err);
				console.log('更新图片的时候, 可能会错误')
			}
		});
	}
}

exports.mkPicture = async(req, res, next) => {
	console.log("/mkPicture")

	const crUser = req.user;
	const defaultSrc = path.join(__dirname, '../../public/wooUpload');	// niu/public/wooUpload/***/
	const form = formidable({ multiples: true, wooUploadDir: defaultSrc});
	form.parse(req, (err, fields, files) => {
		if (err) return res.json({status: 500, message: 'mkPicture form parse error'});

		// 接受 body信息
		const obj = {};
		if(fields.obj) {
			const kvs = fields.obj.split("&");
			for(i=0; i<kvs.length; i++) {
				const key = kvs[i].split("=")[0];
				const val = kvs[i].split("=")[1];
				obj[key] = val;
			}
		}

		if(files.logo && files.logo.path) {
			const file = files.logo
			const oldfliepath = file.path;
			// 接收 图片的路由信息 以便分类存储图片， 如果路由信息不存在, 则放入默认文件夹
			const pubSrc = path.join(__dirname, '../../public');	// niu/public/wooUpload/***/
			const pic = "/wooUpload/brand/logo/" + crUser.firm + '-brand-logo-' + Date.now() + '.' + file.type.split('/')[1];
			const newfilepath = pubSrc + pic;

			fs.rename(oldfliepath, newfilepath, err => {
				if(err) return res.json({status: 500, message: 'mkPicture error'});
				obj.logo = pic;
				req.obj = obj;
				next();
			})
		} else {
			req.obj = obj;
			next();
		}
	})
}
// for(i in files) {
// 	console.log(2)
// 	console.log(i)
// 	const file = files[i];

// 	if(file && file.path && picDir) {
// 		const filePath = file.path;		// 图片的位置
// 		// console.log(filePath); console.log(fileType);
// 		// if(obj && obj.photoOld){
// 		// 	MiddlePicture.deletePicture(obj.photoOld, picDir);
// 		// }
		
// 		const picture = picSrc + crUser.firm + '-' + i + Date.now() + '.' + file.type.split('/')[1];
// 		const fileData = await fs.readFile(filePath);
		
// 		await fs.writeFile(picture, fileData);
// 		obj.photo = '/wooUpload'+picDir+picNome;
// 	}
// }