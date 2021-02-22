<template>
  <view class="bg-gray">
    <view class="margin-bottom padding bg-red">
      <text class="text-lg">生命周期执行顺序</text>
    </view>
    <view class="padding">
      <view v-for="(item, index) in lifecycle"
            :key="index"
            class="padding bg-white radius margin-bottom">
        <text class="text-bold">{{ item }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Lifecycle',
  data() {
    return {
      lifecycle: []
    }
  },
  onLoad() {
    this.lifecycle.push('onLoad')
  },
  onShow() {
    this.lifecycle.push('onShow')
  },
  created() {
    this.lifecycle.push('created')
  },
  onReady() {
    this.lifecycle.push('onReady')
  },
  mounted() {
    this.lifecycle.push('mounted')
  },
  onHide() {
    this.lifecycle.push('onHide')
  }
}
</script>

<style scoped>

</style>
