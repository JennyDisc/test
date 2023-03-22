<template>
  這是購物車頁面
  <table class="table align-middle">
    <thead>
      <tr>
        <th></th>
        <th>品名</th>
        <th style="width: 150px">數量/單位</th>
        <th>單價</th>
        <th>小計</th>
      </tr>
    </thead>
    <tbody>
      <!-- v-if="cart.carts"確保購物車裡面有產品才跑<template>這段 -->
      <template v-if="cart.carts">
        <tr v-for="item in cart.carts" :key="item.id">
          <td>
            <button
              type="button"
              class="btn btn-outline-danger btn-sm"
              @click="deleteItem(item)"
              :disabled="item.id === loadingItem"
            >
              <!-- 點擊"刪除"時，deleteItem(item)定義了this.loadingItem = item.id，當兩者相等才出現<i>的loading效果。點擊按鈕前loadingItem是沒有值的 -->
              <i
                class="fas fa-spinner fa-pulse"
                v-if="loadingItem === item.id"
              ></i>
              x
            </button>
          </td>
          <td>
            {{ item.product.title }}
            <!-- <div class="text-success">
                    已套用優惠券
                  </div> -->
          </td>
          <td>
            <div class="input-group input-group-sm">
              <div class="input-group mb-3">
                <!-- <input min="1" type="number" class="form-control"> -->
                <!-- 商品數量欄位改為下拉選單 -->
                <!-- :disabled="item.id===loadingItem"當產品數量下拉選單更新時，選單暫時無法操作，待API回傳更新資料後才可再次改變 -->
                <select
                  name=""
                  id=""
                  class="from-select"
                  v-model="item.qty"
                  @change="updataCartItem(item)"
                  :disabled="item.id === loadingItem"
                >
                  <option :value="i" v-for="i in 20" :key="`${i}+123`">
                    {{ i }}
                  </option>
                </select>
                <span class="input-group-text" id="basic-addon2">{{
                  item.product.unit
                }}</span>
              </div>
            </div>
          </td>
          <td>
            {{ item.product.price }}
          </td>
          <td>
            <!-- <small class="text-success">折扣價：</small> -->
            {{ item.total }}
          </td>
        </tr>
      </template>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="4" class="text-end">總計</td>
        <td class="text-end">{{ cart.total }}</td>
      </tr>
      <tr>
        <td colspan="4" class="text-end text-success">折扣價</td>
        <td class="text-end text-success">{{ cart.final_total }}</td>
      </tr>
    </tfoot>
  </table>
</template>

<script>
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env

export default {
  data () {
    return {
      // 從API取回的產品資料放到products
      products: [],
      productId: '',
      cart: {},
      loadingItem: '', // 儲存產品id
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: ''
        },
        message: ''
      },
      isLoading: false
    }
  },
  methods: {
    // 取得購物車列表
    getCarts () {
      this.$http.get(`${VITE_APP_URL}api/${VITE_APP_PATH}/cart`)
        .then(res => {
          // console.log("購物車: ", res.data);
          this.cart = res.data.data
        })
        .catch((error) => {
          // console.dir(error);
          alert(error.data.message)
        })
    },
    // 更動購物車內單一產品的數量
    updataCartItem (item) { // item內第一個API的id是購物車id，第二個product_id是產品id
      const data = {
        product_id: item.product.id,
        qty: item.qty
      }
      // 儲存所點擊的產品id
      this.loadingItem = item.id
      this.$http.put(`${VITE_APP_URL}api/${VITE_APP_PATH}/cart/${item.id}`, { data })
        .then(res => {
          // console.log("更新購物車: ", res.data);
          // 重新取得購物車列表
          this.getCarts()
          // 更新完購物車單一產品數量後，初始化this.loadingItem
          this.loadingItem = ''
          alert('該產品數量調整成功!')
        })
        // .catch((error) => {
        //   // console.dir(error);
        //   alert('該產品數量調整失敗!!')
        // })
    },
    // 刪除購物車內的單一產品
    deleteItem (item) {
      // 儲存所點擊的產品id
      this.loadingItem = item.id
      this.$http.delete(`${VITE_APP_URL}api/${VITE_APP_PATH}/cart/${item.id}`)
        .then(res => {
          // console.log("刪除購物車: ", res.data);
          // 重新取得購物車列表
          this.getCarts()
          // 刪除完購物車單一產品數量後，初始化this.loadingItem
          this.loadingItem = ''
          alert('購物車已移除該品項!')
        })
        // .catch((error) => {
        //   // console.dir(error);
        //   alert('購物車移除該品項失敗!!')
        // })
    },
    // 清空購物車
    deleteCarts () {
      // 避免連續點擊"清空購物車"，用此定義點過按鈕後等待API回應期間不能再次點擊
      this.loadingItem = 'delete'
      this.$http.delete(`${VITE_APP_URL}api/${VITE_APP_PATH}/carts`)
        .then(res => {
          // console.log("清空購物車: ", res.data);
          // 重新取得購物車列表
          this.getCarts()
          alert('購物車已清空!')
          // 清空購物車後，初始化this.loadingItem
          this.loadingItem = ''
        })
        // .catch((error) => {
        //   // console.dir(error);
        //   alert('購物車清空失敗!!')
        // })
    }
  },
  mounted () {
    this.getCarts()
  }
}
</script>
