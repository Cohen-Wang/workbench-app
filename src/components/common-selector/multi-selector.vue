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
        <view class="cu-list menu">
          <view v-for="(item, index) of dataList" :key="index" class="cu-item">
            <view class="content">
              <view class="">{{ item.label }}</view>
            </view>
            <view class="action">
              <!-- <view class="text-grey text-xs">22:20</view>
              <view class="cu-tag round bg-grey sm">5</view> -->
              <checkbox class="round blue" :checked="item.checked" @click="item.checked = !item.checked"/>
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
  name: 'CommonMultiSelector',
  // watch: {
  //   dataList(value) {
  //     console.log(value)
  //   }
  // },
  data() {
    return {
      submitForm: {},
      dataList: [],
      modalVisible: false,
      loading: false
    }
  },
  mounted() {
    // this.getProcessTaskTransInfo()
  },
  methods: {
    show(dataList = []) {
      this.modalVisible = true
      this.dataList = dataList.map(e => {
        e.checked = false
        return e
      })
    },
    confirmUserSelection() {
      this.modalVisible = false
      const checkedData = this.dataList.filter(e => e.checked) || []
      this.$emit('onConfirm', checkedData)
    }
  }
}
</script>

<style scoped>

</style>
