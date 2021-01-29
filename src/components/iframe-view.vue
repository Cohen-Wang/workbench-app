<template>
  <!-- <web-view :src="iframeUrl" @onPostMessage="message"/> -->
  <iframe v-if="iframeUrl"
          :src="iframeUrl"
          width="100%"
          height="100%"
          frameborder="0"
          scrolling="auto"/>
</template>

<script>
import _uni from '@/services/uni'
import { ACCESS_TOKEN, API_HOST } from '@/services/constant'
import { randomString } from '@/services/utils'
import apiService from '@/services/api'

export default {
  name: 'FlowAndForm',
  props: {
    desform: {
      type: Object,
      default() {
        return {}
      }
    },
    mode: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      iframeUrl: '',
      messageId: randomString('16'),
      url: {
        add: '/desform/data/add',
        edit: '/desform/data/edit',
        online: '/online/cgform/api/crazyForm'
      },
      desformDataJson: '',
      first: false
    }
  },
  created() {
    uni.showLoading()
    this.getBizHisProcessNodeInfo()
    // 监听事件
    const _this = this
    // 如果超过3秒还没有得到子组件的反馈，就自动停止
    setTimeout(() => {
      uni.hideLoading()
    }, 3000)
    // #ifdef APP-PLUS
    plus.globalEvent.addEventListener('message', _ => {
      console.log('APP')
      const { messageId, type, data } = event.data
      if (_this.messageId !== messageId) return
      switch (type) {
        case 'save':
          uni.showLoading()
          _this.saveAllData(data)
          break
        case 'height-change':
          _this.iframeHeight = data + 10
          _this.pageLoading = false
          uni.hideLoading()
          break
      }
    })
    // #endif
    // #ifdef H5
    window.addEventListener('message', res => {
      const { messageId, type, data } = event.data
      if (_this.messageId !== messageId) return
      switch (type) {
        case 'save':
          uni.showLoading()
          _this.saveAllData(data)
          break
        case 'height-change':
          _this.iframeHeight = data + 10
          _this.pageLoading = false
          uni.hideLoading()
          break
        // case 'dialog-change':
        //   _this.$emit('dialogChange', data)
        //   break
      }
    })
    // #endif
  },
  onShow() {
  },
  onLoad(options) {
    // this.desform = JSON.parse(options.data)
  },
  methods: {
    getBizHisProcessNodeInfo() {
      let dataId = !this.desform.dataId ? 'add' : this.desform.dataId
      let iframeUrl = ''
      iframeUrl += `${API_HOST}/desform/${this.mode}/${this.desform.formCode}`
      //  - 修改和查看都需要传递 dataId 参数
      if (this.mode === 'edit' || this.mode === 'detail') {
        iframeUrl += `/${dataId}`
      }
      iframeUrl += `?messageId=${this.messageId}&token=${uni.getStorageSync(ACCESS_TOKEN)}`
      iframeUrl += `&innerRequest=false` // 关闭iframe的内部请求
      iframeUrl += `&disableScroll=false` // 关闭iframe的内部滚动
      this.iframeUrl = iframeUrl
    },
    async saveAllData(params) {
      if (this.first) return
      this.first = true
      const _this = this
      const url = '/desform/data/add'
      const formData = {
        desformCode: _this.desform.formCode,
        desformDataJson: JSON.stringify(params.json)
      }
      _this.desformDataJson = JSON.stringify(params.json);
      (() => {
        // 如果存在 onlineForm 就首先提交给online表单，获取到 id 后再提交到数据表
        // uni.showLoading()
        if (params.onlineForm) {
          formData['onlineFormCode'] = params.onlineForm
          const onlineUrl = `${_this.url.online}/${params.onlineForm}`
          // online 特殊处理，防止因为java的toString破坏了格式
          const onlinePostJson = JSON.parse(JSON.stringify(params.json))
          for (const key in onlinePostJson) {
            /* eslint-disable */
            if (onlinePostJson.hasOwnProperty(key)) {
              const item = onlinePostJson[key]
              if (typeof item === 'object') {
                onlinePostJson[key] = JSON.stringify(item)
              }
            }
          }
          return apiService.saveOnlineData(onlineUrl, onlinePostJson)
        }
        return Promise.resolve(null)
      })().then((res) => {
        if (res.data == null) {
          // 没有提交到online表单
          // do nothing
        } else if (res.data.success) {
          // 提交到了onlineForm，获取到新增的uuid，且只有在新增时才提交
          if (_this.dataId == null) {
            formData['onlineFormDataId'] = res.data.result
          }
        } else {
          if (_this.alert === true) _this.$error({ title: '保存失败', content: res.data.message })
          return Promise.reject()
        }
        // 提交到数据表
        return apiService.submitDesformData(url, formData)
      }).then(res => {
        const { formConfig: { customRequestURL: curl }} = params
        if ((curl instanceof Array) && curl[0] && curl[0].url) {
          return apiService.saveDesformData(curl[0].url, formData)
        }
        return res.data
      }).then(res => {
        _this.handleDesformDataAdded(res.result)
      })
    },
    /** 流程数据保存成功后触发该事件 */
    handleDesformDataAdded(dataId) {
      // return console.log(desform_1, dataId)
      // 将流程保存至后台
      const desform = this.desform
      this.loading = true
      if (desform.formType === 'NORMAL_FORM') {
        const data = {
          desformDataId: dataId,
          id: desform.id,
          scenarioId: desform.scenarioId,
          eventId: desform.eventId
        }
        apiService.changeMyNorWorkStatus(data).then(res => {
          _uni.showToast('工作发起成功')
          setTimeout(_ => {
            this.$emit('addSuccess')
          }, 1500)
        })
        return
      }
      const data = {
        desformId: desform.id,
        desformCode: desform.formCode,
        desformDataId: dataId,
        desformName: desform.desformName,
        processName: desform.procName,
        flowCode: 'desform_' + desform.formCode,
        titleExp: desform.titleExp
      }
      apiService.saveExtActDesignFlowData(data).then(res => {
        const data = {
          desformDataId: dataId,
          id: desform.id,
          scenarioId: desform.scenarioId,
          eventId: desform.eventId
        }
        apiService.setMyWorkRelate(data).then(res => {
          _uni.showToast('工作发起成功')
          setTimeout(_ => {
            this.$emit('addSuccess')
          }, 1500)
          // const data = {
          //   extActDesignFlowDataId: res.data.message,
          //   formCode: desform.formCode
          // }
          // this.startProcess(data)
        }).finally(_ => {
          uni.hideLoading()
        })
      })
    },
    // 提交流程
    startProcess(record) {
      const that = this
      const param = {
        flowCode: 'desform_' + record.formCode,
        id: record.extActDesignFlowDataId,
        formUrl: '{{DOMAIN_URL}}/desform/detail/' + record.formCode + '/${BPM_DES_DATA_ID}?token={{TOKEN}}&taskId={{TASKID}}',
        formUrlMobile: '{{DOMAIN_URL}}/desform/detail/' + record.desformCode + '/${BPM_DES_DATA_ID}?token={{TOKEN}}&taskId={{TASKID}}',
        // formUrl: 'modules/extbpm/joa/modules/JoaBusinesStripForm',
        // formUrlMobile: 'modules/extbpm/joa/modules/JoaBusinesStripForm',
        jsonData: that.desformDataJson
      }
      apiService.startDesFormMutilProcess(param).then((res) => {
        _uni.showToast('工作提交成功')
        setTimeout(_ => {
          uni.navigateBack()
        }, 1500)
      }).finally(_ => {
        uni.hideLoading()
      })
    }
  }
}
</script>

<style scoped>

</style>
