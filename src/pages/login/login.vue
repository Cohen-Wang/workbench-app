<template>
  <view class="page-content">
    <status-bar class="bg-white"/>
    <!-- 		<cu-custom bg-color="bg-gradual-pink" :isBack="true">
  <block slot="backText">返回</block>
  <block slot="content">导航栏</block>
</cu-custom> -->

    <!--    <view class="cu-bar bg-blue">-->
    <!--      <view class="action">-->
    <!--        <text class="cuIcon-close"/>-->
    <!--        关闭-->
    <!--      </view>-->
    <!--      <view class="content text-bold">-->
    <!--        登录-->
    <!--      </view>-->
    <!--    </view>-->
    <!-- <view class="close" @click="close">X</view> -->
    <view class="logo text-xxl">智慧互动培训考试系统</view>
    <view class="form">
      <view class="form_item">
        <label>
          <input v-model="loginForm.username" placeholder="请输入手机号" type="text">
        </label>
      </view>
      <view class="form_item">
        <label>
          <input v-model="loginForm.password" type="password" placeholder="请输入密码">
        </label>
      </view>
      <view class="form_item flex">
        <!--        <radio class="blue scale-radio" :checked="rememberMe" @click="rememberMe = !rememberMe"/>-->
        <view class="margin-left-sm text-df flex-sub text-right" @click="resetPwd">忘记密码?</view>
      </view>
      <view class="form_item">
        <!-- <button type="primary" class="loginBtn" @tap="bindLogin">登录</button> -->
        <button class="cu-btn block bg-blue margin-tb-sm lg" :loading="loading" @tap="bindLogin">登录</button>
      </view>
    </view>
  </view>
</template>

<script>
import StatusBar from '@/components/status-bar/status-bar'
import apiService from '@/services/api'
import _uni from '@/services/uni'
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  TENANT_CODE,
  PERMISSIONS,
  ROLES,
  USER_INFO,
  SYS_CONFIG
} from '@/services/constant'
// import { covertMenuToMap } from '@/services/utils'

export default {
  components: { StatusBar },
  data() {
    return {
      loading: false,
      rememberMe: false,
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  onLoad() {
    if (uni.getStorageSync(ACCESS_TOKEN)) {
      uni.switchTab({
        url: '/pages/course/hottest-course'
      })
    }
  },
  onReady() {
    // 获取app传来的值
  },
  methods: {
    resetPwd() {
      uni.navigateTo({
        url: '/pages/login/reset-pwd'
      })
    },
    bindLogin() {
      // wx.reLaunch({
      // 	url: '../main/main'
      // })

      // uni.request({
      //     method: 'get',
      //     url: 'http://www.example.com/request', //仅为示例，并非真实接口地址。
      //     data: {
      //         text: 'uni.request'
      //     },
      //     header: {
      //         'custom-header': 'hello' //自定义请求头信息
      //     },
      //     success: (res) => {
      //         console.log('request success');
      //     }
      // });

      if (!this.loginForm.username.trim() || !this.loginForm.password.trim()) {
        // _uni.showToast(JSON.stringify(process.env))
        _uni.showToast('请输入用户名和密码')
        return
      }
      // uni.redirectTo({
      //   url: '../home/home'
      // })
      this.loading = true
      apiService.loginByUsername(this.loginForm).then(res => {
        const result = res.data
        uni.setStorageSync(ACCESS_TOKEN, result.access_token)
        uni.setStorageSync(REFRESH_TOKEN, result.refresh_token)
        uni.setStorageSync(TENANT_CODE, result.tenantCode)

        apiService.getMyProfile().then(res1 => {
          const result1 = res1.data
          uni.setStorageSync(ROLES, result1.data.roles)
          uni.setStorageSync(USER_INFO, result1.data)
          uni.setStorageSync(PERMISSIONS, result1.data.permissions)
          uni.switchTab({
            url: '/pages/course/hottest-course'
          })
          // uni.setStorageSync(PERMISSIONS, covertMenuToMap(res.data.result.menu))
        }).finally(() => {
          this.loading = false
        })
        apiService.getSysConfig().then(res1 => {
          const result1 = res1.data
          uni.setStorageSync(SYS_CONFIG, result1.data)
        })
        // this.rememberMe && uni.setStorageSync(REMEMBER_ME, true)
      }).catch(() => {
        this.loading = false
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
