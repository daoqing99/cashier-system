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
		tempArr: []
	},
	mounted: function() {
		var that = this;
		axios.get('http://icy.iidingyun.com/api/shop/shop_product_cashier_select.vm', {
				params: {
					shopid: "65428"
				}
			}).then(function(res) {
				if(res.data.code == "success") {

					console.log(JSON.stringify(res.data.data));

					that.allProductList = res.data.data;

					console.log("allProductList:", that.allProductList);

				} else {
					console.log(res.data.msg);
				}
			})
			.catch(function(error) {
				console.log(error);
			});

	},
	methods: {
		selectfood: function(allfoodIndex, foodIndex) {
			var isPackage = cashierSystemContainer.allProductList[allfoodIndex].shop_product[foodIndex].site_product_pack.length;
			//	alert(isPackage)

			cashierSystemContainer.packName = cashierSystemContainer.allProductList[allfoodIndex].shop_product[foodIndex].product_name;
			cashierSystemContainer.packPrice = cashierSystemContainer.allProductList[allfoodIndex].shop_product[foodIndex].price;
			if(isPackage > 0) {
				//			套餐
				this.p1Show = false;
				this.p1ShowChild = true;
				this.p2Show = true;

				cashierSystemContainer.packAllProductList = cashierSystemContainer.allProductList[allfoodIndex].shop_product[foodIndex].site_product_pack;
				console.log(cashierSystemContainer.packAllProductList)
			} else {

				var foodData = cashierSystemContainer.allProductList[allfoodIndex].shop_product[foodIndex];
				//				单品
				cashierSystemContainer.allProductList[allfoodIndex].shop_product[foodIndex].num++;

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

		},
		foodSwitch: function(index) {
			console.log(index);
			this.pageNum = index;

		},
		add: function(index) {
			if(this.shopProductList[index].num < 100) {
				this.shopProductList[index].num++;
				console.log(this.shopProductList[index].num);

			};

			console.log(this.shopProductList[index])
		},
		minus: function(index) {
			if(this.shopProductList[index].num > 0) {
				this.shopProductList[index].num--;
			};

			console.log(this.shopProductList[index].num);

			if(this.shopProductList[index].num == 0) {

				setTimeout(function() {

					cashierSystemContainer.shopProductList.splice(index, 1)
				}, 100)

			}
		},
		totalNumber: function() {
			var totalNum = 0;
			for(var i = 0; i < this.shopProductList.length; i++) {
				totalNum += this.shopProductList[i].num;
			};
			return totalNum;
		},
		totalPrice: function() {
			var totalPriceNum = 0;

			for(var j = 0; j < this.shopProductList.length; j++) {
				totalPriceNum += this.shopProductList[j].site_price * this.shopProductList[j].num;
			};
			//			console.log(totalPriceNum)
			return totalPriceNum;

		},

		promotionPrice: function() {
			var promotionNum = 0;

			for(var m = 0; m < this.shopProductList.length; m++) {
				promotionNum += (this.shopProductList[m].site_price - this.shopProductList[m].price) * this.shopProductList[m].num;
			};
			return promotionNum;

		},
		finalPrice: function() {
			var finalNum = 0;
			for(var n = 0; n < this.shopProductList.length; n++) {
				finalNum += this.shopProductList[n].price * this.shopProductList[n].num;
			};
			return finalNum;

		}

	}

})