<template>
  <view>
    <view class="margin-bottom">
      <view class="flex">
        <view class="flex-sub">
          <view class="cu-tag round bg-blue light text-blue">{{ questionType[question.type] }}</view>
        </view>
        <view class="flex-sub">
          <view class="flex justify-end">
            <view v-if="type !== 'record'"
                  class="cu-btn icon sm"
                  :class="{ 'bg-orange': question.answer && question.answer.tag, 'line-orange': question.answer && !question.answer.tag }"
                  @click="onMarkSubject(question.answer.id)">
              <view class="cuIcon-newshot"/>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view>
      <text class="text-bold text-lg">{{ curQuestionIndex + 1 }}. &#12288;</text>
      <text class="v-html text-bold text-lg" v-html="!question.subject ? question.subjectName : question.subject.subjectName"/>
      <text class="text-bold text-lg">（{{ !question.subject ? question.score : question.subject.score }}分）</text>
    </view>

    <!-- 单选题-->
    <radio-group v-if="question.type === 0" class="block" @change="singleOptionChange">
      <view class="cu-list menu text-left">
        <view v-for="(item, index) in options" :key="index" class="cu-item">
          <label class="flex justify-start align-center flex-sub">
            <view class="margin-right">{{ item.optionName }}</view>
            <radio class="blue round"
                   style="transform: scale(0.7);"
                   :value="item.optionName"
                   :class="item.checked?'checked':''"
                   :checked="answer.answer===item.optionName"
                   :disabled="type === 'record'"/>
            <view class="margin-left v-html" v-html="item.optionContent"/>
          </label>
        </view>
      </view>
    </radio-group>

    <!-- 多选题 -->
    <checkbox-group v-if="question.type === 3" class="block" @change="checkboxChange">
      <view class="cu-list menu text-left">
        <view v-for="(item, index) in options" :key="index" class="cu-item">
          <label class="flex justify-start align-center flex-sub">
            <view class="margin-right">{{ item.optionName }}</view>
            <checkbox class="blue round"
                      style="transform: scale(0.7);"
                      :value="item.optionName"
                      :class="answer.answer&&answer.answer.includes(item.optionName)?'checked':''"
                      :checked="answer.answer&&answer.answer.includes(item.optionName)"
                      :disabled="type === 'record'"/>
            <view class="margin-left v-html" v-html="item.optionContent"/>
          </label>
        </view>
      </view>
    </checkbox-group>

    <!-- 判断题-->
    <radio-group v-if="question.type === 2" class="block" @change="singleOptionChange">
      <view class="cu-list menu text-left">
        <view v-for="(item, index) in [{value:'正确'},{value:'错误'}]" :key="index" class="cu-item">
          <label class="flex justify-start align-center flex-sub">
            <radio class="blue round"
                   style="transform: scale(0.7);"
                   :value="item.value"
                   :class="item.checked?'checked':''"
                   :checked="answer.answer===item.value"
                   :disabled="type === 'record'"/>
            <view class="margin-left">{{ item.value }}</view>
          </label>
        </view>
      </view>
    </radio-group>

    <!-- 简答题 -->
    <view v-if="question.type === 1" class="margin-top">
      <view v-if="type==='record'" class="margin-bottom" v-html="answer.answer"/>
      <textarea v-else
                :value="answer.answer"
                maxlength="-1"
                placeholder="多行文本输入框"
                :disabled="type === 'record'"
                @input="textareaChange"/>
    </view>

    <!-- 解答题 -->
    <view v-if="question.type === 4" class="margin-top">
      <view v-if="type==='record'" class="margin-bottom"/><!--v-html="answer.answer"-->
      <view v-else>
        <view class="margin-bottom">
          <view class="text-grey text-sm">该题目请于线下完成，如其他题目已完成，可提交试卷。</view>
        </view>
        <view class="margin-bottom">
          <view class="bg-blue light">
            <view class="padding-tb-sm padding-lr-xs">
              <text class="cuIcon-notificationfill margin-right"/>
              <text>您可以通过考试记录查阅该题目，或将题目拍照或截屏存留，方便线下查阅。</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 画图题 -->
    <view v-if="question.type === 5" class="margin-top">
      <view v-if="type==='record'" class="margin-bottom"/><!--v-html="answer.answer"-->
      <view v-else>
        <view class="margin-bottom">
          <view class="text-grey text-sm">该题目请于线下完成，如其他题目已完成，可提交试卷。</view>
        </view>
        <view class="margin-bottom">
          <view class="bg-blue light">
            <view class="padding-tb-sm padding-lr-xs">
              <text class="cuIcon-notificationfill margin-right"/>
              <text>您可以通过考试记录查阅该题目，或将题目拍照或截屏存留，方便线下查阅。</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="type === 'record'" class="tips">
      <view v-if="submitStatus === 3" class="">
        <view>
          <text class="right">正确答案：<text class="v-html" v-html="answer.answer || ''"/></text>
        </view>
        <template v-if="(question.type === 4 || question.type === 5) && question.subject.answerImgs">
          <view v-for="(imageId, imageIndex) in question.subject.answerImgs.split(',')"
                :key="imageIndex"
                class="bg-img bg-mask flex align-center margin-bottom"
                :style="{ backgroundImage: `url(${PREVIEW_HOST}${imageId})` }"
                style="height: 220px; width: 100%;"/>
        </template>
      </view>
      <view class="answer">
        <text class="user">考生答案：<text class="v-html" v-html="question.answer || ''"/></text>
      </view>
      <view class="answer">
        <text class="status" :class="{ error: question.answerType }">{{ question.answerType ? '错误' : '正确' }}</text>
      </view>
      <view v-if="submitStatus === 3" class="analysis">
        <view>
          <text>解析：<text class="v-html" v-html="question.subject.analysis"/></text>
        </view>
        <template v-if="(question.type === 4 || question.type === 5) && question.subject.analysisImgs">
          <view v-for="(imageId, imageIndex) in question.subject.answerImgs.split(',')"
                :key="imageIndex"
                class="bg-img bg-mask flex align-center margin-bottom"
                :style="{ backgroundImage: `url(${PREVIEW_HOST}${imageId})` }"
                style="height: 220px; width: 100%;"/>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import apiService from '@/services/api'
