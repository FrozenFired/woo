$(() => {
	$("#nameIpt").blur(function(e) {
		const name = $("#nameIpt").val().replace(/^\s*/g,"");
		if(name.length < 1) {
			$("#nameOpt").show();
		} else {
			$("#nameOpt").hide();
		}
	})
	$("#createPdForm").submit(function(e) {
		const name = $("#nameIpt").val().replace(/^\s*/g,"");
		if(name.length < 1) {
			$("#nameOpt").show();
			e.preventDefault();
		} else {
			$("#createPdBtn").hide();
		}
	})
})