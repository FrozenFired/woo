$(() => {
	let i = 0;
	const getItem = (pd, vr) => {
		i++;
		console.log(i)
		$.ajax({
			type: "GET",
			url: "/itemAjax/"+pd+"/"+vr,
			success: (result)=> {
				console.log(vr)
				console.log(result)
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