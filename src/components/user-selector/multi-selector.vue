<template>
  <view class="cu-modal bottom-modal"
        :class="modalVisible?'show':''"
        @click="modalVisible=false"
        @touchmove.native.stop>
    <view class="cu-dialog" @click.stop.prevent>
      <view class="cu-bar bg-white">
        <view class="action text-grey" @click="modalVisible=false">取消</view>
        <view class="action text-blue" @click="confirmUserSelection">确定</view>
      </view>

      <scroll-view scroll-y class="margin-top-sm" style="height: 50vh;">
        <view class="cu-list menu-avatar">
          <view v-for="(item, index) of userList" :key="index" class="cu-item">
            <view class="cu-avatar round lg"
                  style="background-image:url(../../static/img/default-avatar.jpg);">
              <view class="cu-avatar lg round"
                    :style="'background-image:url('+item.avatar+');'"/>
              <!-- <view class="cu-avatar round lg" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg);"></view> -->
            </view>
            <view class="content">
              <view class="">{{ item.realname }}</view>
              <view class="text-gray text-sm flex">
                <view class="text-cut">
                  <!-- <text class="cuIcon-infofill text-red  margin-right-xs"></text> -->
                  状态: {{ item.status_dictText }}
                </view>
              </view>
            </view>
            <view class="action">
              <!-- <view class="text-grey text-xs">22:20</view>
              <view class="cu-tag round bg-grey sm">5</view> -->
              <checkbox class="round blue" @click="item.checked = !item.checked"/>
            </view>
          </view>
        </view>
        <view class="cu-load" :class="loading?'loading':'over'"></view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { IMAGE_HOST } from '@/services/constant'
import apiService from '@/services/api'

export default {
  name: 'SingleSelector',
  data() {
    return {
      submitForm: {},
      userList: [],
      modalVisible: false,
      loading: false
    }
  },
  mounted() {
    // this.getProcessTaskTransInfo()
  },
  methods: {
    show() {
      this.modalVisible = true
      if (!this.userList.length) {
        this.loading = true
        apiService.getSysUsers({ pageNo: 1, pageSize: 999 }).then(res => {
          this.userList = res.data.result.records.map(e => {
            e.avatar = IMAGE_HOST + e.avatar
            return e
          })
        }).finally(() => {
          this.loading = false
        })
      }
    },
    confirmUserSelection() {
      this.modalVisible = false
      const checkedUsers = this.userList.filter(e => e.checked) || []
      this.$emit('onConfirm', checkedUsers)
      // this.form.ccUserIds = checkedUsers.map(e => e.username).join(',')
      // const ccUserRealNames = checkedUsers.map(e => e.realname).join(',')
      // this.form = Object.assign({}, this.form, { ccUserRealNames })
    }
  }
}
</script>

<style scoped>

</style>
