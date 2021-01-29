<template>
  <div class="no-data">{{ text }}<slot/></div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '暂无数据'
    }
  },
  data() {
    return {}
  },
  // 生命周期 - 创建完成（访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted() {},
  methods: {}
}
</script>
<style lang='scss' scoped>
/* @import url(); 引入css类 */
.no-data {
  text-align: center;
  margin: upx(100)
}
</style>
