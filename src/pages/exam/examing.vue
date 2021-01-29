<template>
  <view class="page-content">
    <!-- 信息区 -->
    <view class="cu-list menu">
      <view class="cu-item">
        <view class="content" @tap="goToAnswerSheet">
          <image src="/static/image/exam/answer-sheet.png" class="png" mode="aspectFit"/>
          <text class="text-grey inline-text">答题卡（{{ curQuestionIndex + 1 }}/{{ answerSheet.length }}）</text>
        </view>
        <view class="content text-right">
          <image src="/static/image/exam/clock.png" class="png" mode="aspectFit"/>
          <text class="text-grey inline-text">{{ displayCountDown }}</text>
        </view>
      </view>
    </view>
    <!-- 试题区 -->
    <view v-if="examRecord.id && answerSheet.length" class="nav-content bg-white margin-lr margin-top margin-bottom padding-lr padding-top">
      <view>
        <questions ref="question"
                   :exam-record-id="examRecord.id"
                   :cur-question-index="curQuestionIndex"
                   :subject-id="curSubjectId"/>
      </view>
    </view>
    <!-- 按钮区 -->
    <view v-if="examRecord.id && countDownTimer" class="cu-bar foot bg-white margin-top padding-lr">
      <button class="cu-btn lg flex-sub round line-blue margin-tb-sm margin-right-sm"
              :loading="loading"
              :disabled="curQuestionIndex === 0"
              @click="saveCurQuestion(1)">上一题
      </button>
      <button v-if="curQuestionIndex === answerSheet.length -1"
              class="cu-btn lg flex-sub round bg-blue margin-tb-sm margin-left-sm"
              :loading="loading"
              @click="onSaveAndSubmit">
        提交
      </button>
      <button v-else
              class="cu-btn lg flex-sub round bg-blue margin-tb-sm margin-left-sm"
              :loading="loading"
              @click="saveCurQuestion(0)">
        下一题
      </button>
    </view>
    <view v-if="!countDownTimer" class="cu-bar foot bg-white margin-top padding-lr">
      <button class="cu-btn lg flex-sub round bg-blue margin-tb-sm margin-left-sm"
              :loading="loading"
              @click="submit">
        提交
      </button>
    </view>
    <!-- 组件 -->
    <color-u-i-dialog-modal ref="colorUIDialogModal"/>
  </view>
</template>

<script>
import apiService from '@/services/api'
import ColorUIDialogModal from '@/components/modal/dialog-modal'
import moment from 'dayjs'
import questions from './components/questions'
import duration from 'dayjs/plugin/duration'
import _uni from '@/services/uni'
import { USER_INFO } from '@/services/constant'

