var cashierSystemContainer = new Vue({
	el: "#contaniner",
	data: {
		// p1 不是套餐界面
		p1Show: true,
		p1ShowChild: true,
		p2Show: false,

		// p2套餐界面
		// p1Show: false,
		// p1ShowChild: true,
		// p2Show: true,

		// 收银，支付方式界面
		// p1Show: true,
		// p1ShowChild: false,
		// p2Show: false,

		pageNum: 0, //菜品默认选择
		payWayIndex: 0, //默认支付方式选择
		keyBoardNumList: ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '00', '.', '<img src="img/keyboard_icn_eliminate_normal.png">', '货币汇率'],
		//		payMoneyIndex: 0, //默认面额选择
		//		payMoneyList: ["50", "30", "20", "10", "5"],
		//		numbers:1,
		allProductList: [], //所有产品
		packAllProductList: [], //套餐内所有产品
		shopProductList: [], //单品点餐
		packProductList: [], //套餐点餐
		packName: '', //套餐名称
		packPrice: '', //套餐价格
		totalPackPrice: '', //选定套餐后价格
		tempArr: [],
		getPayWayList: [],
		memberMsgList: []

	},
	mounted: function() {
		var that = this;

		//		产品接口
		axios.get('http://icy.iidingyun.com/api/shop/shop_product_cashier_select.vm', {
				params: {
					shopid: "65428"
				}
			}).then(function(res) {
				if(res.data.code == "success") {

					that.allProductList = res.data.data;

				} else {
					console.log(res.data.msg);
				}
			})
			.catch(function(error) {
				console.log(error);
			});

		//		会员查询接口
		axios.get('http://icy.iidingyun.com/api/site_buyer_select.vm', {
				params: {
					userid: "",
					barcode: "000001",
					mobile: '',
					userName: '',
					buyerType: '',
					siteBuyerType: '',
					accountStatus: '',
					createBeginDate: '',
					createEndDate: '',
					updateBeginDate: '',
					updateEndDate: ''
				}
			}).then(function(res) {

				if(res.data.code == "success") {

					console.log(res.data.data)
					cashierSystemContainer.memberMsgList = res.data.data[0];

				} else {
					console.log(res.data.msg);
				}
			})
			.catch(function(error) {
				console.log(error);
			});

		//			获取门店支付方式

		axios.post('http://icy.iidingyun.com/api/shop_set/shop_pay_type_list_select.vm', {

				shopid: "65428"

			}).then(function(res) {
				if(res.data.code == "success") {

					console.log(JSON.stringify(res.data.data));
					cashierSystemContainer.getPayWayList = res.data.data;
				} else {
					console.log(res.data.msg);
				}
			})
			.catch(function(error) {
				console.log(error);
			});

	},
	methods: {
		selectfood: function(allIndex, foodIndex, type) {
			//			套餐
			if(type == 2) {
				var packData = cashierSystemContainer.packAllProductList[allIndex].site_product_accessory[foodIndex];
				console.log(packData);

				console.log(cashierSystemContainer.packAllProductList[allIndex])

				cashierSystemContainer.packAllProductList[allIndex].site_product_accessory[foodIndex].num++;

				//				去重

				var lock = 0;
				for(var i = 0; i < cashierSystemContainer.packProductList.length; i++) {

					if(cashierSystemContainer.packProductList[i].accessoryid == packData.accessoryid) {
						lock++;
					}
				};

				console.log(lock)
				if(lock == 0) {

					cashierSystemContainer.packProductList.push(packData);
				}

			}
			//          单品
			if(type == 1) {
				var isPackage = cashierSystemContainer.allProductList[allIndex].shop_product[foodIndex].site_product_pack.length;

				cashierSystemContainer.packName = cashierSystemContainer.allProductList[allIndex].shop_product[foodIndex].product_name;
				cashierSystemContainer.packPrice = cashierSystemContainer.allProductList[allIndex].shop_product[foodIndex].price;
				if(isPackage > 0) {
					//			套餐
					this.p1Show = false;
					this.p1ShowChild = true;
					this.p2Show = true;

					cashierSystemContainer.packAllProductList = cashierSystemContainer.allProductList[allIndex].shop_product[foodIndex].site_product_pack;
					console.log(cashierSystemContainer.packAllProductList);

				} else {

					var foodData = cashierSystemContainer.allProductList[allIndex].shop_product[foodIndex];
					//				单品
					cashierSystemContainer.allProductList[allIndex].shop_product[foodIndex].num++;

					console.log((foodData.productid));
					var count = 0;
					for(var i = 0; i < cashierSystemContainer.shopProductList.length; i++) {

						if(cashierSystemContainer.shopProductList[i].productid == foodData.productid) {
							count++;
						}
					};

					console.log(count)
					if(count == 0) {

						cashierSystemContainer.shopProductList.push(foodData);

						console.log(cashierSystemContainer.shopProductList)
					}

				}
			};

		},
		foodSwitch: function(index) {
			console.log(index);
			this.pageNum = index;

		},
		add: function(index, type) {

			if(type == 1) {
				if(this.shopProductList[index].num < 100) {
					this.shopProductList[index].num++;
					console.log(this.shopProductList[index].num);

				};
			};

			if(type == 2) {
				if(this.packProductList[index].num < 100) {
					this.packProductList[index].num++;
					console.log(this.packProductList[index].num);

				};
			};

		},
		minus: function(index, type) {

			if(type == 1) {
				if(this.shopProductList[index].num > 0) {
					this.shopProductList[index].num--;
				};

				console.log(this.shopProductList[index].num);

				if(this.shopProductList[index].num == 0) {

					setTimeout(function() {

						cashierSystemContainer.shopProductList.splice(index, 1)
					}, 100)

				}

			};
			if(type == 2) {
				if(this.packProductList[index].num > 0) {
					this.packProductList[index].num--;
				};

				console.log(this.packProductList[index].num);

				if(this.packProductList[index].num == 0) {

					setTimeout(function() {

						cashierSystemContainer.packProductList.splice(index, 1)
					}, 100)

				}

			};
		},
		totalNumber: function() {
			var totalNum = 0;
			for(var i = 0; i < this.shopProductList.length; i++) {
				totalNum += this.shopProductList[i].num;
			};
			return totalNum;
		},
		totalPrice: function(type) {
			//套餐总价
			if(type == 2) {

				var totalPriceNum = 0;

				for(var j = 0; j < this.packProductList.length; j++) {
					totalPriceNum += this.packProductList[j].price * this.packProductList[j].num;
				};
				//			console.log(totalPriceNum)

				this.totalPackPrice = totalPriceNum;
				return totalPriceNum;

			};

			if(type == 1) {
				//单品总价
				var totalPriceNum = 0;

				for(var j = 0; j < this.shopProductList.length; j++) {
					totalPriceNum += this.shopProductList[j].price * this.shopProductList[j].num;
				};
				//			console.log(totalPriceNum)
				return totalPriceNum;

			};

		},
		clearSelected: function(type) {

			//			清空套餐
			if(type == 1) {
				for(var i = 0; i < this.shopProductList.length; i++) {
					this.shopProductList[i].num = 0;
				};
				this.shopProductList = []; //单品点餐

			};
			//			清空选择的单品
			if(type == 2) {

				for(var i = 0; i < this.packProductList.length; i++) {
					this.packProductList[i].num = 0;
				};
				this.packProductList = []; //套

			};

		},
		promotionPrice: function() {
			var promotionNum = 0;

			for(var m = 0; m < this.shopProductList.length; m++) {
				promotionNum += (this.shopProductList[m].price - this.shopProductList[m].price) * this.shopProductList[m].num;
			};
			return promotionNum;

		},
		finalPrice: function() {
			var finalNum = 0;
			for(var n = 0; n < this.shopProductList.length; n++) {
				finalNum += this.shopProductList[n].price * this.shopProductList[n].num;
			};
			return finalNum;

		},
		//		确认套餐
		packMakeSure: function() {
			this.shopProductList.push({
				product_name: this.packName,
				price: this.totalPackPrice,
				num: 1,
				site_product_accessory: this.packProductList

			});

			this.p1Show = true;
			this.p1ShowChild = true;
			this.p2Show = false;
		},
		//		结算
		finalCheckOut: function() {
			this.p1Show = true;
			this.p1ShowChild = false;
			this.p2Show = false;

			console.log(JSON.stringify(cashierSystemContainer.shopProductList))
		},
		//选择支付方式
		selectPayWay: function(index) {
			this.payWayIndex = index;
			var typeid = this.getPayWayList[index].typeid;
			console.log(typeid);
		},
		//		选择充值面额
		//		selectMoney: function(index) {
		//			this.payMoneyIndex = index;
		//			var money = this.payMoneyList[index];
		//			console.log(money)
		//		}
		//	数字键盘
		selectNums: function(index) {
			var num = this.keyBoardNumList[index];
			console.log(num);
		},
		openAnAccount: function() {

			var mobile = this.memberMsgList.mobile;
			var cardno = this.memberMsgList.cardno;
			var user_name = this.memberMsgList.user_name;
			var shopid = 65428;
			var data = {
				user_name: user_name,
				policyid: "",
				market_policyid: '',
				account_status: '',
				last_msg_date: '',
				msg_times: '',
				buyer_type: 0,
				site_buyer_type: '',
				login_times: '',
				barcode: '',
				level: 1,
				wx_openid: '',
				//shopid: shopid,
				password: '',
				mobile: mobile,
				cardno: cardno,
				referee: '',
				alipay_openid: ''

			};

			console.log(data);

			axios.post('http://icy.iidingyun.com/api/member/site_buyer_create.vm', data).then(function(res) {
					console.log(res.data)

					if(res.data.code == "success") {

						console.log(JSON.stringify(res.data.data));

					} else {
						console.log(res.data.msg);
					}
				})
				.catch(function(error) {
					console.log(error);
				});
		},
		//		选择堂食时结算支付
		payMoneyCheckOut: function() {

			var orderProduct = [];
			var tempOrderProduct = cashierSystemContainer.shopProductList;
			console.log(tempOrderProduct)
			var tempProductName = '';
			for(var i = 0; i < tempOrderProduct.length; i++) {

//				console.log(tempOrderProduct[i].site_product_accessory.length);
				
				if(tempOrderProduct[i].site_product_accessory) {
					tempProductName=tempOrderProduct[i].product_name;
					for(var m = 0; m < tempOrderProduct[i].site_product_accessory.length; m++) {
						tempProductName +="+"+tempOrderProduct[i].site_product_accessory[m].accessory_name;
					};

					orderProduct.push({
						'buyerName': '',
						'createTime': '',
						'productid': tempOrderProduct[i].site_product_accessory[0].productid,
						'price': tempOrderProduct[i].price,
						'productCount': tempOrderProduct[i].num,
						'productStatus': "confirmed",
						'productName': tempProductName
					});

				} else {
					orderProduct.push({
						'buyerName': '',
						'createTime': '',
						'productid': tempOrderProduct[i].productid,
						'price': tempOrderProduct[i].price,
						'productCount': tempOrderProduct[i].num,
						'productStatus': "confirmed",
						'productName': tempOrderProduct[i].product_name
					});

				}

			}

			var payData = {
				"arrivalTime": "2018-01-24 12:47:58",
				"barcode": this.memberMsgList.barcode,
				"buyerName": this.memberMsgList.user_name,
				"buyerRemark": "",
				"createTime": "2018-01-24 12:02:58",
				"deliveryBuilding": "3",
				"deliveryDetailPlace": "",
				"displayArrivalTime": "2018-01-24 12:02:47",
				"displayScore": "0.0",
				"groupid": 0,
				"ip": "",
				"lockStatus": "",
				"mobile": this.memberMsgList.mobile,
				"operator": "",
				"payWay": "comp",
				"orderWay": "self_canteen",
				"shopOrderid": "self_canteen",
				"persons": "1",
				"phone": "13809897810",
				"points": 0,
				"receive": 0,
				"serviceFee": "0",
				"serviceQuality": null,
				"shopid": "65428",
				"shopName": "新餐饮",
				"siteid": "49071",
				"smsConfirmation": false,
				"takenoid": 0,
				"terminalDevice": "mobile",
				"ticketNo": "",
				"totalFee": this.finalPrice(),
				"discount": 0,
				"score": 0,
				"orderStatus": "ORDER_COMPLETED",
				"orderProduct": orderProduct,
				"payList": [{
					"payAmount": this.finalPrice(),
					"payType": -2,
					"ticketNo": ""
				}]
			};
			console.log(payData);
			//			下单接口

			axios.post('http://icy.iidingyun.com/api/order/create_order.vm', payData).then(function(res) {
					console.log(JSON.stringify(res.data));
					if(res.data.code == "success") {

					} else {
						console.log(res.data.msg);
					}
				})
				.catch(function(error) {
					console.log(error);
				});

		}

	}

})