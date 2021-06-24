$(() => {
	const getItem = (pd, vr) => {
		$.ajax({
			type: "GET",
			url: "/itemAjax/"+pd+"/"+vr,
			success: (result)=> {
				let src = "/icon/firm.jpg";
				if(result.data && result.data.object && result.data.object.images) {
					const images = result.data.object.images;
					if(images.length > 0) src = images[0].src;
				}
				html = '<img class="js-click-imgEnlarge" src='+src+' width="50px">'
				$("#img-pd-"+pd+"-vr-"+vr).append(html)
			}
		});
	}
	$(".item").each(function(index,elem) {
		const idStr = $(this).attr("id");
		const strs = idStr.split("-");
		const pd = strs[1];
		const vr = strs[3];
		getItem(pd, vr)
	})

})