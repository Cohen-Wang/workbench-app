import Vue from 'vue'
import App from './App'

import cuCustom from './lib/colorui/components/cu-custom.vue'
import uniImageIcon from './components/uni-image-icon/uni-image-icon'
import { toMyApplyWorkStatus } from './services/filter.js'
// import '@/static/iconfont/iconfont.js'
Vue.component('cu-custom', cuCustom)
Vue.component('uni-image-icon', uniImageIcon)

Vue.filter('toMyApplyWorkStatus', toMyApplyWorkStatus)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()

