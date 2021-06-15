$(() => {
	$("#basicDetail").click(function(e) {
		$("#basicDetail").hide();
		$(".basicDetail").hide();
		$("#basicUpdate").show();
		$(".basicUpdate").show();
	})
	$("#basicUpdate").click(function(e) {
		$("#basicUpdate").hide();
		$(".basicUpdate").hide();
		$("#basicDetail").show();
		$(".basicDetail").show();
	})

	$("#imageDetail").click(function(e) {
		$("#imageDetail").hide();
		$(".imageDetail").hide();
		$("#imageUpdate").show();
		$(".imageUpdate").show();
	})
	$("#imageUpdate").click(function(e) {
		$("#imageUpdate").hide();
		$(".imageUpdate").hide();
		$("#imageDetail").show();
		$(".imageDetail").show();
	})

	$("#manageDetail").click(function(e) {
		$("#manageDetail").hide();
		$(".manageDetail").hide();
		$("#manageUpdate").show();
		$(".manageUpdate").show();
	})
	$("#manageUpdate").click(function(e) {
		$("#manageUpdate").hide();
		$(".manageUpdate").hide();
		$("#manageDetail").show();
		$(".manageDetail").show();
	})
})