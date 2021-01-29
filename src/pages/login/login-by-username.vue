<template>
  <view class="page-content">
    <status-bar class="bg-blue"/>
    <!-- 		<cu-custom bg-color="bg-gradual-pink" :isBack="true">
  <block slot="backText">返回</block>
  <block slot="content">导航栏</block>
</cu-custom> -->

    <view class="cu-bar bg-blue">
      <view class="action">
        <text class="cuIcon-close"/>
        关闭
      </view>
      <view class="content text-bold">
        登录
      </view>
    </view>
    <!-- <view class="close" @click="close">X</view> -->
    <view class="logo text-xxl">龚电总厂</view>
    <view class="form">
      <view class="form_item">
        <label>
          <input v-model="username" placeholder="请输入用户名" type="text">
        </label>
      </view>
      <view class="form_item">
        <!-- <button type="primary" class="loginBtn" @tap="bindLogin">登录</button> -->
        <button class="cu-btn block bg-blue margin-tb-sm lg" @tap="bindLogin">登录</button>
      </view>
    </view>
  </view>
</template>

<script>
import StatusBar from '../../components/status-bar/status-bar.vue'
import _uni from '@/services/uni'

export default {
  components: {
    StatusBar
  },
  data() {
    return {
      username: 'admin'
    }
  },
  onLoad() {
  },
  onReady() {
  },
  methods: {
    bindLogin() {
      if (!this.username.trim()) {
        // _uni.showToast(JSON.stringify(process.env))
        _uni.showToast('请输入用户名')
        return
      }
      uni.redirectTo({
        url: `./authenticating?username=${this.username}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-content {
    background-color: white;
  }

  .logo {
    margin: upx(100) 0 upx(70);
    text-align: center;
  }

  .form {
    .form_item {
      margin: upx(30) upx(40);

      input {
        height: upx(80);
        background: rgba(245, 249, 250, 1);
        border: upx(1) solid rgba(232, 232, 232, 1);
        border-radius: upx(10);
        padding: 0 upx(46);
      }
    }

    .loginBtn {
      // height: 110upx;
      // line-height: 110upx;
      // padding: 0 47upx;
      border-radius: upx(55);
      // background-color: #089BABFF;
    }
  }

  .scale-radio {
    transform: translateY(upx(-3)) scale(0.7);
  }
</style>
