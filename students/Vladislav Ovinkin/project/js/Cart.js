'use strict';

// import catalogItem from './CatalogItem';

Vue.component ('cart', {
    data () {
        return {
            items: [],
            totalSum: 0,
            cartImage: 'https://placehold.it/100x80',
            cartUrl: 'https://raw.githubusercontent.com/vladovinkin/js-2-08_20.11/master/students/Vladislav%20Ovinkin/project/json/getBasket.json',
            addUrl: 'https://raw.githubusercontent.com/vladovinkin/js-2-08_20.11/master/students/Vladislav%20Ovinkin/project/json/addToBasket.json',
            delUrl: 'https://raw.githubusercontent.com/vladovinkin/js-2-08_20.11/master/students/Vladislav%20Ovinkin/project/json/deleteFromBasket.json',
        }
    },
    methods: {
        addProduct (product) {
            this.$parent.getJSON (this.addUrl)
                .then (answer => {return answer.result})
                .then (result => {
                    if (result == 1) {
                        const find = this.items.find (element => element.product_id === product.product_id);
                        if (!find) {
                            let newItem = Object.assign ({}, product, {quantity: 1});
                            delete newItem.img;
                            this.items.push (newItem);
                        } else {
                            find.quantity++;
                        }
                        this.calcTotalSum();
                    } else {
                        throw new Error ('Server error adding item!');
                    }
                }); 
        },
        removeProduct (product) {
            this.$parent.getJSON (this.delUrl)
                .then (answer => {return answer.result})
                .then (result => {
                    if (result == 1) {
                        const find = this.items.find (element => element.product_id === product.product_id);
                        if (find.quantity > 1) {
                            find.quantity--;
                        } else {
                            this.items.splice (this.items.indexOf (find), 1);
                        }
                        this.calcTotalSum();
                    } else {
                        throw new Error ('Server error removing item!')
                    }
            });
        },
        getCart () {
            return this.$parent.getJSON (this.cartUrl)
                .then (data => this.items = data.contents);
        },
        calcTotalSum () {
            let totalSum = 0;
            this.items.forEach(element => {
                totalSum += element.price * element.quantity;
            });
            this.totalSum = totalSum;
        },
        getCartItemsCount: function () {
            return (this.items != null) ? this.items.length : 0
        },
    },
    mounted () {
        this.getCart (this.cartUrl)
            .finally (() => this.calcTotalSum ());
    },
    template: `
        <div class="cart-block" v-if="$parent.cartshow">
            <cart-item v-for="product of items" :img="cartImage" :el="product" :key="product.product_id"></cart-item>
            <div v-show="getCartItemsCount() > 0" class='cart-total'>Итого: {{'$' + totalSum }}</div>
            <div v-show="getCartItemsCount() == 0">Корзине скучно без товаров :(</div>
        </div>
    `,
    // components: {
    //     'catalog-item': catalogItem,
    // },
})

// export default catalog;