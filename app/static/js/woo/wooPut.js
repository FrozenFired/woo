const wooPutAjax = (url, body) => {
	$.ajax({
		type: "PUT",
		url: url,
		data: body,
		success: function(results) {
			if(results.status === 200) {
				location.reload();
			} else {
				alert(results.message)
			}
		}
	});
}
$(() => {
	/* ================ checkbox改变信息 ================ */
	$(".cbxBtnSubmit").click(function(e) {
		const target = $(e.target);
		const url = target.data("url");
		const type = target.data("type");
		const key = target.data("key");
		const val = new Array();
		$(".cbxIpt-"+key).each(function(index,elem) {
			if($(this).attr("checked")) {
				val.push($(this).val())
			}
		})
		let body = "type="+type;
		let i = -1;
		val.forEach((item) => {
			i++;
			body += "&data["+key+"]["+i+"][id]="+item;
		});
		
		wooPutAjax(url, body);
	})

	/* ================ 点击按钮改变信息 ================ */
	$(".putObjBtnClick").click(function(e) {
		const target = $(e.target);
		const url = target.data("url");
		const type = target.data("type");
		const key = target.data("key");
		const val = target.data("val");
		const body = "data["+key+"]="+val+"&type="+type;
		wooPutAjax(url, body);
	})

	/* ================ Select选择改变信息 ================ */
	$(".putObjSelChange").change(function(e) {
		const target = $(e.target);
		const url = target.data("url");
		const type = target.data("type");
		const key = target.data("key");
		const val = $(this).val().replace(/^\s*/g,"");
		const body = "data["+key+"]="+val+"&type="+type;
		wooPutAjax(url, body);
	})

	/* ================ 需要输入字符串改变信息 ================ */
	// 点击后显示输入框
	$(".keyClickUpA").click(function(e) {
		const htmlId = $(this).attr("id");
		const strs = htmlId.split("-");
		$("#valClickUpA-"+strs[1]+"-"+strs[2]).toggle();
		$("#iptNewBlurUpd-"+strs[1]+"-"+strs[2]).toggle();

		const orgVal = $("#iptOrg-"+strs[1]+"-"+strs[2]).val();
		$("#iptNewBlurUpd-"+strs[1]+"-"+strs[2]).val(orgVal);
	})
	$(".valClickUpA").click(function(e) {
		const htmlId = $(this).attr("id");
		const strs = htmlId.split("-");
		$("#iptNewBlurUpd-"+strs[1]+"-"+strs[2]).show();
		const orgVal = $("#iptOrg-"+strs[1]+"-"+strs[2]).val();
		$("#iptNewBlurUpd-"+strs[1]+"-"+strs[2]).val(orgVal);
		$(this).hide();
	})
	// 离开后修改
	$(".iptNewBlurUpd").blur(function(e) {
		const htmlId = $(this).attr("id");
		const strs = htmlId.split("-");
		const orgVal = $("#iptOrg-"+strs[1]+"-"+strs[2]).val();
		const val = $(this).val();

		if(val != orgVal) {
			const target = $(e.target);
			const key = target.data("key");
			const type = target.data("type");
			const url = target.data("url");
			const body = "data["+key+"]="+val+"&type="+type;
			wooPutAjax(url, body);
		} else {
			$(this).hide();
			$("#valClickUpA-"+strs[1]+"-"+strs[2]).show();
		}
	})
})