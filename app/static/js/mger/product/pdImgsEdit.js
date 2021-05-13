$(function() {
	$("#crtImgs").click(function(e) {
		$("#uploadImgs").click();
	})
	$("#uploadImgs").change(function(e) {
		$(".postsCrtBox").remove();
		const files = document.getElementById('uploadImgs').files;
		let elem = ""
		for(let i=0; i<files.length; i++) {
			let src = window.URL.createObjectURL(files[i]);
			elem += '<div class="col-2 newImgBox" id="newImgBox-'+i+'">'
				elem += '<img class="css-img-neat border rounded" src='+src+ ' width="100%" height="150px" />'
				elem += '<div class="text-center">'
					elem += '<button class="text-danger btn btn-link newImgDel" data-id="newImgBox-'+i+'" type="button">[删除]</button>'
				elem += '</div>'
			elem += '</div>'
		}
		// document.getElementById('crtImgs').src = src;
		$("#newImgs").prepend(elem)
	})

	$("#newImgs").on("click", ".newImgDel", function(e) {
		const target = $(e.target);
		const id = target.data("id");
		$("#"+id).remove();
	})

	$("#subBtnPutImgs").click(function(e) {
		$("#productPutImgsForm").submit();
		$(".imgsEdit").hide();
	})

	$("#imgsEditBtn").click(function(e) {
		$(".imgsEdit").toggle();
	})
})