$(() => {
	$(".showImagesBtn").click(function(e) {
		$(".basicPage").hide();
		$(".imagePage").show();
	})
	$(".hideImagesBtn").click(function(e) {
		$(".basicPage").show();
		$(".imagePage").hide();
	})
})