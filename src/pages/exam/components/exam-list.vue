<template>
  <view>
    <view class="cu-card article no-card bg-white padding-top-xs">
      <view v-for="(item) in examList"
            :key="item.id"
            class="cu-item shadow"
            @tap="gotoDetail(item)">
        <!-- :url="'/pages/exam/answer-sheet?examId='+item.id"-->
        <view class="padding-lr">
          <view class="flex">
            <view class="flex-sub" style="position: relative;">
              <view class="bg-img"
                    style="width: 200upx; min-height: 200upx;"
                    :style="`background-image: url('${PREVIEW_HOST + item.avatarId}')`"/>
              <!-- 考试记录 -->
              <view v-if="type === 'record' && item.submitStatus === 3" class="cu-tag sm status-tag bg-green">已批改</view>
              <view v-else-if="type === 'record' && item.submitStatus !== 3" class="cu-tag sm status-tag bg-red">未批改</view>
              <!-- 考试中心 -->
              <view v-if="type !== 'record'" class="exam-limit text-center">
                {{ !!item.sureNumber ? `考试次数${item.alreadyNumber || 0}/${item.sureNumber}` : `不限制次数` }}
              </view>
            </view>
            <view class="flex-treble">
              <view class="padding-left padding-right" style="max-width: 500upx;">
                <view class="margin-bottom-xs">
                  <view class="">{{ item.examinationName }}</view>
                </view>
                <view class="margin-bottom-xs">
                  <view style="max-width: 100%;"
                        class="cu-btn sm bg-blue light round">
                    <text class="text-cut">{{ item.categoryName }}</text>
                  </view>
                </view>
                <view class="margin-bottom-xs">
                  <view v-if="item.isExaming"
                        style="max-width: 100%;"
                        class="cu-btn sm bg-orange light round">
                    <text class="text-cut">继续考试</text>
                  </view>
                  <view v-else><view style="visibility: hidden;">1</view></view>
                </view>
                <view v-if="type === 'record'" class="text-gray">
                  <view class="">考试时间: {{ item.startTime | yearFilter }}/{{ item.startTime | timeFilter }}</view>
                </view>
                <view v-else class="text-gray">
                  <view class="">
                    <text class="text-cut">{{ item.startTime | yearFilter }}年 {{ item.startTime | timeFilter }} 至 {{ item.endTime | timeFilter }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!-- 暂时不用 -->
        <view v-if="0" class="content bg-yellow">
          <view style="width: 100px; height: 100px; box-sizing: border-box;border: 1px solid red;">
            <image :src="PREVIEW_HOST + item.avatarId" mode="aspectFill"/>
          </view>
          <!-- 考试记录 -->
          <view v-if="type === 'record' && item.submitStatus === 3" class="cu-tag sm status-tag bg-green">已批改</view>
          <view v-else-if="type === 'record' && item.submitStatus !== 3" class="cu-tag sm status-tag bg-red">未批改</view>
          <!-- 考试中心 -->
          <view v-if="type !== 'record'" class="exam-limit">
            {{ !!item.sureNumber ? `考试次数${item.alreadyNumber || 0}/${item.sureNumber}` : `不限制次数` }}
          </view>
          <view class="desc" style="width: 400upx;">
            <view class="margin-bottom-xs">
              <view class="">{{ item.examinationName }}</view>
            </view>
            <view class="margin-bottom-xs">
              <view style="max-width: 100%; " class="text-blue text-cut">{{ item.categoryName }}</view>
            </view>
            <view class="margin-bottom-xs">
              <view v-if="item.isExaming" class="text-orange text-cut">继续考试</view>
            </view>
            <view v-if="type === 'record'" class="text-gray">
              <view class="">考试时间: {{ item.startTime | yearFilter }}/{{ item.startTime | timeFilter }}</view>
            </view>
            <view v-else class="text-gray">
              <view class="">{{ item.startTime | yearFilter }}年 {{ item.startTime | timeFilter }} 至 {{ item.endTime | timeFilter }}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="text-center margin-bottom margin-top text-grey">没有更多数据了</view>
    </view>
  </view>
</template>

<script>
import { PREVIEW_HOST } from '@/services/constant'
import moment from 'dayjs'
import _uni from '@/services/uni'

export default {
  name: 'ExamList',
  filters: {
    examTypeFilter(type) {
      const typeMap = {
        0: '正式考试',
        1: '模拟考试',
        2: '在线练习',
        3: '调查问卷'
      }
      return typeMap[type]
    },
    yearFilter(time) {
      return moment(time).format('YYYY')
    },
    timeFilter(time) {
      return moment(time).format('MM/DD hh:mm')
    }
  },
  props: {
    examList: {
      type: Array,
      default: () => {
        return []
      }
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      PREVIEW_HOST,
      searchValue: ''
    }
  },
  onLoad() {
  },
  mounted() {
    console.log(this.examList)
  },
  onShow() {
  },
  methods: {
    gotoDetail(item) {
      if (this.type === 'record') {
        // if (item.submitStatus !== 3) return _uni.showToast('未批改，不能查看详情。') // 未批改，提示
        return uni.navigateTo({ url: '/pages/my/exam-record-detail?examId=' + item.id }) // 已批改，跳转
      }
      if (this.type !== 'record') {
        if (!!item.sureNumber && item.alreadyNumber >= item.sureNumber) return _uni.showToast('该考试已达到上限次数，不能再考。')
      }
      uni.navigateTo({ url: '/pages/exam/user-manual?examId=' + item.id })
    },
    goToMessage() {
      uni.navigateTo({ url: '/pages/user-announcement/user-announcement' })
    }
  }
}
</script>

<style scoped lang="scss">
  .cu-card.article > .cu-item .content {
    position: relative;
  }

  .cu-card.article > .cu-item .content .text-content {
    color: $uni-text-color;
    height: 1.4em;
  }

  .cu-card.article > .cu-item .content > uni-image {
    /*height: 7em;*/
    width: 100px;
  }

  .status-tag {
    position: absolute;
    top: upx(10);
    left: upx(10);
  }

  .exam-limit {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    color: #FFFFFF;
    line-height: upx(40);
    font-size: upx(26);
  }
</style>
