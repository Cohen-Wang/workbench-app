<template>
  <view class="page-content">
    <cu-custom bg-color="" :is-back="true">
      <block slot="backText">返回</block>
    </cu-custom>
    <view class="logo text-xxl padding-left-xl">重置密码</view>
    <view class="form">
      <view class="form_item">
        <label>
          <input v-model="loginForm.identifier" placeholder="请输入手机号" type="tel">
        </label>
      </view>
      <view class="form_item flex">
        <input v-model="loginForm.vcode" placeholder="请输入短信验证码">
        <text class="uni-icon text-center text-blue"
              style="height: 80upx; line-height: 80upx; width: 200upx"
              type="tel">
          <span v-if="countDownTimer">剩余{{ countDown }}秒</span>
          <span v-else @tap="onClickVCode">获取验证码</span>
        </text>
      </view>
      <view class="form_item">
        <label>
          <input v-model="loginForm.newPassword" type="password" placeholder="请输入新密码">
        </label>
      </view>
      <view class="form_item">
        <label>
          <input v-model="loginForm.reNewPassword" type="password" placeholder="再次请输入新密码">
        </label>
      </view>
      <view class="form_item">
        <button class="cu-btn block bg-blue margin-tb-sm lg" :loading="loading" @tap="handleResetPassword">确定</button>
      </view>
    </view>
  </view>
</template>

<script>
import apiService from '@/services/api'
import _uni from '@/services/uni'

const COUNT_DOWN = 30

export default {
  data() {
    return {
      loading: false,
      loginForm: {},
      countDownTimer: null,
      countDown: COUNT_DOWN
    }
  },
  onLoad() {
  },
  onReady() {
    // 获取app传来的值
  },
  methods: {
    // +-----------------------------------------------------------------------------------------------
    // | 重置密码
    // +-----------------------------------------------------------------------------------------------
    // 点击获取验证码
    onClickVCode() {
      if (!this.loginForm.identifier) return _uni.showToast('请先输入手机号')
      this.getCode()
    },
    // 获取验证码
    getCode() {
      apiService.getCode(this.loginForm.identifier).then(res => {
        if (res.data.code !== 200) return _uni.showToast('获取验证码失败')
        this.countDown = COUNT_DOWN
        this.countDownTimer = setInterval(() => {
          this.countDown--
          if (this.countDown === 0) {
            clearInterval(this.countDownTimer)
            this.countDownTimer = null
          }
        }, 1000)
      })
    },
    // 点击确认重置密码
    handleResetPassword() {
      // 判断手机是否填写
      if (!this.loginForm.identifier) return _uni.showToast('请先输入手机号')
      // 判断验证码是否填写
      if (!this.loginForm.vcode) return _uni.showToast('验证码不能为空')
      // 判断密码是否填写
      if (!this.loginForm.newPassword) return _uni.showToast('新密码不能为空')
      // 判断密码是否一样
      if (this.loginForm.newPassword !== this.loginForm.reNewPassword) return _uni.showToast('密码不一致')
      // 发送
      this.resetPassword()
    },
    // 重置密码
    resetPassword() {
      const param = {
        identifier: this.loginForm.identifier,
        newPassword: this.loginForm.newPassword,
        vcode: this.loginForm.vcode
      }
      apiService.forgetPassword(param).then(res => {
        if (res.data.code !== 200) return _uni.showToast('重置密码失败')
        _uni.showToast('重置密码成功')
        // 重置
        this.loginForm = {}
        // 如果定时器没有关闭，那么手动关闭
        this.countDown = 0
        clearInterval(this.countDownTimer)
        this.countDownTimer = null
        // 返回登录页
        setTimeout(() => {
          uni.navigateTo({
            url: `/pages/login/login`
          })
        }, 1000)
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
    margin: upx(50) 0 upx(70);
    text-align: left;
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
