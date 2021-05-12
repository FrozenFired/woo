const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;
const Float = require('mongoose-float').loadType(mongoose, 2);

const colection = 'Firm';
const dbSchema = new Schema({
	categFirm: Number,										// 公司类型
	code: {type: String, required: true},					// 公司编号
	nome: String, 											// 公司名称 比如6B
	nick: String, 											// 公司代称 6B的代称可能是A公司 防止客户公司知道供应商
	note: String, 											// 备注
	country: String,										// 所属国家名称
	resp: String,// 负责人
	addr: String, 
	tel: String,
	email: String,

	shelf: Number,	// 上架 下架
	weight: Number,	// 权重 排序用的

	crtAt: Date,
	updAt: Date,
	crter: {type: ObjectId, ref: 'User'},
	upder: {type: ObjectId, ref: 'User'},
});

dbSchema.pre('save', function(next) {
	if(this.isNew) {
		if(!this.shelf) this.shelf = 0;
		if(!this.weight) this.weight = 0;
		this.updAt = this.crtAt = Date.now();
	} else {
		this.updAt = Date.now();
	}
	next();
})

module.exports = mongoose.model(colection, dbSchema);