export default {
  components: { questions, ColorUIDialogModal },
  filters: {
    questionType(type) {}
  },
  data() {
    return {
      loading: false,
      questionType: {
        0: '单选题',
        1: '简答题',
        2: '判断题',
        3: '多选题',
        4: '解答题',
        5: '画图题'
      },
      myProfile: uni.getStorageSync(USER_INFO),
      countDownTimer: null,
      displayCountDown: null,
      examId: null,
      examDetail: {
        courseList: []
      },
      answerSheet: [],
      examRecord: {},
      curQuestionIndex: 0,
      curSubjectId: '',
      canStartExam: false,
      isExamFinished: false // 是否完成了考试，否则不允许退出页面
    }
  },
  onLoad(options) {
    moment.extend(duration)
    this.examId = options.examId
    this.getExamDetail()
    // this.getAnswerSheet()
  },
  onReady() {
    uni.$off('switchQuestion')
    uni.$on('switchQuestion', res => {
      setTimeout(() => {
        const { item } = res
        this.curQuestionIndex = item.myIndex
        this.curSubjectId = this.answerSheet[this.curQuestionIndex].subjectId
        _uni.showToast(`已切换至第${item.myIndex + 1}题`)
      }, 300)
    })
  },
  onUnload() {
    // 清除监听
    uni.$off('switchQuestion')
    if (this.countDownTimer) clearInterval(this.countDownTimer)
  },
  onBackPress(options) {
    if (!this.isExamFinished) {
      this.$refs['colorUIDialogModal'].show({
        title: '提示',
        content: '正在考试中。如要退出，请先提交试卷。',
        confirmText: '确定',
        hideCancel: true,
        onConfirm: () => {}
      })
      return true
    }
  },
  methods: {
    startCountDown(milliseconds) {
      let seconds = milliseconds / 1000
      let countMoment = moment.duration(seconds, 'seconds')
      this.displayCountDown = `${this.padStart(countMoment.hours())}:${this.padStart(countMoment.minutes())}:${this.padStart(countMoment.seconds())}`
      this.countDownTimer = setInterval(() => {
        countMoment = moment.duration(--seconds, 'seconds')
        if (seconds <= 0) {
          clearInterval(this.countDownTimer)
          this.countDownTimer = null
          _uni.showToast('考试时间已结束')
          return
          // @TODO 考试结束, 自动交卷
        }
        this.displayCountDown = `${this.padStart(countMoment.hours())}:${this.padStart(countMoment.minutes())}:${this.padStart(countMoment.seconds())}`
      }, 1000)
    },
    padStart(str) {
      return str.toString().padStart(2, '00')
    },
    getExamDetail() {
      uni.showLoading()
      apiService.getExamDetail(this.examId).then(res => {
        this.examDetail = res.data.data
        this.startExam() // 开始考试
      }).finally(() => {
        uni.hideLoading()
      })
    },
    checkExamable() {
      apiService.getSystemTime().then(res => {
        const currentTime = moment(res.data.data) // 校验考试时间
        if (currentTime.isAfter(this.examDetail.endTime)) return _uni.showToast(this, '考试已结束')
        if (currentTime.isBefore(this.examDetail.startTime)) return _uni.showToast(this, '考试未开始')
        this.canStartExam = true
      })
    },
    startExam() {
      apiService.startExam(this.examId, this.myProfile.id).then(res => {
        this.examRecord = res.data.data.examRecord
        this.getAnswerSheet()

        // const timePast = moment.duration(moment().valueOf() - this.examRecord.startTime).seconds()
        const shouldEndTime = this.examRecord.startTime + this.examDetail.duration * 60 * 1000
        this.startCountDown(shouldEndTime - moment().valueOf()) // 开始考试后再开始计时
      }).catch(e => {
        if (e.data.code === 4010) this.errorConfirm(e.data.data)
        console.log(e)
      })
    },
    getAnswerSheet() {
      apiService.getAnswerSheet(this.examId, this.myProfile.id, this.examRecord.id).then(res => {
        this.answerSheet = res.data.data
        this.curQuestionIndex = 0
        this.$nextTick(() => {
          this.curSubjectId = this.answerSheet[this.curQuestionIndex].subjectId
        })
      })
    },
    goToAnswerSheet() {
      uni.navigateTo({
        url: `/pages/exam/answer-sheet?examId=${this.examId}&examRecordId=${this.examRecord.id}`
      })
    },
    saveCurQuestion(nextType) {
      return new Promise(resolve => {
        // nextType = 0：下一题，1：上一题，2：提交
        // nextSubjectId = 下一题的题目id
        // nextSubjectType = 下一题的类型，选择题、判断题
        let nextIndex
        if (nextType === 0) nextIndex = this.curQuestionIndex + 1
        if (nextType === 1) nextIndex = this.curQuestionIndex - 1
        const answer = this.$refs['question'].answer.answer
        const answerId = this.$refs['question'].answer.id
        const startTime = this.$refs['question'].answer.startAnswerTime
        if (!answer) _uni.showToast('您还未作答哟')
        const param = {
          nextType
        }
        if (this.answerSheet[nextIndex]) {
          param.nextSubjectId = this.answerSheet[nextIndex].subjectId
          param.nextSubjectType = this.answerSheet[nextIndex].type
        }

        const data = {
          answer,
          examRecordId: this.examRecord.id,
          examinationId: this.examDetail.id,
          id: answerId,
          startTime,
          subjectId: this.answerSheet[this.curQuestionIndex].subjectId,
          type: this.answerSheet[this.curQuestionIndex].type,
          userId: this.myProfile.id
        }
        apiService.saveAndGetNext(param, data).then(res => {
          if (nextType === 0 && this.answerSheet[this.curQuestionIndex + 1]) {
            this.curSubjectId = this.answerSheet[++this.curQuestionIndex].subjectId
          }
          if (nextType === 1 && this.answerSheet[this.curQuestionIndex - 1]) {
            this.curSubjectId = this.answerSheet[--this.curQuestionIndex].subjectId
          }
          resolve('OK')
        }).catch(e => {
          resolve('NOT_OK')
        })
      })
    },
    // +----------------------------------------------------------------------------------------------------------------
    // | 提交
    // +----------------------------------------------------------------------------------------------------------------
    // 点击提交
    onSaveAndSubmit() {
      apiService.getAnswerSheet(this.examId, this.myProfile.id, this.examRecord.id).then(res => {
        this.answerSheet = res.data.data
        const alreadyDone = this.answerSheet.filter(e => e.selectAnswer.answer !== '' && e.selectAnswer.answer !== null).length
        this.$refs['colorUIDialogModal'].show({
          title: '提交试卷',
          content: `试卷共有[${this.answerSheet.length}]道可做题，已完成[${alreadyDone}]道题。确认要交卷吗？`,
          confirmText: '确定交卷',
          cancelText: '再检查一下',
          onConfirm: () => {
            this.saveAndSubmit()
          },
          onCancel: () => {}
        })
      })
    },
    // 提交接口
    async saveAndSubmit() {
      // TODO 暂时保留
      // const ret = await this.saveCurQuestion(0)
      // console.log('ret', ret)
      // if (ret !== 'OK') return
      this.submit()
    },
    submit() {
      apiService.submitExam(this.examRecord.id, this.examDetail.id, this.myProfile.id).then(res => {
        this.isExamFinished = true
        uni.navigateTo({
          url: `/pages/my/exam-record?switchTab=/pages/exam/exam-center`
        })
      })
    },
    errorConfirm(content) {
      this.$refs['colorUIDialogModal'].show({
        title: '提示',
        confirmText: '返回',
        content,
        hideCancel: true,
        onCancel: () => {
          uni.navigateBack()
        },
        onConfirm: () => {
          uni.navigateBack()
        }
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
