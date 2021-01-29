<template>
  <view class="page-content">
    <!--<view class="nav-content bg-white padding margin" style="margin-bottom: 150upx">
      <view class="grid text-center col-5">
        <view v-for="(item,index) in answerSheet"
              :key="index"
              class="margin-bottom">
          <view class="cu-btn round-btn"
                :class="[item.selectAnswer && item.selectAnswer.answer ? 'selected' : 'unselected']"
                @click="onItemClick(item, index)">
            <text>{{ index + 1 }}</text>
          </view>
        </view>
      </view>
    </view>-->
    <view class="nav-content bg-white padding margin" style="margin-bottom: 150upx">
      <view v-for="(answerItem, answerKey) in answerSheet" :key="answerKey">
        <template v-if="answerItem.length > 0">
          <view class="margin-bottom">{{ answerKey }}</view>
          <view class="grid text-center col-5">
            <view v-for="(item, index) in answerItem"
                  :key="index"
                  class="margin-bottom">
              <view class="cu-btn round-btn bg-white"
                    :class="[item.selectAnswer && item.selectAnswer.answer ? 'selected' : 'unselected']"
                    @click="onItemClick(item, index)">
                <text>{{ item.myIndex + 1 }}</text>
                <view v-if="item.selectAnswer.tag" class="answer-card-tag bg-orange light">
                  <text class="cuIcon-newshot"/>
                </view>
              </view>
            </view>
          </view>
        </template>
      </view>
    </view>

    <view class="cu-bar foot bg-white margin-top padding-lr" style="display: block">
      <button class="cu-btn block round bg-blue margin-tb-sm lg" :loading="loading" @click="onSubmit">提交试卷</button>
    </view>
  </view>
</template>

<script>

import apiService from '@/services/api'
import { USER_INFO } from '@/services/constant'

export default {
  data() {
    return {
      loading: false,
      rememberMe: false,
      myProfile: uni.getStorageSync(USER_INFO),
      answerSheet: [],
      renewPassword: ''
    }
  },
  onLoad(options) {
    this.examRecordId = options.examRecordId
    this.examId = options.examId
    apiService.getAnswerSheet(options.examId, this.myProfile.id, this.examRecordId).then(res => {
      this.answerSheet = this.getAnswerList(res.data.data)
      console.log('this.answerSheet', this.answerSheet)
    })
  },
  onReady() {
    // 获取app传来的值
  },
  methods: {
    onItemClick(item, index) {
      this.loading = false
      uni.$emit('switchQuestion', { item, index })
      uni.navigateBack()
    },
    onSubmit() {
      this.loading = true
      apiService.submitExam(this.examRecordId, this.examId, this.myProfile.id).then(res => {
        // uni.switchTab({
        //   url: '/pages/exam/exam-center',
        //   success: () => {
        //   }
        // })
        uni.navigateTo({
          url: `/pages/my/exam-record?switchTab=/pages/exam/exam-center`
        })
      })
      this.loading = false
    },
    getAnswerList(data) {
      const ANSWER_LIST = {
        '单选题': [],
        '多选题': [],
        '判断题': [],
        '简答题': [],
        '解答题': [],
        '画图题': []
      }
      const result = JSON.parse(JSON.stringify(ANSWER_LIST))
      data.forEach((e, i) => {
        const param = Object.assign({}, e, { myIndex: i, answerType: e.answerType, id: e.id, score: e.score })
        if (e.type === 0) result['单选题'].push(param)
        if (e.type === 3) result['多选题'].push(param)
        if (e.type === 2) result['判断题'].push(param)
        if (e.type === 1) result['简答题'].push(param)
        if (e.type === 4) result['解答题'].push(param)
        if (e.type === 5) result['画图题'].push(param)
      })
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
.page-content {
  background-color: $uni-bg-color-grey;
  overflow-y: auto;
}

.nav-content1 {
  max-height: calc(100% - #{upx(220)});
}

.round-btn {
  height: upx(76);
  width: upx(76);
  border-radius: 50%;
  border: 1px solid #F0F0F0;
}

.round-btn.selected {
  /*background: linear-gradient(0deg, #FA5C24 0%, #FAAD91 100%);*/
  background-color: #409EFF;
  color: #FFFFFF;
  border-color: #78bbff;
  font-weight: bold;

  &>.answer-card-score {
    border-color: #78bbff;
    color: #409EFF;
  }
}

.round-btn.unselected {
  background: white;
  color: #9A9A9A;
  border-color: #F0F0F0;
}

.answer-card-score {
  position: absolute;
  right: upx(-12);
  bottom: upx(-2);
  width: upx(34);
  height: upx(34);
  border-radius: 50%;
  color: #666666;
  font-size: upx(16);
  line-height: upx(36);
  background-color: #FFFFFF;
  border: 1px solid #F0F0F0;
}

.answer-card-tag {
  position: absolute;
  right: upx(-18);
  top: upx(-4);
  width: upx(40);
  height: upx(40);
  border-radius: 50%;
  font-size: upx(20);
  line-height: upx(36);
  border: 1px solid #F0F0F0;
}
</style>
