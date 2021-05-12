$(() => {
	$("#nameIpt").blur(function(e) {
		const name = $("#nameIpt").val().replace(/^\s*/g,"");
		if(name.length < 1) {
			$("#nameOpt").show();
		} else {
			$("#nameOpt").hide();
		}
	})
	$("#regular_priceIpt").blur(function(e) {
		const regular_price = $("#regular_priceIpt").val().replace(/^\s*/g,"");
		if(!jsFunc_isFloat(regular_price)) {
			$("#regular_priceOpt").show();
		} else {
			$("#regular_priceOpt").hide();
		}
	})
	$("#createPdForm").submit(function(e) {
		const name = $("#nameIpt").val().replace(/^\s*/g,"");
		const regular_price = $("#regular_priceIpt").val().replace(/^\s*/g,"");
		if(name.length < 1) {
			$("#nameOpt").show();
			e.preventDefault();
		} else if(!jsFunc_isFloat(regular_price)) {
			$("#regular_priceOpt").show();
			e.preventDefault();
		} else {
			$("#createPdBtn").hide();
		}
	})
})