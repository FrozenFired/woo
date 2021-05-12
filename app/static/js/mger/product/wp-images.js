const orgImages = JSON.parse($("#orgImages").val())
let imgLen = orgImages.length;
$(() => {
	const pdImgInit = () => {
		orgImgRender(orgImages);
	}
	pdImgInit();

	$.ajax({
		type: "GET",
		url: "https://kelinlab.com/wp-json/wp/v2/media?per_page=65",
		error: (req, err) => {alert("Ajax 参数错误")},
		success: (result)=> {
			imgsRender(result);
		}
	});

	/* ============== 提交 按钮 ============== */
	$("#productPutBtn").click(function(e) {
 		const form = $("#productPutForm")
 		const data = form.serialize();
 		// console.log(data)
 		$.ajax({
 			type: "POST",
 			url: "/productPutImages",
 			data: data,
 			success: function(results) {
 				if(results.status === 200) {
 					location.reload();
 				} else {
 					alert(results.message)
 				}
 			}
 		});
	})

	/* ============== 点击 加入图片 ============== */
	$("#wp-images").on("click", ".addImgClick", function(e) {
		const target = $(e.target);
		const image = new Object();
 		image.id = target.data("id");
 		image.src = target.data("src");
 		image.name = target.data("name");
 		image.alt = image.name;

 		let elem = "";
 		elem += imgCardRend(image, imgLen);
		imgLen++;
		$("#wpImgs-"+image.id).remove();
 		$("#woo-images").append(elem);
	})

	/* ============== 点击 移除图片 ============== */
	$("#woo-images").on("click", ".rmImgClick", function(e) {
		const target = $(e.target);
		const image = new Object();
 		image.id = target.data("id");

		$("#wooImgs-"+image.id).remove();
	})
})
const orgImgRender = (images) => {
	let elem = "";
	let i = -1;
	images.forEach(image => {
		i++;
		// console.log(image)
		elem += imgCardRend(image, i);
	})

	$("#woo-images").append(elem)
}
const imgCardRend = (image, sub) => {
	let elem = "";
	elem += '<div class="col-4 col-lg-2 mt-3" id="wooImgs-'+image.id+'">'

		elem += '<input type="hidden", name="images['+sub+'][id]", value='+image.id+' />'
		// elem += '<input type="hidden", name="images['+sub+'][src]", value='+image.src+' />' // 可以省略
		elem += '<input type="hidden", name="images['+sub+'][name]", value='+image.name+' />'
		elem += '<input type="hidden", name="images['+sub+'][alt]", value='+image.alt+' />'

		elem += '<div class="card">'
			elem += '<div class="id">' + image.id + '</div>'
			elem += '<img class="css-img-neat rmImgClick" src="'+image.src+'" data-id='+image.id+' width="100%" height="120px" />'
		elem += '</div>'
	elem += '</div>'

	return elem;
}

const imgsRender = (images) => {
	let elem = "";
	// console.log(images)
	elem += '<div class="row">'
	images.forEach(image => {
		// console.log(image)
		let flag = true;
		for(let i=0; i<orgImages.length; i++) {
			if(image.id == orgImages[i].id) {
				flag = false;
				break;
			}
		}
		if(flag) {
			elem += '<div class="col-4 col-lg-2 mt-3" id="wpImgs-'+image.id+'">'
				elem += '<div class="card">'
					elem += '<div class="id">' + image.id + '</div>'
					elem += '<img class="css-img-neat addImgClick"'
						elem += ' data-id='+image.id+' data-src='+image.source_url+' data-name='+image.slug
					elem += ' src="'+image.source_url+'" width="100%" height="120px" />'
				elem += '</div>'
				// elem += '<img src='+image.
			elem += '</div>'
		}
	})
	elem += '</div>'

	$("#wp-images").append(elem)
}