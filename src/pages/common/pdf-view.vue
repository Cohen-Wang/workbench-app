<template>
  <view>
    <web-view :src="src" @message="message"/>
  </view>
</template>

<script>
import apiService from '@/services/api'
import { STUDY_FREQUENCY } from '@/const/constant'

// const SRC = '/components/pdf-viewer/web/viewer.html' // 格式化文件流的一个js 文件 文末会分享出来
const SRC = '/hybrid/html/pdf/web/viewer.html' // 格式化文件流的一个js 文件 文末会分享出来

export default {
  data() {
    return {
      // 传参
      categoryId: '',
      courseAttachmentId: '',
      isStudyFinish: false,
      links: '',
      pdfName: '',
      userId: '',
      // ...
      src: '',
      params: {},
      // 定时器
      changeStudyTimer: null,
      interactionTimer: null
    }
  },
  onLoad(options) {
    // pdf加载成功前，loading
    // uni.showLoading() // bug：获取不到事件，关闭不了
    // 赋值
    this.categoryId = options.categoryId
    this.courseAttachmentId = options.courseAttachmentId
    this.isStudyFinish = JSON.parse(options.isStudyFinish)
    this.links = encodeURIComponent(options.links) // encodeURIComponent 函数可把字符串作为 URI 组件进行编码。
    this.pdfName = options.pdfName
    this.userId = options.userId
    // 初始化
    this.init()
    // 等待PDF加载成功
    this.afterPDFLoaded()
    // #ifdef H5
    // window.addEventListener('message', event => {
    //   console.log('event1', event)
    //   // if (!event.data || !event.data.data || event.data.data.arg.action !== 'hideLoading') return
    //   this.afterPDFLoaded()
    // })
    // #endif
  },
  onUnload() {
    // #ifdef H5
    window.removeEventListener('message', () => {})
    // #endif
    clearInterval(this.changeStudyTimer)
    this.changeStudyTimer = null
    clearTimeout(this.interactionTimer)
    this.interactionTimer = null
  },
  methods: {
    // 初始化
    async init() {
      // 请求学习时长
      const param = {
        courseAttachmentId: this.courseAttachmentId,
        userId: this.userId
      }
      const res = await this.getStudyLength(param)
      const studyLength = res.data.data ? ~~(res.data.data.studyLength) : 0
      // 拼接url地址
      this.src = `${SRC}?file=${this.links}&pdfName=${this.pdfName}&studyLength=${studyLength}`
    },
    // 加载成功后
    afterPDFLoaded() {
      // 关闭loading
      uni.hideLoading()
      // 设置title
      uni.setNavigationBarTitle({ title: this.pdfName })
      // 刚开始，直接交互1秒
      this.changeStudyTime(1)
      if (!this.changeStudyTimer) {
        this.changeStudyTimer = setInterval(_ => {
          this.changeStudyTime()
        }, STUDY_FREQUENCY * 1000)
      }
      // 开始【五分钟互动】
      this.startInteraction()
    },
    // +----------------------------------------------------------------------------------------------------------------
    // | 接口
    // +----------------------------------------------------------------------------------------------------------------
    // 获取学习时长
    getStudyLength(param) {
      return new Promise((resolve, reject) => {
        apiService.getStudyLength(param).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        }).finally(() => {
          console.log(1)
        })
      })
    },
    // 更新学习时长
    changeStudyTime(time) {
      const param = {
        categoryId: this.categoryId,
        courseAttachmentId: this.courseAttachmentId,
        pdfName: this.pdfName,
        userId: this.userId,
        studyLength: time || STUDY_FREQUENCY
      }
      apiService.changeStudyTime(param).then(res => {
        // do nothing
      }).finally(res => {
        // do nothing
      })
    },
    // 开始【五分钟互动】
    startInteraction() {
      this.interactionTimer = setTimeout(() => {
        clearInterval(this.changeStudyTimer)
        this.changeStudyTimer = null
        uni.showModal({
          title: '提示',
          content: '点击确认按钮继续学习',
          showCancel: false,
          success: res => {
            if (res.confirm) {
              this.startInteraction()
              this.changeStudyTimer = setInterval(_ => {
                this.changeStudyTime()
              }, STUDY_FREQUENCY * 1000)
            } else if (res.cancel) {
              // 用户点击取消
            }
          }
        })
      }, 5 * 60 * 1000)
    },
    // +----------------------------------------------------------------------------------------------------------------
    // | 消息
    // +----------------------------------------------------------------------------------------------------------------
    message(event) {
      console.log('event2', event)
      if (event.detail.data[0].action === 'hideLoading') { // pdf加载完毕，取消loading图
        this.afterPDFLoaded()
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
