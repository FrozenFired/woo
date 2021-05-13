$(() => {
	$("#variationAddBox").click(function(e) {
		$("#variationAddPage").toggle();
	})

	$("#variationPostForm").submit(function(e) {
		const regular_price = $("#regular_priceIpt").val();
		if(!regular_price) {
			alert("请输入售价");
			e.preventDefault();
		} else if(!jsFunc_isFloat(regular_price)) {
			alert("售价请输入数字");
			e.preventDefault();
		} else {
			$("#variationPostForm").hide();
		}
	})
})