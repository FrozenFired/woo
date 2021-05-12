$(function() {

	$("#crtImg").click(function(e) {
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

	$("#imgEditBtn").click(function(e) {
		$(".imgEdit").toggle();
	})
})