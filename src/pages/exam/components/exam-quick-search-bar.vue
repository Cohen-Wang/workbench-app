<template>
  <view class="bg-blue">
    <view class="cu-bar search bg-white border_top">
      <view class="search-form round">
        <text class="cuIcon-search"/>
        <input v-model="queryParam.examinationName"
               :adjust-position="false"
               type="text"
               placeholder="搜索考试名称"
               confirm-type="search"
               @blur="changeQuery('考试名称')"
               @confirm="changeQuery('考试名称')">
      </view>
    </view>
    <view class="cu-bar search bg-white text-xdf text-grey" style="min-height: 50upx;">
      <view class="action"
            :class="[searchScope==='我的'?'text-orange text-bold':'']"
            style="width: 80upx"
            @click="changeQuery('我的')">
        <text>我的</text>
      </view>
      <view class="action"
            :class="[searchScope==='最新发布'?'text-orange text-bold':'']"
            style="width: 160upx"
            @click="changeQuery('最新发布')">
        <text>最新发布</text>
      </view>
      <!--<view class="action"
            :class="[searchScope==='参与人数'?'text-orange text-bold':'']"
            style="width: 160upx"
            @click="changeQuery('参与人数')">
        <text>参与人数</text>
      </view>-->
      <view class="action flex-sub"
            :class="[searchScope==='考试分类'?'text-orange text-bold':'']"
            style="justify-content: left; padding-left: 20upx"
            @click="changeQuery('考试分类')">
        <text>{{ queryParam.categoryName || '考试分类' }}</text>
        <text class="cuIcon-triangledownfill"/>
      </view>
      <!--        <view class="picker">asdasd</view>-->
    </view>
    <lb-picker ref="picker1"
               class="text-black"
               mode="multiSelector"
               :list="examCategory"
               :level="2"
               :props="{ label: 'categoryName',value: 'id', children: 'children' }"
               @confirm="onPicker"/>
  </view>
</template>

<script>

import LbPicker from '@/components/lb-picker'
import { USER_INFO } from '@/services/constant'

export default {
  name: 'ExamQuickSearchBar',
  components: { LbPicker },
  props: {
    examCategory: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      searchScope: '我的',
      queryParam: {},
      myProfile: uni.getStorageSync(USER_INFO)
    }
  },
  mounted() {
  },
  methods: {
    onPicker({ index, item, value, change }) {
      const queryParam = { userId: this.myProfile.id, status: 0 }
      queryParam.categoryId = item[1].id
      queryParam.categoryName = item[1].categoryName
      if (item[1].categoryName === '我的') {
        queryParam.categoryId = item[0].id
        queryParam.categoryName = item[0].categoryName
      }
      this.searchScope = '考试分类'
      this.queryParam = queryParam
      this.tryEmit()
    },
    changeQuery(searchScope) {
      // this.tasks[this.curTab].searchScope = searchScope
      if (searchScope === '考试分类') return this.$refs.picker1.show()
      let queryParam = { userId: this.myProfile.id, status: 0 }
      if (searchScope === '考试名称') {
        searchScope = '我的'
        queryParam = { ...queryParam, examinationName: this.queryParam.examinationName }
      }
      if (searchScope === '最新发布') {
        queryParam = { ...queryParam, sort: 'create_date', order: ' desc' }
      }
      // if (searchScope === '参与人数') {
      //   queryParam = { ...queryParam, number: 1 }
      // }
      this.queryParam = queryParam
      this.searchScope = searchScope
      this.tryEmit()
    },
    tryEmit() {
      this.$emit('change', this.queryParam)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
