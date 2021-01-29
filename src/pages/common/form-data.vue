<template>
  <view class="page-content">
    <template v-if="isLoading || dataList.length">
      <view v-for="item in dataList" :key="item.id" class="item" @click="showDetail(item)">
        <view v-for="(value, key, index) in JSON.parse(item.desformDataJson || '{}')"
              :key="index"
              class="item-2">{{ columnInfo[key] }}：{{ value }}
        </view>
      </view>
    </template>
    <no-data v-else/>
    <view v-if="showLoadMore" class="uni-loadmore">{{ loadMoreText }}</view>
  </view>
</template>

<script>
import apiService from '@/services/api'
import NoData from '@/components/no-data'
import { objToParams } from '@/services/utils'
import { INVALID } from '@/services/constant'

export default {
  components: { NoData },
  data() {
    return {
      desformCode: '',
      loadMoreText: '',
      dataList: [],
      pagable: {
        pageNo: 1,
        pageSize: 10
      },
      columnInfo: null,
      hasMore: true,
      showLoadMore: false,
      isLoading: false
    }
  },
  onLoad(options) {
    this.desformCode = options.desformCode
    if (options.desformName) {
      uni.setNavigationBarTitle({
        title: options.desformName || '表单数据'
      })
    }
    this.getDataList(true)
  },
  onPullDownRefresh() {
    this.getDataList(true, true)
  },
  onReachBottom() {
    this.scrollToLower()
  },
  methods: {
    scrollToLower() {
      this.loadMoreText = '加载更多'
      if (!this.hasMore) {
        this.loadMoreText = '没有更多数据了!'
        return
      }
      this.showLoadMore = true
      this.getDataList()
    },
    getDataList(refresh, isPullDownRefresh) {
      const pagable = JSON.parse(JSON.stringify(this.pagable))
      if (refresh) pagable.pageNo = 0
      pagable.pageNo++
      if (!isPullDownRefresh) uni.showLoading()
      this.isLoading = true
      apiService.getFormDataList(this.desformCode, pagable).then(async res => {
        if (!this.columnInfo) {
          const ret = await this.getColumnInfo(this.desformCode)
          if (ret === INVALID) return
          this.columnInfo = ret.desformDesignJson.list.reduce((col, each) => {
            col[each.model] = each.name
            return col
          }, {})
        }

        this.hasMore = pagable.pageNo <= res.data.result.total / res.data.result.size
        this.pagable = pagable
        if (refresh) {
          this.dataList = res.data.result.records
          return
        }
        res.data.result.records.forEach(e => {
          this.dataList.push(e)
        })
      }).finally(() => {
        uni.hideLoading()
        this.loadMoreText = ''
        this.isLoading = false
        uni.stopPullDownRefresh()
      })
    },
    getColumnInfo(desformCode) {
      return new Promise(resolve => {
        apiService.getDesignFormByCode(desformCode).then(res => {
          res.data.result.desformDesignJson = JSON.parse(res.data.result.desformDesignJson || '{}')
          resolve(res.data.result)
        }).catch(() => {
          resolve(INVALID)
        })
      })
    },
    showDetail({ desformCode, desformName, id }) {
      uni.navigateTo({ url: './desform-view' + objToParams({ mode: 'detail', dataId: id, desformCode, desformName }) })
    }
  }
}
</script>

<style lang="scss" scoped>
  page {
    background-color: $uni-bg-color-grey
  }

  /*..page-content {
    background-color: $uni-bg-color-grey;
  }*/

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

  .page-content {
    padding: $uni-spacing-row-lg;
    /*background: $uni-bg-color-grey;*/
    /*height: 100%;*/

    .item {
      margin-bottom: $uni-spacing-row-lg;
      border-radius: upx(16);
      background-color: white;
      padding: $uni-spacing-row-lg;
      box-shadow: 0 0 upx(16) 0 rgba(31, 73, 248, 0.07);
    }

    .item-2 {
      font-size: upx(30);
      padding: upx(20) 0;
      color: $uni-text-color-grey2;
    }

    .item-3 {
      border-top: upx(1) solid $uni-border-color;
      padding-top: upx(20);
      color: $uni-text-color-grey;
    }
  }
</style>
