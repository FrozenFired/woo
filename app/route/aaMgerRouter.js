const Mger = require('../controllers/local/mger/mger');
const Product = require('../controllers/local/mger/product');
const Category = require('../controllers/local/mger/category');
const Customer = require('../controllers/local/mger/customer');
const Order = require('../controllers/local/mger/order');
const Media = require('../controllers/local/mger/media');
const User = require('../controllers/local/mger/user');

const MdRole = require('../middle/local/middleRole');
const MdFile = require('../middle/local/middleFile');

const postForm = require('connect-multiparty')();

module.exports = function(app){
	app.get('/', Mger.index);
	app.post('/loginUser', Mger.loginUser);
	app.get('/logout', Mger.logout);

	app.get('/mger', MdRole.mgerIsLogin, Mger.mger);

	/* =================================== User =================================== */
	app.get('/users', MdRole.mgerIsLogin, User.users)
	app.post('/userNew', MdRole.mgerIsLogin, User.userNew)
	app.get('/user/:userId', MdRole.mgerIsLogin, User.user)
	app.get('/userDel/:userId', MdRole.mgerIsLogin, User.userDel)

	app.post('/userUpdInfo', MdRole.mgerIsLogin, User.userUpd)
	app.post('/userUpdPwd', MdRole.mgerIsLogin, User.userUpd)

	/* =================================== Product =================================== */
	app.get('/productAdd', MdRole.mgerIsLogin, Product.productAdd)
	app.post('/productPost', MdRole.mgerIsLogin, postForm, MdFile.newFiles, Product.productPost)
	app.get('/products', MdRole.mgerIsLogin, Product.products)
	app.get('/product/:id', MdRole.mgerIsLogin, Product.product)
	app.get('/productDel/:id', MdRole.mgerIsLogin, Product.productDel)
	app.put('/productPut/:id', MdRole.mgerIsLogin, Product.productPutAjax)
	/* -------------------------------- Media -------------------------------- */
	app.post('/productPutImages', MdRole.mgerIsLogin, postForm, MdFile.newFiles, Product.productPutImages)
	app.get('/mediaDel/:id', MdRole.mgerIsLogin, Product.mediaDel)

	app.get('/mediasAjax', MdRole.mgerIsLogin, Product.mediasAjax)
	app.get('/medias', MdRole.mgerIsLogin, Media.medias)


	/* =================================== Category =================================== */
	app.get('/categories', MdRole.mgerIsLogin, Category.categories)
	app.get('/categories/:id', MdRole.mgerIsLogin, Category.category)

	/* =================================== Customer =================================== */
	app.get('/customers', MdRole.mgerIsLogin, Customer.customers)

	/* =================================== Order =================================== */
	app.get('/orders', MdRole.mgerIsLogin, Order.orders)
	app.get('/orders/:id', MdRole.mgerIsLogin, Order.order)
	app.put('/orderPut/:id', MdRole.mgerIsLogin, Order.orderPutAjax)
};