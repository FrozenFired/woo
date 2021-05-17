$(() => {
	$(".objDeleteAjax").click(function(e) {
		const target = $(e.target);
		const url = target.data('url');
		const id = target.data('id');
		const reurl = target.data('reurl');

		$.ajax({
			type: "DELETE",
			url: url+id,
			error: (req, err) => {alert("Ajax 参数错误")},
			success: (result)=> {
				if(result.status == 200) {
					if(reurl) {
						window.location.href = reurl;
					} else {
						$("#objBox-"+id).remove();
					}
				} else {
					alert(result.message);
				}
			}
		});
	})
})