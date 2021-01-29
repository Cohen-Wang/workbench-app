<script>
import Vue from 'vue'
// import './static/iconfont/iconfont.js'

export default {
  onLaunch: function() {
    uni.getSystemInfo({
      success: function(e) {
        // #ifndef MP
        Vue.prototype.StatusBar = e.statusBarHeight
        if (e.platform === 'android') {
          Vue.prototype.CustomBar = e.statusBarHeight + 50
        } else {
          Vue.prototype.CustomBar = e.statusBarHeight + 45
        }
        // #endif

        // 		// #ifdef MP-WEIXIN
        // 		Vue.prototype.StatusBar = e.statusBarHeight;
        // 		let custom = wx.getMenuButtonBoundingClientRect();
        // 		Vue.prototype.Custom = custom;
        // 		Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        // 		// #endif

        // 		// #ifdef MP-ALIPAY
        // 		Vue.prototype.StatusBar = e.statusBarHeight;
        // 		Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
        // 		// #endif
      }
    })
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>
<style lang="scss">
  @import "uni.scss";
  /*@import "common/uni.css";*/
  @import "lib/colorui/main.css";
  @import "lib/colorui/icon.css";
  @import "lib/colorui/animation.css";
  @import "style/app.scss";

  /* 你的项目css */
  /*每个页面公共css */
  /*@font-face {*/
  /*  font-family: 'iconfont';*/
  /*  src: url('./static/iconfont/iconfont.ttf') format('truetype');*/
  /*}*/

  /*.iconfont {*/
  /*  font-family: iconfont;*/
  /*  margin-left: upx(20);*/
  /*}*/
</style>
