<template>
  <view class="root">
    <view class="padding">
      <view class="bg-white margin-bottom radius">
        <view class="padding-sm border-bottom">
          <text>H5</text>
        </view>
        <view class="padding-sm">
          <view>
            <button class="cu-btn bg-blue block">点&#12288;我</button>
          </view>
        </view>
      </view>

      <view class="bg-white margin-bottom radius">
        <view class="padding-sm border-bottom">
          <text>APP</text>
        </view>
        <view class="padding-sm">
          <view>
            <button class="cu-btn bg-blue block">点&#12288;我</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      a: 1
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      // #ifdef H5
      console.log('只有H5平台才有alert方法')
      // #endif

      // #ifdef APP
      console.log('只有APP平台才有alert方法')
      // #endif
    }
  }
}
</script>

<style lang="scss" scoped>
.root {
  height: 100%;
  background-color: #F5F8FA;
}
</style>
