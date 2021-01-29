<template>
  <view class="page-content">
    <iframe v-if="show" ref="iframe" v-bind="iframeProps"/>
  </view>
</template>

<script>
import { randomString } from '@/services/utils'
import { ACCESS_TOKEN, API_HOST } from '@/services/constant'
import _uni from '@/services/uni'

export default {
  data() {
    return {
      messageId: randomString('16'),
      hasMore: true,
      show: false,
      isLoading: false
    }
  },
  onLoad(options) {
    this.desformCode = options.desformCode
    if (options.desformName) {
      uni.setNavigationBarTitle({
        title: (() => {
          if (options.mode === 'add') return '添加表单数据'
          if (options.mode === 'edit') return '编辑表单数据'
          if (options.mode === 'detail') return '查看表单数据'
        })()
      })
    }
    if (!options.mode || !options.desformCode) return _uni.showToast('参数错误')
    if (options.mode !== 'add' && !options.dataId) return _uni.showToast('参数错误')
    uni.showLoading()
    this.addEventListener()
    this.iframeProps = this.generateIframeProps(options.mode, options.dataId, options.desformCode)
    this.show = true
  },
  methods: {
    addEventListener() {
      window.removeEventListener('message', () => {
      })
      window.addEventListener('message', (event) => {
        const { messageId, type, data } = event.data
        if (this.messageId !== messageId) return
        switch (type) {
          case 'save':
            this.saveAllData(data)
            break
          case 'height-change':
            // this.iframeHeight = data + 10
            // this.pageLoading = false
            uni.hideLoading()
            // if (this.mode === 'add') {
            //   const action = 'setEditData'
            //   const data = { 'filed_1': '余建sdd', 'field_2': 'fff', 'bpm_status': '1' }
            //   this.$refs['iframe'].contentWindow.postMessage({ action, data, messageId }, '*')
            // }
            break
          case 'dialog-change':
            // this.$emit('dialogChange', data)
            break
        }
      }, false)

      // 如果超过3秒还没有得到子组件的反馈，就自动停止
      setTimeout(() => {
        uni.hideLoading()
        // if (this.pageLoading) {
        //   this.pageLoading = false
        // }
      }, 4000)
    },
    saveAllData(params) {
      // const _this = this
      //
      // let url = _this.url.add, method = 'POST'
      // let formData = {
      //   desformCode: _this.desformCode,
      //   desformDataJson: JSON.stringify(params.json)
      // }
      // if (_this.dataId) {
      //   url = _this.url.edit
      //   method = 'PUT'
      //   formData['id'] = _this.dataId
      // }
      //
      // _this.loading = true;
      // (() => {
      //   // 如果存在 onlineForm 就首先提交给online表单，获取到 id 后再提交到数据表
      //   if (params.onlineForm) {
      //     formData['onlineFormCode'] = params.onlineForm
      //     if (_this.dataId) {
      //       params.json.id = params.onlineDataId
      //     }
      //     let onlineUrl = `${_this.url.online}/${params.onlineForm}`
      //
      //     // online 特殊处理，防止因为java的toString破坏了格式
      //     let onlinePostJson = cloneObject(params.json)
      //     for (let key in onlinePostJson) {
      //       if (onlinePostJson.hasOwnProperty(key)) {
      //         let item = onlinePostJson[key]
      //         if (typeof item === 'object') {
      //           onlinePostJson[key] = JSON.stringify(item)
      //         }
      //       }
      //     }
      //
      //     return httpAction(onlineUrl, onlinePostJson, method)
      //   } else {
      //     return Promise.resolve(null)
      //   }
      // })().then((res) => {
      //   if (res == null) {
      //     // 没有提交到online表单
      //     // do nothing
      //   } else if (res.success) {
      //     // 提交到了onlineForm，获取到新增的uuid，且只有在新增时才提交
      //     if (!_this.dataId) {
      //       formData['onlineFormDataId'] = res.result
      //     }
      //   } else {
      //     if (_this.alert === true) _this.$error({ title: '保存失败', content: res.message })
      //     return Promise.reject()
      //   }
      //   // 提交到数据表
      //   return httpAction(url, formData, method)
      // }).then(res => {
      //   if (res.success) {
      //     // 保存到用户自定义url
      //     let { formConfig: { customRequestURL: curl } } = params
      //     if ((curl instanceof Array) && curl[0] && curl[0].url) {
      //       return httpAction(curl[0].url, formData, method)
      //     }
      //   }
      //   return res
      // }).then(res => {
      //   if (res.success) {
      //     console.log(res, res.result)
      //     this.$emit('success', { res, dataId: res.result, target: _this })
      //     if (_this.alert === true) _this.$message.success('保存成功')
      //   } else {
      //     _this.$emit('error', { res, target: _this })
      //     if (_this.alert === true) _this.$error({ title: '保存失败', content: res.message })
      //   }
      // }).finally(() => {
      //   _this.loading = false
      // })
    },
    generateIframeProps(mode, dataId, desformCode) {
      console.log(mode, dataId)
      // 拼接 iframe 的 src 属性
      let src = `${API_HOST}/desform/${mode}/${desformCode}`
      //  - 修改和查看都需要传递 dataId 参数
      if (mode === 'edit' || mode === 'detail') {
        src += `/${dataId}`
      }
      src += `?messageId=${this.messageId}&token=${uni.getStorageSync(ACCESS_TOKEN)}`
      src += `&innerRequest=false` // 关闭iframe的内部请求
      src += `&disableScroll=true` // 关闭iframe的内部滚动
      return {
        src,
        style: {
          'width': '100%',
          'height': '100%',
          // 'height': (typeof this.height === 'number') ? `${this.height}px` : this.height
          'overflow': 'hidden'
        },
        frameborder: '0'
      }
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
