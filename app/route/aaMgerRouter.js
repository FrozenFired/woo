const Mger = require('../controllers/local/mger/mger');
const Product = require('../controllers/local/mger/product');
const Prod = require('../controllers/local/mger/prod');
const Variation = require('../controllers/local/mger/variation');
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
	app.get('/productDelImage/:id', MdRole.mgerIsLogin, Product.productDelImage)
	/* -------------------------------- Attr -------------------------------- */
	app.post('/productPutAttributes', MdRole.mgerIsLogin, Product.productPutAttributes)
	/* =================================== Variation =================================== */
	app.get('/variation/:id', MdRole.mgerIsLogin, Variation.variation)
	app.post('/variationPost', MdRole.mgerIsLogin, postForm, MdFile.newFiles, Variation.variationPost)
	app.put('/variationPut/:id', MdRole.mgerIsLogin, Variation.variationPutAjax)
	app.delete('/variationDel/:id', MdRole.mgerIsLogin, Variation.variationDelAjax)
	/* -------------------------------- Media -------------------------------- */
	app.post('/variationPutImages', MdRole.mgerIsLogin, postForm, MdFile.newFiles, Variation.variationPutImages)

	/* =================================== Prod =================================== */
	app.get('/prodAdd', MdRole.mgerIsLogin, Prod.prodAdd)
	app.post('/prodPost', MdRole.mgerIsLogin, postForm, MdFile.newFiles, Prod.prodPost)
	app.get('/prods', MdRole.mgerIsLogin, Prod.prods)
	app.get('/prod/:id', MdRole.mgerIsLogin, Prod.prod)
	app.get('/itemAjax/:pd/:vr', MdRole.mgerIsLogin, Prod.itemAjax)
	app.get('/prodDel/:id', MdRole.mgerIsLogin, Prod.prodDel)
	app.put('/prodPut/:id', MdRole.mgerIsLogin, Prod.prodPut)
	app.put('/prodPutAjax/:id', MdRole.mgerIsLogin, postForm, Prod.prodPutAjax)
	app.post('/prodPut/:id', MdRole.mgerIsLogin, postForm, Prod.prodPut)
	/* -------------------------------- Media -------------------------------- */
	app.post('/prodPutImages', MdRole.mgerIsLogin, postForm, MdFile.newFiles, Prod.prodPutImages)
	app.get('/prodDelImage/:id', MdRole.mgerIsLogin, Prod.prodDelImage)
	/* -------------------------------- Attr -------------------------------- */
	app.post('/prodPutAttributes', MdRole.mgerIsLogin, Prod.prodPutAttributes)

	/* =================================== Media =================================== */
	app.get('/medias', MdRole.mgerIsLogin, Media.medias)


	/* =================================== Category =================================== */
	app.get('/categories', MdRole.mgerIsLogin, Category.categories)
	app.get('/category/:id', MdRole.mgerIsLogin, Category.category)
	app.post('/categoryPost', MdRole.mgerIsLogin, postForm, MdFile.newFiles, Category.categoryPost)
	app.put('/categoryPut/:id', MdRole.mgerIsLogin, Category.categoryPutAjax)
	app.delete('/categoryDel/:id', MdRole.mgerIsLogin, Category.categoryDelAjax)

	/* =================================== Customer =================================== */
	app.get('/customers', MdRole.mgerIsLogin, Customer.customers)

	/* =================================== Order =================================== */
	app.get('/orders', MdRole.mgerIsLogin, Order.orders)
	app.get('/order/:id', MdRole.mgerIsLogin, Order.order)
	app.put('/orderPut/:id', MdRole.mgerIsLogin, Order.orderPutAjax)
	app.delete('/orderDel/:id', MdRole.mgerIsLogin, Order.orderDelAjax)
	/* ----------------------- Payment gateways ----------------------- */
	app.get('/payments', MdRole.mgerIsLogin, Order.payments)

};