$(() => {
	$("#loginUserBtnModal").click(function() {
		// (method="post", action="/loginUser")
		const code = $("#codeIpt").val();
		const pwd = $("#pwdIpt").val();
		if(!code || code.length < 3 || code.length > 10) {
			alert("请输入正确的账号")
			return;
		}
		if(!pwd || pwd.length < 6 || pwd.length > 12) {
			alert("请输入正确的密码")
			return;
		}
		const form = $("#loginUserFormModal");
		const data = form.serialize();
		console.log(data)
	})
})