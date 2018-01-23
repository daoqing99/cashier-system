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
		productsList: [],
		pageNum: 0,
		allProductList: [], //所有产品
		shopProductList: [],
		siteProductPackList: []
	},
	created: function() {
		var that = this;
		axios.get('http://icy.iidingyun.com/api/shop/shop_product_cashier_select.vm', {
				params: {
					shopid: "65428"
				}
			})
			.then(function(res) {
				if(res.data.code == "success") {

					// console.log(JSON.stringify(res.data.data));

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
		selectfood:function(allfoodIndex,foodIndex){
				var foodData=cashierSystemContainer.allProductList[allfoodIndex].shop_product[foodIndex];
				console.log(foodData)
				cashierSystemContainer.productsList.push(foodData);
		},
		foodSwitch: function(index) {
			console.log(index);
			this.pageNum = index;

		},
		add: function(index) {
			if(this.productsList[index].inventory_amount < 100) {
				this.productsList[index].inventory_amount++;

			}
		},
		minus: function(index) {
			if(this.productsList[index].inventory_amount > 0) {
				this.productsList[index].inventory_amount--;
			};

			console.log(this.productsList[index].inventory_amount);

			if(this.productsList[index].inventory_amount == 0) {

				setTimeout(function() {

					cashierSystemContainer.productsList.splice(index, 1)
				}, 500)

			}
		},
		totalNumber: function() {
			var totalNum = 0;
			for(var i = 0; i < this.productsList.length; i++) {
				totalNum += Number(this.productsList[i].inventory_amount);
			};
			return totalNum;
		},
		totalPrice: function() {
			var totalPriceNum = 0;

			for(var j = 0; j < this.productsList.length; j++) {
				totalPriceNum += this.productsList[j].site_price * this.productsList[j].inventory_amount;
			};
			console.log(totalPriceNum)
			return totalPriceNum;

		},

		promotionPrice: function() {
			var promotionNum = 0;

			for(var m = 0; m < this.productsList.length; m++) {
				promotionNum += (this.productsList[m].site_price - this.productsList[m].price) * this.productsList[m].inventory_amount;
			};
			return promotionNum;

		},
		finalPrice: function() {
			var finalNum = 0;
			for(var n = 0; n < this.productsList.length; n++) {
				finalNum += this.productsList[n].price * this.productsList[n].inventory_amount;
			};
			return finalNum;

		}

	}

})