import moment from 'dayjs'
import { PREVIEW_HOST } from '@/services/constant'
import _uni from '@/services/uni'

export default {
  name: 'Question',
  filters: {},
  props: {
    examRecordId: {
      type: String,
      required: true,
      default: ''
    },
    subjectId: {
      type: String,
      required: true,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    // 考试记录：是否批改
    submitStatus: {
      type: Number,
      default: 0
    },
    curQuestionIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      PREVIEW_HOST,
      questionType: {
        0: '单选题',
        1: '简答题',
        2: '判断题',
        3: '多选题',
        4: '解答题',
        5: '画图题'
      },
      question: {
        subject: {}
      },
      options: [],
      answer: { answer: '' }
    }
  },
  watch: {
    subjectId(val, oldVal) {
      console.log(val, oldVal)
      this.answer = { answer: '' }
      if (this.type === 'record') {
        return this.getQuestionBySubjectId()
      }
      // const apiMethod = this.type === 'record' ? apiService.getQuestionBySubjectId : apiService.getQuestionById
      this.getQuestionById()
    }
  },
  methods: {
    getQuestionBySubjectId() {
      uni.showLoading()
      apiService.getQuestionBySubjectId(this.examRecordId, this.subjectId).then(res => {
        this.question = res.data.data
        this.options = this.question.subject.options || []
        this.answer = this.question.subject.answer
      }).finally(_ => {
        uni.hideLoading()
      })
    },
    getQuestionById() {
      apiService.getQuestionById(this.examRecordId, this.subjectId).then(res => {
        this.question = res.data.data
        this.options = this.question.options || []
        this.answer = this.question.answer
        this.answer.startAnswerTime = moment().format()
        console.log(moment().format())
      })
    },
    checkboxChange(event) {
      // const answer = []
      // this.options = this.options.map((each, index) => {
      //   each.checked = event.detail.value.includes(String(index))
      //   if (each.checked) answer.push(each.optionName)
      //   return each
      // })
      const answer = event.detail.value
      this.answer.answer = answer.join(',')
    },
    singleOptionChange(event) {
      this.answer.answer = event.detail.value
      console.log(this.answer.answer)
    },
    textareaChange(event) {
      this.answer.answer = event.detail.value
      console.log(this.answer.answer)
    },
    goToMessage() {
      uni.navigateTo({ url: '/pages/user-announcement/user-announcement' })
    },
    // +----------------------------------------------------------------------------------------------------------------
    // | 标记试题
    // +----------------------------------------------------------------------------------------------------------------
    // 标记试题
    async onMarkSubject(id) {
      const param = {
        id: id,
        tag: !this.question.answer.tag // 取否
      }
      const result = await this.markSubject(param)
      if (!result) _uni.showToast('标记失败')
      _uni.showToast(this.question.answer.tag === false ? '标记成功' : '取消标记成功')
      this.getQuestionById()
    },
    // 标记试题的接口
    markSubject(param) {
      return new Promise((resolve, reject) => {
        uni.showLoading()
        apiService.markSubject(param).then(res => {
          resolve(res.data.data)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          uni.hideLoading()
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .cu-item {
    padding: 0 !important;
  }

  .v-html {
    /deep/ p {
      display: contents;
    }
  }
  .tips {
    border-top: 1px solid #E8E8E8;
    padding-top: upx(10);
    font-size: upx(32);
    .right {
      display: flex;
      align-items: center;
    }
    .answer {
      display: flex;
      justify-content: space-between;
      color: #444444;
      margin: upx(20) 0;
      .status {
        color: #3283FC;
      }
      .error {
        color: #FA5C23;
      }
    }
    .analysis {
      > text {
        display: flex;
        align-items: center;
      }
      color: #999999;
      margin: upx(10) 0;
    }
  }
  /deep/p {
    display: inline;
  }
</style>
