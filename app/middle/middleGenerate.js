const jwt = require('jsonwebtoken');

exports.generateAccessToken = (obj)=> {
	const payload = generatePayload(obj);
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EX})
}
exports.generateRefreshToken = (obj)=> {
	const payload = generatePayload(obj);
	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: process.env.REFRESH_TOKEN_EX})
}

const generatePayload = (obj)=> {
	let stream = null;
	if(obj.stream) stream = obj.stream;
	const payload = {
		_id: obj._id,
		code: obj.code,
		nome: obj.nome,
		role: obj.role,
		firm: obj.firm,
		stream: stream
	}
	return payload;
}