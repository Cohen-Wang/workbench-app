<template>
  <view class="cu-modal" :class="modalVisible?'show':''">
    <view class="cu-dialog">
      <view class="cu-bar bg-white justify-end">
        <view class="content">{{ modal.title || defaultModal.title }}</view>
        <view v-if="!modal.hideCancel" class="action" @tap="cancel">
          <text class="cuIcon-close"/>
        </view>
      </view>
      <view class="padding-xl">{{ modal.content || defaultModal.content }}</view>
      <view class="cu-bar bg-white justify-end">
        <view class="action">
          <button v-if="!modal.hideCancel"
                  class="cu-btn line-green text-blue"
                  @tap="cancel">{{ modal.cancelText || defaultModal.cancelText}}
          </button>
          <button v-if="!modal.hideConfirm"
                  class="cu-btn bg-blue margin-left"
                  @tap="confirm">{{ modal.confirmText || defaultModal.confirmText}}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>

export default {
  name: 'ColorUIDialogModal',
  data() {
    return {
      modalVisible: false,
      modal: {},
      defaultModal: {
        title: '',
        content: '',
        hideCancel: false,
        hideConfirm: false,
        cancelText: '取消',
        confirmText: '确定',
        onCancel: () => {
        },
        onConfirm: () => {
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    show(obj) {
      this.modal = obj
      this.modalVisible = true
    },
    hideModal() {
      this.modalVisible = false
      setTimeout(_ => {
        this.modal = {}
      }, 200)
      // this.$nextTick(() => {
      //   this.modal = {}
      // })
    },
    cancel() {
      if (this.modal.onCancel) this.modal.onCancel()
      this.hideModal()
    },
    confirm() {
      if (this.modal.onConfirm) this.modal.onConfirm()
      this.hideModal()
    }
  }
}
</script>

<style scoped>

</style>
