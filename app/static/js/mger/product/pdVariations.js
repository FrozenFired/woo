$(() => {
	$("#variationDelBox").click(function(e) {
		$(".variationDelElem").toggle();
	})

	$(".variationDelBtn").click(function(e) {
		const target = $(e.target);
		const id = target.data("id");
		const product_id = target.data("product_id");
		
		$.ajax({
			type: "DELETE",
			url: "/variationDel/"+id+"?product_id="+product_id,
			error: (req, err) => {alert("Ajax 参数错误")},
			success: (result)=> {
				if(result.status == 200) {
					$("#variationTr-"+id).remove();
				} else {
					alert(result.message);
				}
			}
		});
	})
})