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

		pageNum: 0,
		//		numbers:1,
		allProductList: [], //所有产品
		packAllProductList: [], //套餐内所有产品
		shopProductList: [], //单品点餐
		packProductList: [], //套餐点餐
		packName: '', //套餐名称
		packPrice: '', //套餐价格
		totalPackPrice:'',//选定套餐后价格
		tempArr: []
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

//					console.log(JSON.stringify(res.data.data));

					that.allProductList = res.data.data;

//					console.log("allProductList:", that.allProductList);

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
				console.log(JSON.stringify(res.data));
				if(res.data.code == "success") {

				} else {
					console.log(res.data.msg);
				}
			})
			.catch(function(error) {
				console.log(error);
			});
			
//			下单接口

		axios.post('http://icy.iidingyun.com/api/order/create_order.vm', {
				
					shopid: "25628"
				
			}).then(function(res) {
				console.log(JSON.stringify(res.data));
				if(res.data.code == "success") {


//					that.allProductList = res.data.data;

//					console.log("allProductList:", that.allProductList);

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
				
				this.totalPackPrice=totalPriceNum;
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
				product_name:this.packName,
				price:this.totalPackPrice,
				num:1,
				site_product_accessory:this.packProductList
				
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
		}

	}

})