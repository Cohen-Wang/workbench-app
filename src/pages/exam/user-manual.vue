<template>
  <view class="page-content">
    <view class="bg-white padding">
      <view class="text-xxl text-black bold">{{ examDetail.examinationName || '-/-' }}</view>
      <view class="grid col-2 text-grey margin-top">
        <view>考试时间：{{ examDetail.duration || '-/-' }}分钟</view>
        <view>总分：{{ examDetail.totalScore || '-/-' }}分</view>
      </view>
      <view class="text-lg text-black bold margin-top">注意事项</view>
      <view class="text-grey margin-top" style="word-break: break-all;">{{ examDetail.attention || '-/-' }}</view>
    </view>
    <view class="bg-white padding margin-top">
      <view class="text-lg text-black bold margin-top">相关学习课程</view>
      <navigator v-for="item in examDetail.courseList"
                 :key="item.id"
                 class="text-blue margin-top text-cut"
                 hover-class="none"
                 :url="'/pages/course/course-detail?id='+item.id"
                 open-type="navigate">{{ item.courseName }}
      </navigator>
      <no-data v-show="!examDetail.courseList || !examDetail.courseList.length"/>
    </view>

    <view v-if="canStartExam" class="cu-bar foot bg-white margin-top padding-lr" style="display: block">
      <button class="cu-btn block round bg-blue margin-tb-sm lg" :loading="loading" @click="handleSubmit">开始考试</button>
    </view>
    <color-u-i-dialog-modal ref="colorUIDialogModal"/>
  </view>
</template>

<script>

import apiService from '@/services/api'
import moment from 'dayjs'
import _uni from '@/services/uni'
import NoData from '@/components/no-data'
import ColorUIDialogModal from '@/components/modal/dialog-modal'

export default {
  components: { NoData, ColorUIDialogModal },
  data() {
    return {
      loading: false,
      examId: null,
      examDetail: {
        courseList: []
      },
      canStartExam: false
    }
  },
  onLoad(options) {
    this.examId = options.examId
    this.getExamDetail()
  },
  onReady() {
    // 获取app传来的值
  },
  methods: {
    onItemClick() {
      this.loading = false
    },
    getExamDetail() {
      uni.showLoading()
      apiService.getExamDetail(this.examId).then(res => {
        this.examDetail = res.data.data
        this.checkExamable() // 查询是否可以开始考试
      }).finally(() => {
        uni.hideLoading()
      })
    },
    checkExamable() {
      apiService.getSystemTime().then(res => {
        const currentTime = moment(res.data.data) // 校验考试时间
        if (currentTime.isAfter(this.examDetail.endTime)) return _uni.showToast('考试已结束')
        if (currentTime.isBefore(this.examDetail.startTime)) return _uni.showToast('考试未开始')
        this.canStartExam = true
      })
    },
    // 点击【开始考试】
    async handleSubmit() {
      if (this.examDetail.organize === 0) { // 固定题
        this.onSubmit()
      }
      if (this.examDetail.organize === 1) { // 非固定题
        // 组卷判断
        const param = {
          id: this.examDetail.templateId,
          examinationId: this.examDetail.id
        }
        const flag = await this.checkExam(param)
        if (flag) {
          this.onSubmit() // 成功就考试
        } else {
          this.$refs['colorUIDialogModal'].show({
            title: '提示',
            content: '组卷失败，请联系管理员。',
            confirmText: '确定',
            hideCancel: true,
            onConfirm: () => {
            }
          })
        }
      }
    },
    // 检查考试
    checkExam(param) {
      return new Promise((resolve, reject) => {
        uni.showLoading()
        apiService.checkExam(param).then(res => {
          resolve(res.data.data)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          uni.hideLoading()
        })
      })
    },
    // 进入考试页面
    onSubmit() {
      uni.navigateTo({
        url: `/pages/exam/examing?examId=${this.examId}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-content {
    background-color: $uni-bg-color-grey;
    overflow-y: auto;
  }

</style>
