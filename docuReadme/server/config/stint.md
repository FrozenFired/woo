为了方便改变数值
extent: {
	user: {
		code: {regexp: '^[a-zA-Z0-9]*$', min: 4, max: 15}, 用户账号的正则表达式只接受英文字符和数字 最短4位 最长15位
		pwd: {min: 6, max: 12},
	},
	firm: {
		code: {regexp: '^[a-zA-Z]*$', len: 4}, 公司编号 只接受4位英文字符 并且长度只能为4
		nome: {min: 2},
		nick: {min: 2},
	}
}
