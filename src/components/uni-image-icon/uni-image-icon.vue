<template>
  <image :src="'/static/image-icon/'+name+'.png'" class="image-icon" :style="{width: size, height:size}"/>
</template>

<script>
export default {
  name: 'image-iconfont',
  props: {
    name: {
      type: String,
      default: 'zanwushuju'
    },
    size: {
      type: String,
      default: '64upx'
    }
  },
  data() {
    return {
      msg: 'loading......'
    }
  }
}
</script>

<style lang="scss" scoped>
  .image-icon {
    width: upx(64);
    height: upx(64);
  }
</style>
