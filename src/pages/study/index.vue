<template>
  <view>
    <view v-for="(layoutItem, layoutKey) in LAYOUT_CONFIG"
          :key="layoutKey">
      <view class="margin-bottom">
        <view class="padding">
          <text class="text-bold text-xl text-black">{{ layoutKey }}</text>
        </view>
        <view class="grid col-3">
          <view v-for="(item, index) in layoutItem"
                :key="index"
                class="padding-sm">
            <view class="solid padding"
                  @tap="gotoDetail(item.url)">
              <text class="text-center text-cut">{{ item.name }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const LAYOUT_CONFIG = {
  plugin: [
    { name: 'chimee-player', url: `/pages/study/chimee-player` }
  ],
  uniapp: [
    { name: '判断平台', url: `/pages/study/define-platform/index` },
    { name: '生命周期', url: `/pages/study/uniapp/lifecycle` }
  ]
}

export default {
  name: 'StudyIndex',
  data() {
    return {
      LAYOUT_CONFIG
    }
  },
  methods: {
    gotoDetail(url) {
      uni.redirectTo({ url })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
