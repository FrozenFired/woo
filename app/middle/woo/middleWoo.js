const WooCommerceAPI = require('woocommerce-api');
const WooCommerce = new WooCommerceAPI({
	url: process.env.WPDNS,
	consumerKey: process.env.WOOKEY,
	consumerSecret: process.env.WOOSECRET,
	wpAPI: true,
	version: 'wc/v3'
});


exports.wooGet_Prom = async(url) => {
	return new Promise(async(resolve, reject) => {
		try{
			const result = await WooCommerce.getAsync(url);
			resolve(JSON.parse(result.toJSON().body));
		} catch(error) {
			console.log(error);
			reject(error);
		}
	})
};

exports.wooPost_Prom = async(url, data) => {
	return new Promise(async(resolve, reject) => {
		try{
			const result = await WooCommerce.postAsync(url, data);
			resolve(JSON.parse(result.toJSON().body));
		} catch(error) {
			console.log(error);
			reject(error);
		}
	})
};

exports.wooPut_Prom = async(url, data, type) => {
	return new Promise(async(resolve, reject) => {
		try{
			if(type != "String") {
				for(val in data) {
					if(type == "Boolean") {
						if(data[val] == "true") {
							data[val] = true;
						} else if(data[val] == "false") {
							data[val] = false;
						} else {
							data = null;
						}
					} else if(type == "Number") {
						data[val] = parseInt(data[val]);
					} else if(type == "Float") {
						data[val] = parseFloat(data[val]);
					}
				}
			}
			const result = await WooCommerce.putAsync(url, data);
			// console.log(result)
			resolve(JSON.parse(result.toJSON().body));
		} catch(error) {
			console.log(error);
			reject(error);
		}
	})
};

exports.wooDelete_Prom = async(url) => {
	return new Promise(async(resolve, reject) => {
		try{
			const result = await WooCommerce.deleteAsync(url);
			resolve(JSON.parse(result.toJSON().body));
		} catch(error) {
			console.log(error);
			reject(error);
		}
	})
};


const axios = require('axios');
exports.wpToken_Prom = async() => {
	return new Promise(async(resolve, reject) => {
		try{
			const tokenUrl = "https://kelinlab.com/wp-json/jwt-auth/v1/token";
			const username = 'latteireland@gmail.com';
			const password = 'H3qEYka9qz';
			const headers = {
				"Access-Control-Allow-Origin": "http://localhost:3000",
				"Access-Control-Allow-Credentials": true
			}
			const wp_res = await axios.post(tokenUrl, {username, password})
			const token = wp_res.data.token
			resolve(token)
		} catch(error) {
			// console.log(error);
			reject(error);
		}
	})
};
// exports.wpPost_Prom = async() => {
	// //get
	// const getUrl = "https://kelinlab.com/wp-json/wp/v2/media";
	// axios.get(getUrl) .then(response => {console.log(response.data); })
	// .catch(error => {console.log(error); });

	// // post
	// const data = {
	// 	title: "Add new From Api",
	// 	content: "This is the ",
	// 	status: "publish"
	// };
	// const postUrl = "https://kelinlab.com/wp-json/wp/v2/posts";
	// const postNew = await axios.post(postUrl, data, {headers: {'Authorization': `Bearer ${token}`}})
	// console.log(postNew)
// }