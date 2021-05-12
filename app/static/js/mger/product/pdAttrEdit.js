$(function() {
	$("#subBtnPutAttrs").click(function(e) {
		// const name = $("#nameAttr").val();
		// const options = $("#optionsAttr").val();
		// if(!name || name.length < 1) {
		// 	alert("请输入属性名称")
		// } else if(!options || options.length < 1) {
		// 	alert("请输入属性值")
		// } else {
		// }
		$("#productPutAttrForm").submit();
	})

	$("#attrEdit").click(function(e) {
		$(".attrText").toggle();
		$(".attrInput").toggle();
	})
})