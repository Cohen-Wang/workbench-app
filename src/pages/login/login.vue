<template>
  <view class="">
    <!-- 标题 -->
    <view class="padding-tb-xl padding-lr-xl margin-top-xl">
      <text class="text-xxl text-purple">WHT</text><text class="text-xxl text-blue">工作平台</text>
    </view>
    <!-- 表格 -->
    <view class="form">
      <view class="form_item">
        <label>
          <input v-model="loginForm.username"
                 type="text"
                 placeholder="请输入用户名">
        </label>
      </view>
      <view class="form_item">
        <input v-model="loginForm.password"
               type="password"
               placeholder="请输入密码">
      </view>
      <view class="form_item flex">
        <view class="margin-left-sm text-df flex-sub text-right" @click="resetPwd">忘记密码?</view>
      </view>
      <view class="form_item">
        <button class="cu-btn block bg-blue margin-tb-sm lg"
                :loading="loading"
                @tap="onLogin">
          登&#12288;录
        </button>
      </view>
    </view>
  </view>
</template>

<script>
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

export default {
  data() {
    return {
      loading: false,
      rememberMe: false,
      loginForm: {
        username: 'admin',
        password: '123456'
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
    onLogin() {
      if (!this.loginForm.username.trim() || !this.loginForm.password.trim()) {
        _uni.showToast('请输入用户名和密码')
        return
      }
      const debug = true
      if (debug) {
        _uni.showToast('/pages/study/index')
        uni.switchTab({
          url: '/pages/study/index'
        })
      } else {
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
          }).finally(() => {
            this.loading = false
          })
          apiService.getSysConfig().then(res1 => {
            const result1 = res1.data
            uni.setStorageSync(SYS_CONFIG, result1.data)
          })
        }).catch(() => {
          this.loading = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
  }
</style>
