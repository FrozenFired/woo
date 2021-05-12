$(function() {
	const Extent = JSON.parse($("#extent").val());

	$("#adFirmNew-Form").submit(function(e) {
		const code = $("#codeIpt").val();
		const nome = $("#nomeIpt").val();
		const nick = $("#nickIpt").val();
		const categFirm = $("#categFirmIpt").val();

		if(!codeFilter(code)){
			e.preventDefault();
		} else if(!nomeFilter(nome)) {
			e.preventDefault();
		} else if(!nickFilter(nick)) {
			e.preventDefault();
		} else if(!categFirmFilter(categFirm)) {
			e.preventDefault();
		}
	})

	$("#noteArea").val($("#noteIpt").val())
	$("#adFirmUpd-Form").submit(function(e) {
		const code = $("#codeIpt").val();
		const nome = $("#nomeIpt").val();
		const nick = $("#nickIpt").val();
		const categFirm = $("#categFirmIpt").val();

		if(!codeFilter(code)){
			e.preventDefault();
		} else if(!nomeFilter(nome)) {
			e.preventDefault();
		} else if(!nickFilter(nick)) {
			e.preventDefault();
		} else if(!categFirmFilter(categFirm)) {
			e.preventDefault();
		}
	})


	$("#codeIpt").blur(function() {
		const code = $(this).val().replace(/^\s*/g,"").toUpperCase();
		$(this).val(code);
		codeFilter(code)
	})
	$("#nomeIpt").blur(function() {
		const nome = $(this).val().replace(/^\s*/g,"").toUpperCase();
		$(this).val(nome);
		if(nomeFilter(nome)) $("#nickIpt").val(nome);
	})
	$("#nickIpt").blur(function() {
		const nick = $(this).val().replace(/^\s*/g,"").toUpperCase();
		$(this).val(nick);
		nickFilter(nick)
	})
	$("#categFirmIpt").change((e) => {
		const categFirm = $("#categFirmIpt").val();
		categFirmFilter(categFirm)
	})


	const codeFilter = (code) => {
		const regexp = new RegExp(Extent.code.regexp);
		if(!code || code.length != Extent.code.len){
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
	const nomeFilter = (nome) => {
		if(!nome || nome.length < Extent.nome.min){
			$("#nomeLabel").removeClass("text-info");
			$("#nomeLabel").addClass("text-danger");
			$("#nomeOpt").show();
			return false;
		} else {
			$("#nomeLabel").removeClass("text-danger");
			$("#nomeLabel").addClass("text-info");
			$("#nomeOpt").hide();
			return true;
		}
	}
	const nickFilter = (nick) => {
		if(!nick || nick.length < Extent.nick.min){
			$("#nickLabel").removeClass("text-info");
			$("#nickLabel").addClass("text-danger");
			$("#nickOpt").show();
			return false;
		} else {
			$("#nickLabel").removeClass("text-danger");
			$("#nickLabel").addClass("text-info");
			$("#nickOpt").hide();
			return true;
		}
	}
	const categFirmFilter = (categFirm) => {
		if(isNaN(categFirm)){
			$("#categFirmLabel").removeClass("text-info");
			$("#categFirmLabel").addClass("text-danger");
			$("#categFirmOpt").show();
			return false;
		} else {
			$("#categFirmLabel").removeClass("text-danger");
			$("#categFirmLabel").addClass("text-info");
			$("#categFirmOpt").hide();
			return true;
		}
	}
})