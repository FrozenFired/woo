$(() => {
	$("#postPageBtn").click(function(e) {
		$("#postPage").toggle();
	})

	$("#postForm").submit(function(e) {
		const nameIpt = $("#nameIpt").val();
		if(!nameIpt) {
			alert("请输入种类名称");
			e.preventDefault();
		} else {
			$("#postForm").hide();
		}
	})
})