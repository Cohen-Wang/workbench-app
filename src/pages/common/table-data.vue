<template>
  <view class="page-content">
    <template v-if="isLoading || dataList.length">
      <view v-for="item in dataList" :key="item.id" class="item" @click="showDetail(item)">
        <view v-for="(value, key, index) in item"
              v-show="columnInfo[key]"
              :key="index"
              class="item-2">
          <text>{{ columnInfo[key] && columnInfo[key].title }}：</text>
          <text v-if="columnInfo[key]&&columnInfo[key].slot==='fileSlot'">
            <a class="table-btn text-cut width-xl" style="color: #0052CC;text-decoration:none;" :href="getHref(value)">下载</a>
          </text>
          <text v-else>{{ value }}</text>
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
// import { objToParams } from '@/services/utils'
import { INVALID } from '@/services/constant'
import { FILE_HOST } from '@/services/constant'
import _uni from '@/services/uni'

export default {
  components: { NoData },
  data() {
    return {
      fileHost: FILE_HOST,
      detail: null,
      loadMoreText: '',
      dataList: [],
      pagable: {
        pageNo: 1,
        pageSize: 10
      },
      columnInfo: null,
      hasMore: true,
      showLoadMore: false,
      isLoading: false,
      title: ''
    }
  },
  mounted() {
  },
  async onLoad(options) {
    if (options.formId) {
      this.detail = {
        id: options.formId
      }
      uni.setNavigationBarTitle({
        title: options.title // 标题
      })
      this.title = options.title
      this.pagable[options.key] = options.title
      return this.getDataList(true)
    }
    if (!options.tableName) return _uni.showToast('参数错误, 请检查表名是否正确')
    this.detail = await this.getDataTableDetail(options.tableName)
    if (this.detail === INVALID) return
    uni.setNavigationBarTitle({
      title: this.detail.tableTxt // 表描述
    })
    this.getDataList(true)
  },
  onPullDownRefresh() {
    this.getDataList(true, true)
  },
  onReachBottom() {
    this.scrollToLower()
  },
  methods: {
    getHref(value) {
      return this.fileHost + value.split(',')[0]
    },
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
      apiService.getTableDataList(this.detail.id, pagable).then(async res => {
        if (!this.columnInfo) {
          const columns = await this.getColumnInfo(this.detail.id)
          if (columns === INVALID) return
          this.columnInfo = columns.reduce((col, each) => {
            col[each.dataIndex] = {
              title: each.title,
              slot: each.scopedSlots ? each.scopedSlots.customRender : ''
            }
            return col
          }, {})
        }
        console.log(this.columnInfo)
        this.hasMore = pagable.pageNo <= res.data.result.total / res.data.result.size
        this.pagable = pagable
        if (refresh) {
          this.dataList = res.data.result.records
          console.log(this.dataList)
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
    getDataTableDetail(tableName) {
      return new Promise(resolve => {
        apiService.getDataTableList({ tableName }).then(res => {
          if (!res.data.result.records.length) {
            _uni.showToast('未找到对应的数据,请检查表名')
            return resolve(INVALID)
          }
          const data = res.data.result.records[0]
          resolve(data)
        }).catch(() => {
          resolve(INVALID)
        })
      })
    },
    getColumnInfo(dataId) {
      return new Promise(resolve => {
        apiService.getOnlineTableColumns(dataId).then(res => {
          // if (!res.data.result.columns.length) {
          //   _uni.showToast('未找到对应的数据,请检查表名')
          //   return resolve(INVALID)
          // }
          const data = res.data.result.columns
          resolve(data)
        }).catch(() => {
          resolve(INVALID)
        })
      })
    },
    showDetail({ xxx }) {
      // uni.navigateTo({ url: './desform-view' + objToParams({ mode: 'detail', dataId: id, desformCode, desformName }) })
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
