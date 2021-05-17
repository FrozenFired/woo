$(function() {

	$("body").on("click", ".crtImg", function(e) {
		$("#uploadImg").click();
	})
	$("#uploadImg").change(function(e) {
		$(".postsCrtBox").remove();
		const newFile = document.getElementById('uploadImg').files[0];
		const src = window.URL.createObjectURL(newFile);
		document.getElementById('crtImg').src = src;
	})



	$("#subBtnPutImg").click(function(e) {
		$("#productPutImgForm").submit();
	})

	$("#imgEditBox").click(function(e) {
		$(".imgEdit").show();
		$("#crtImg").addClass("crtImg");

		$("#imgEditBox").hide();
		$("#imgEditCancelBox").show();
	})
	$("#imgEditCancelBox").click(function(e) {
		$(".imgEdit").hide();
		$("#crtImg").removeClass("crtImg");

		$("#imgEditBox").show();
		$("#imgEditCancelBox").hide();
	})
})