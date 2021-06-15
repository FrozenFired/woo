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
		const regular_price = $("#regular_priceIpt").val();
		if(!jsFunc_isFloat(regular_price)) {
			$("#regular_priceOpt").show();
		} else {
			$("#regular_priceOpt").hide();
		}
	})
	$("#typeSel").change(function(e) {
		const type = $("#typeSel").val();
		if(type == "variable") {
			$("#attributes-box").show();
		} else {
			$("#attributes-box").hide();
		}
	})
	/* =================== 新建prod =================== */
	$("#createPdForm").submit(function(e) {
		const name = $("#nameIpt").val().replace(/^\s*/g,"");
		const type = $("#typeSel").val();
		if(type == "variable") {
			const attrName1 = $("#attributes-0-name").val();
			const attrOption1 = $("#attributes-0-options").val();
			if(!attrName1 || !attrOption1) {
				alert("因为您上传的是多规格产品, 需要上传属性");
				e.preventDefault();	
			}
		}
		if(name.length < 1) {
			$("#nameOpt").show();
			e.preventDefault();
		}
	})

	/* =================== 修改basic =================== */
	$("#basicForm").submit(function(e) {
		const name = $("#nameIpt").val().replace(/^\s*/g,"");
		if(name.length < 1) {
			$("#nameOpt").show();
			e.preventDefault();
		}
	})

	/* =================== 修改manage 库存等 =================== */
	$("#manage_stockSel").change(function(e) {
		const manage_stock = $("#manage_stockSel").val();
		if(manage_stock == 1) {
			$(".no_manage_stok").hide();
			$(".yes_manage_stok").show();
		} else {
			$(".yes_manage_stok").hide();
			$(".no_manage_stok").show();
		}
	})
	$("#stock_quantityIpt").blur(function(e) {
		const stock_quantity = parseInt($("#stock_quantityIpt").val());
		if(isNaN(stock_quantity)) {
			$("#stock_quantityOpt").show();
		} else {
			$("#stock_quantityOpt").hide();
		}
	})
	$("#manageForm").submit(function(e) {
		const manage_stock = $("#manage_stockSel").val();
		if(manage_stock == 1) {
			const stock_quantity = parseInt($("#stock_quantityIpt").val());
			if(isNaN(stock_quantity)) {
				$("#stock_quantityOpt").show();
				e.preventDefault();
			}
		}
	})
})