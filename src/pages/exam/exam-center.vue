<template>
  <view class="page-content">
    <status-bar class="bg-blue"/>
    <scroll-view scroll-x class="segment-bar bg-blue nav padding-bottom-sm">
      <view class="flex text-center text-lg">
        <view v-for="(value,key,index) in exam"
              :key="index"
              class="cu-item flex-sub"
              :class="key===curTab?'cur':''"
              @click="tabSelect(key)">
          {{ key }}
        </view>
      </view>
    </scroll-view>

    <exam-quick-search-bar v-show="curTab === '正式考试'" :exam-category="examCategory" @change="onQuickSearchChange"/>
    <exam-quick-search-bar v-show="curTab === '模拟考试'" :exam-category="examCategory" @change="onQuickSearchChange"/>

    <view class="nav-content">
      <scroll-view v-show="curTab === '正式考试'"
                   scroll-y
                   class="scroll-view"
                   refresher-enabled
                   refresher-background="white"
                   :refresher-triggered="exam['正式考试'].refresherTriggered"
                   @refresherrefresh="getDataList(true,true)">
        <!--        @scrolltolower="scrollToLower"-->
        <template v-if="exam['正式考试'].data.length">
          <!--          <view v-if="showLoadMore" class="uni-loadmore">{{ loadMoreText }}</view>-->
          <exam-list :exam-list="exam['正式考试'].data"/>
        </template>
        <no-data v-else text="你当前暂无考试的数据"/>
      </scroll-view>
      <scroll-view v-show="curTab === '模拟考试'"
                   scroll-y
                   class="scroll-view"
                   refresher-enabled
                   refresher-background="white"
                   :refresher-triggered="exam['模拟考试'].refresherTriggered"
                   @refresherrefresh="getDataList(true,true)">
        <!--        @scrolltolower="scrollToLower"-->
        <template v-if="exam['模拟考试'].data.length">
          <view v-if="showLoadMore" class="uni-loadmore">{{ loadMoreText }}</view>
          <exam-list :exam-list="exam['模拟考试'].data"/>
        </template>
        <no-data v-else text="你当前暂无考试的数据"/>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import apiService from '@/services/api'
import _uni from '@/services/uni'
import StatusBar from '@/components/status-bar/status-bar'
import NoData from '@/components/no-data'
import ExamQuickSearchBar from './components/exam-quick-search-bar'
import ExamList from './components/exam-list'
import { USER_INFO } from '@/services/constant'

export default {
  components: { StatusBar, NoData, ExamList, ExamQuickSearchBar },
  data() {
    return {
      curTab: '正式考试',
      searchValue: '',
      exam: {
        '正式考试': {
          data: [],
          hasMore: true,
          refresherTriggered: false,
          queryParam: {
            // pageNo: 1,
            // pageSize: 9999
          },
          type: 0 // 0 正式考试
        },
        '模拟考试': {
          data: [],
          hasMore: true,
          refresherTriggered: false,
          queryParam: {
            // pageNo: 1,
            // pageSize: 9999
          },
          type: 1 // 1 模拟考试
        }
      },
      examCategory: [],
      loadMoreText: '',
      showLoadMore: false
    }
  },
  onReady() {
    uni.$off('processOK')
    uni.$on('processOK', res => {
      setTimeout(() => {
        _uni.showToast('审批成功')
        this.getDataList(true, true)
      }, 300)
    })
  },
  onUnload() {
    // 清除监听
    uni.$off('switchQuestion')
  },
  onLoad(options) {
    this.getCategory()
  },
  onShow() {
    this.getDataList(true)
  },
  onReachBottom() {
    console.log('onReachBottom')
    // this.scrollToLower()
  },
  methods: {
    getCategory() {
      apiService.getExaminationCategory().then(res => {
        res.data.forEach(e => {
          e.children = [{ id: e.id, categoryName: '全部' }, ...e.children]
        })
        this.examCategory = res.data
      })
    },
    onQuickSearchChange(queryParam) {
      console.log(queryParam)
      this.exam[this.curTab].queryParam = queryParam
      this.getDataList(true)
    },
    scrollToLower() {
      this.loadMoreText = '加载更多'
      if (!this.exam[this.curTab].hasMore) {
        this.loadMoreText = '没有更多数据了!'
        return
      }
      this.showLoadMore = true
      this.getDataList()
    },
    tabSelect(tabLabel) {
      this.curTab = tabLabel
      if (!this.exam[this.curTab].data.length) this.getDataList()
    },
    getDataList(refresh, isPullDownRefresh) {
      if (this.exam[this.curTab].refresherTriggered) return
      // const pagable = JSON.parse(JSON.stringify(this.exam[this.curTab].pagable))
      // if (refresh) pagable.pageNo = 1
      // pagable.pageNo++
      if (!isPullDownRefresh) uni.showLoading()
      if (isPullDownRefresh) {
        this.exam[this.curTab].refresherTriggered = true
      }
      const queryParam = {
        ...this.exam[this.curTab].queryParam,
        type: this.exam[this.curTab].type,
        userId: uni.getStorageSync(USER_INFO).id
      }
      apiService.getExaminationList(queryParam).then(res => {
        // this.exam[this.curTab].hasMore = pagable.pageNo <= res.data.result.total / res.data.result.size
        // this.exam[this.curTab].pagable = pagable
        if (refresh) {
          this.exam[this.curTab].data = res.data.list || []
          return
        }
        res.data.list.forEach(e => {
          this.exam[this.curTab].data.push(e)
        })
      }).finally(() => {
        console.log(this.exam)
        this.exam[this.curTab].refresherTriggered = false
        console.log(this.exam)
        uni.hideLoading()
        this.loadMoreText = ''
        // uni.stopPullDownRefresh()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .page-content {
    background: white;
  }

  // #ifdef APP-PLUS
  /*.fixed-bar {*/
  /*  position: fixed;*/
  /*  z-index: 500;*/
  /*  top: 0;*/
  /*}*/

  // #endif

  // #ifdef H5
  /*.fixed-bar {*/
  /*  position: fixed;*/
  /*  z-index: 500;*/
  /*  top: calc(88upx + constant(safe-area-inset-top));*/
  /*  top: calc(88upx + env(safe-area-inset-top));*/
  /*}*/

  // #endif

  // .uni-page-refresh {
  //     margin-top: calc(88upx + constant(safe-area-inset-top));
  // }
  .nav-content {
    height: calc(100% - #{upx(330)});
    max-height: calc(100% - #{upx(330)});
    background: white;
  }

  .border_top {
    border-top-left-radius: upx(32);
    border-top-right-radius: upx(32);
    background: white;
  }

  .scroll-view {
    /*padding-top: 176upx ;*/
    /*margin: calc(88upx + 20upx) $uni-spacing-row-lg $uni-spacing-row-lg;*/
    height: 100%;
  }

</style>
