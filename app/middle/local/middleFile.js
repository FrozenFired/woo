const fs = require('fs');
const path = require('path');

exports.delFile = (picDel) => {
	try{
		fs.unlink(path.join(__dirname, '../../../public' + picDel), (err) => {});
	} catch(error) {
		// console.log("MdFile delFile Error: " + error);
	}
}

exports.newFiles = async(req, res, next) => {
	// console.log("MdFile newFiles");
	try {
		const dataFls = req.files.fls;	// 图片数据
		const files = new Array();
		if(dataFls instanceof Array) {
			let iFile = 0;
			for(let i=0;  i<dataFls.length; i++) {
				iFile++;
				if(iFile == 6) break;
				const fl = dataFls[i];
				if(fl && fl.originalFilename) {
					const file = await recuPics(fl, i);
					files.push(file);
				}
			}
		} else {
			const fl = dataFls;
			if(fl && fl.originalFilename) {
				const file = await recuPics(fl, 0);
				files.push(file);
			}
		}
		req.body.files = files;
		return next();
	} catch(error) {
		return res.redirect("/?info=MdFile, newFiles, Error&error="+error);
	}
}

const recuPics = (fl, fgName) => {
	// console.log(`fgName: ${fgName}`)
	return new Promise((resolve, reject) => {
		try {
			const flPath = fl.path;		// 图片的位置
			fs.readFile(flPath, (err, data) => {
				const type = fl.type.split('/')[1];		// 图片类型
				const photoName = Date.now() + '_' + fgName + '.' + type;	// 图片名称 code_2340.jpg
				const photoSrc = path.join(__dirname, '../../../public/wooUpload/');	// niu/public/wooUpload/***/
				const photo = photoSrc + photoName;
				// console.log(photo)
				fs.writeFile(photo, data, (err) => {
					resolve('/wooUpload/'+photoName);
				});
			});
		} catch(error) {
			reject(error);
		}
	})
}