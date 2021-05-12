const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const colection = 'User';	// 商家使用者
const dbSchema = new Schema({
	firm: {type: ObjectId, ref: 'Firm'},
	stream: {type: ObjectId, ref: 'Stream'},

	code: {type: String, required: true},
	pwd: {type: String, required: true},

	role: Number,

	lang: {type: Number, default: 0},
	photo: String,

	nome: String,
	tel: String,
	addr: String,

	shelf: Number,	// 如果shelf为下架, 则此人上传的数据默认为下架
	logAt: Date,	// 上次登录时间
	refreshToken: String,
	crter: {type: ObjectId, ref: 'User'},
	crtAt: Date,
	updAt: Date,
});
dbSchema.pre('save', function(next) {
	if(this.isNew) {
		this.updAt = this.crtAt = this.logAt = Date.now();
	} else {
		this.updAt = Date.now();
	}
	next();
});
module.exports = mongoose.model(colection, dbSchema);