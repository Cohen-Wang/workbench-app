<template>
  <view class="page-content"/>
</template>

<script>
import apiService from '@/services/api'
import _uni from '@/services/uni'
import { ACCESS_TOKEN, USER_INFO, USER_DEPART, REMEMBER_ME, PERMISSIONS } from '@/services/constant'
import { covertMenuToMap } from '@/services/utils'

export default {
  data() {
    return {
      username: ''
    }
  },
  onLoad(options) {
    console.log('aaaaa')
    this.username = options.username
  },
  onReady() {
    if (!this.username) {
      _uni.showToast('无效的用户名')
      this.goToPwdLogin()
      return
    }
    uni.showLoading({
      title: '正在获取用户权限,请稍后'
    })
    apiService.loginByUsername(this.username.trim()).then(res => {
      this.rememberMe && uni.setStorageSync(REMEMBER_ME, true)
      const result = res.data.result
      uni.setStorageSync(ACCESS_TOKEN, result.token)
      uni.setStorageSync(USER_INFO, result.userInfo)
      uni.setStorageSync(USER_DEPART, result.departs)
      apiService.getUserPermission(result.token).then(res => {
        uni.setStorageSync(PERMISSIONS, covertMenuToMap(res.data.result.menu))
        uni.redirectTo({
          url: '../home/home'
        })
      })
      uni.hideLoading()
    }).catch(() => {
      // _uni.showToast('认证失败, 请重新登录')
      this.goToPwdLogin()
    }).finally(() => {
      uni.hideLoading()
    })
  },
  methods: {
    goToPwdLogin() {
      setTimeout(() => {
        uni.redirectTo({
          url: './login'
        })
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-content {
    background-color: white;
  }
</style>
