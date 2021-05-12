$(function() {
	const Extent = JSON.parse($("#extent").val());

	$("#adUserNew-Form").submit(function(e) {
		const code = $("#codeIpt").val();
		const pwd = $("#pwdIpt").val();
		const role = $("#roleIpt").val();
		const firm = $("#firmIpt").val();

		if(!codeFilter(code)){
			e.preventDefault();
		} else if(!pwdFilter(pwd)) {
			e.preventDefault();
		} else if(!roleFilter(role)) {
			e.preventDefault();
		} else if(!firmFilter(firm)) {
			e.preventDefault();
		}
	})

	$("#adUserUpdCode-Form").submit(function(e) {
		const code = $("#codeIpt").val();
		if(!codeFilter(code)){
			e.preventDefault();
		}
	})
	$("#adUserUpdPwd-Form").submit(function(e) {
		const pwd = $("#pwdIpt").val();
		const pwdCheck = $("#pwdCheckIpt").val();
		if(!pwdFilter(pwd)) {
			e.preventDefault();
		} else if(!pwdCheckFilter(pwdCheck, pwd)) {
			e.preventDefault();
		}
	})


	$("#codeIpt").blur(function() {
		const code = $(this).val().replace(/^\s*/g,"").toUpperCase();
		$(this).val(code);
		codeFilter(code)
	})
	$("#pwdIpt").blur(function() {
		const pwd = $(this).val().replace(/^\s*/g,"");
		$(this).val(pwd);
		pwdFilter(pwd)
	})
	$("#pwdCheckIpt").blur(function() {
		const pwdCheck = $(this).val().replace(/^\s*/g,"");
		$(this).val(pwdCheck);
		const pwd = $("#pwdIpt").val().replace(/^\s*/g,"");
		pwdCheckFilter(pwdCheck, pwd)
	})
	$("#roleIpt").change(function() {
		const role = $("#roleIpt").val();
		roleFilter(role)
	})
	$("#firmIpt").change((e) => {
		const firm = $("#firmIpt").val();
		firmFilter(firm)
	})


	const codeFilter = (code) => {
		const regexp = new RegExp(Extent.code.regexp);
		if(!code || code.length < Extent.code.min || code.length > Extent.code.max || !regexp.test(code)){
			$("#codeLabel").removeClass("text-info");
			$("#codeLabel").addClass("text-danger");
			$("#codeOpt").show();
			return false;
		} else {
			$("#codeLabel").removeClass("text-danger");
			$("#codeLabel").addClass("text-info");
			$("#codeOpt").hide();
			return true;
		}
	}
	const pwdFilter = (pwd) => {
		if(!pwd || pwd.length < Extent.pwd.min || pwd.length > Extent.pwd.max){
			$("#pwdLabel").removeClass("text-info");
			$("#pwdLabel").addClass("text-danger");
			$("#pwdOpt").show();
			return false;
		} else {
			$("#pwdLabel").removeClass("text-danger");
			$("#pwdLabel").addClass("text-info");
			$("#pwdOpt").hide();
			return true;
		}
	}
	const pwdCheckFilter = (pwdCheck, pwd) => {
		if(pwdCheck !== pwd){
			$("#pwdCheckLabel").removeClass("text-info");
			$("#pwdCheckLabel").addClass("text-danger");
			$("#pwdCheckOpt").show();
			return false;
		} else {
			$("#pwdCheckLabel").removeClass("text-danger");
			$("#pwdCheckLabel").addClass("text-info");
			$("#pwdCheckOpt").hide();
			return true;
		}
	}
	const roleFilter = (role) => {
		if(role == 0){
			$("#roleLabel").removeClass("text-info");
			$("#roleLabel").addClass("text-danger");
			$("#roleOpt").show();
			return false;
		} else {
			$("#roleLabel").removeClass("text-danger");
			$("#roleLabel").addClass("text-info");
			$("#roleOpt").hide();
			return true;
		}
	}
	const firmFilter = (firm) => {
		if(firm == 0){
			$("#firmLabel").removeClass("text-info");
			$("#firmLabel").addClass("text-danger");
			$("#firmOpt").show();
			return false;
		} else {
			$("#firmLabel").removeClass("text-danger");
			$("#firmLabel").addClass("text-info");
			$("#firmOpt").hide();
			return true;
		}
	}
})