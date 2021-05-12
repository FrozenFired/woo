$(function() {
	const Extent = JSON.parse($("#extent").val());

	$("#adObjectNew-Form").submit(function(e) {
		const code = $("#codeIpt").val();

		if(!codeFilter(code)){
			e.preventDefault();
		}
	})
	$("#adObjectUpdCode-Form").submit(function(e) {
		const code = $("#codeIpt").val();

		if(!codeFilter(code)){
			e.preventDefault();
		}
	})

	$("#codeIpt").blur(function() {
		const code = $(this).val().replace(/^\s*/g,"").toUpperCase();
		$(this).val(code);
		codeFilter(code)
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
})