$(function() {
	$("#subBtnPutAttrs").click(function(e) {
		$("#productPutAttrForm").submit();
		$(".attrText").toggle();
		$(".attrInput").toggle();
	})

	$("#attrEdit").click(function(e) {
		$(".attrText").toggle();
		$(".attrInput").toggle();
	})
})