$(() => {
	$.ajax({
		type: "GET",
		url: "https://kelinlab.com/wp-json/wp/v2/posts",
		error: (req, err) => {alert("Ajax 参数错误")},
		success: (result)=> {
			console.log(result)
		}
	});
})