const Conf = {
	categFirmNums: [50, 100, 500, 1000],
	categFirm: {
		// factory: {num: 1, val: '工厂'},
		// proxy: {num: 10, val: '代理公司'},
		// dealer: {num: 20, val: '经销公司'},
		supplier: {num: 50, val: '供应公司'},
		trading: {num: 100, val: '贸易公司'},
		sale: {num: 500, val: '销售公司'},
		logistic: {num: 1000, val: '物流公司'}
	},

	roleNums: [1, 3, 5, 10, 20, 25, 30, 50, 70, 90, 95, 99],
	roleAdmins: [1, 3, 5, 10],
	roleUser: {
		owner:    {num: 1, index: '/ower', code: 'bs', val: '拥有 OWNER', },
		manager:  {num: 3, index: '/mger', code: 'mg', val: '管理 Manager', },
		staff:    {num: 5, index: '/sfer', code: 'sf', val: '员工 Staff', },
		finance:  {num:10, index: '/fner', code: 'fn', val: '财务 Finance', },
		brander:  {num:20, index: '/bner', code: 'bn', val: '品牌 Brander', },
		promotion:{num:25, index: '/pmer', code: 'pm', val: '推广 Promotion', },
		order:    {num:30, index: '/oder', code: 'od', val: '订单 Order', },
		quotation:{num:50, index: '/qter', code: 'qt', val: '报价 Quotation', },
		logistic: {num:70, index: '/lger', code: 'lg', val: '物流 Logistic', },
		boss:     {num:90, index: '/bser', code: 'bs', val: '老板 BOSS', },
		seller:   {num:95, index: '/sler', code: 'sl', val: '销售 SELLER', },
		customer: {num:99, index: '/cter', code: 'ct', val: '客户 Customer', },
	},

	userLang: {
		cn: {num: 1, val: '中文'},
		en: {num: 2, val: 'English'},
		it: {num: 3, val: 'Italiano'},
	},

	shelf: {
		off: {num: -1, val: '下架'},
		put:{num: 1, val: '上架'}
	},

	/* ===================== woocommerce ===================== */
	order: {
		status: {
			list: ["on-hold", "processing", "pending", "completed", "cancelled", "refunded", "failed", "trash"],
			arr: ["on-hold", "processing", "pending", "completed", "cancelled", "refunded", "failed", "trash"],
			lang: {
				on_hold: "In sospeso",
				processing: "In lavorazione",
				pending: "In attesa di pagamento",
				completed: "Completato",
				cancelled: "Annullato",
				refunded: "Rimborsato",
				failed: "Fallito",
				trash: "Cestino"
			}
		}
	},
	product: {
		status: {
			list: ["draft", "pending", "private", "publish"],
			arr: ["private", "publish"],
			lang: {
				private: "下架",
				publish: "上架"
			}
		},
		type: {
			list: ["simple", "grouped", "external", "variable"],
			arr: ["simple", "variable"],
			lang: {
				simple: "单一货品",
				variable: "多规格货品"
			}
		},
		stock_status: {
			list: ["instock", "outofstock", "onbackorder"],
			arr: ["instock", "outofstock", "onbackorder"],
			lang: {
				instock: "有库存",
				outofstock: "无库存",
				onbackorder: "缺货"
			}
		},
		backorders: {
			list: ["no", "notify", "yes"],
			arr: ["no", "notify", "yes"],
			lang: {
				no: "不允许",
				notify: "允许,但会提醒缺货",
				yes: "允许(客户不用关心库存)"
			}
		},


		catalog_visibility: {
			list: ["visible", "catalog", "search", "hidden"],
			arr: ["visible", "catalog", "search", "hidden"],
			lang: {
				visible: "可见的",
				// catalog: "图册",
				// search: "查找",
				hidden: "隐藏"
			}
		},
	}
}

module.exports = Conf