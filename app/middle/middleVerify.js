const jwt = require('jsonwebtoken');

exports.token_VerifyProm = (token, secret)=> {
	return new Promise((resolve, reject) => {
		jwt.verify(token, secret, (err, payload) => {
			if(err) {
				reject({'token_VerifyProm': 'Error', 'tokenVal': token});
			} else {
				resolve(payload);
			}
		})
	})
}