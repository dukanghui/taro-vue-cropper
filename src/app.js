import Vue from 'vue'
import store from './store'
import utils from './utils/util'

import './app.less'

Vue.config.productionTip = false

Vue.prototype.$utils = utils
Vue.prototype.$domain = utils.domain
Vue.prototype.$oss = utils.oss
Vue.prototype.$toast = utils.toast
Vue.prototype.$alert = utils.alert

const App = new Vue({
  store,
  onShow (options) {
  },
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default)
  }
})

export default App
