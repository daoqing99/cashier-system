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
        productsList: [
            { id: '0', name: '香菇滑鸡饭', yuanjia: 40, price: '20', num: 1 },
            { id: '1', name: '辣子鸡丁', yuanjia: 60, price: '30', num: 1 },
            { id: '2', name: '宫保鸡丁', yuanjia: 50, price: '25', num: 1 }
        ]

    },
    methods: {
        add: function(index) {
            if (this.productsList[index].num < 100) {
                this.productsList[index].num++;

            }
        },
        minus: function(index) {
            if (this.productsList[index].num > 0) {
                this.productsList[index].num--;
            };

            console.log(this.productsList[index].num);

            if (this.productsList[index].num == 0) {

                setTimeout(function() {

                    cashierSystemContainer.productsList.splice(index, 1)
                }, 500)

            }
        },
        totalNumber: function() {
            var totalNum = 0;
            for (var i = 0; i < this.productsList.length; i++) {
                totalNum += this.productsList[i].num;
            };
            return totalNum;
        },
        totalPrice: function() {
            var totalPriceNum = 0;

            for (var j = 0; j < this.productsList.length; j++) {
                totalPriceNum += this.productsList[j].yuanjia * this.productsList[j].num;
            };
            return totalPriceNum;

        },

        promotionPrice: function() {
            var promotionNum = 0;

            for (var m = 0; m < this.productsList.length; m++) {
                promotionNum += (this.productsList[m].yuanjia - this.productsList[m].price) * this.productsList[m].num;
            };
            return promotionNum;

        },
        finalPrice: function() {
            var finalNum = 0;
            for (var n = 0; n < this.productsList.length; n++) {
                finalNum += this.productsList[n].price * this.productsList[n].num;
            };
            return finalNum;

        }

    }

})