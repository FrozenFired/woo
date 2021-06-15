$(function() {
	$("#subBtnPutAttrs").click(function(e) {
		$("#prodPutAttrForm").submit();
		$(".attrText").toggle();
		$(".attrInput").toggle();
	})

	$("#attrEdit").click(function(e) {
		$(".attrText").toggle();
		$(".attrInput").toggle();
	})
})