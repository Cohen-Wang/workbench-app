<template>
  <view class="cu-modal" :class="modalVisible?'show':''">
    <view class="cu-dialog">
      <view class="cu-bar bg-white justify-end">
        <view class="content">{{modalObj.title}}</view>
        <view class="action" @tap="hideModal">
          <text class="cuIcon-close"></text>
        </view>
      </view>
      <view class="padding-xl">{{modalObj.content}}</view>
      <view class="cu-bar bg-white">
        <view v-for="(each,index) of modalObj.buttons"
              :key="index"
              class="action margin-0 flex-sub solid-left"
              :class="each.textColor? 'text-' + each.textColor : ''"
              @click="doAction(each)">
          <text v-if="each.cuIcon" :class="'cuIcon-' + each.cuIcon"></text>
          {{each.text}}
        </view>
        <!--        <view class="action margin-0 flex-sub text-green solid-left" @click="hideModal">取消</view>-->
        <!--        <view class="action margin-0 flex-sub solid-left" @click="hideModal">确定</view>-->
      </view>
    </view>
  </view>
</template>

<script>
import { IMAGE_HOST } from '@/services/constant'
import apiService from '@/services/api'

export default {
  name: 'ColorUIMultiButtonModal',
  data() {
    return {
      modalVisible: false,
      modalObj: {
        title: '',
        content: '',
        buttons: [
          {
            text: '',
            textColor: '',
            cuIcon: ''
          }
        ]
      }
    }
  },
  mounted() {
    // this.getProcessTaskTransInfo()
  },
  methods: {
    show(obj) {
      this.modalVisible = true
      this.modalObj = obj
    },
    hideModal() {
      this.modalVisible = false
      this.modalObj = {}
    },
    doAction(button) {
      this.hideModal()
      if (button.action) button.action(button.params)
    }
  }
}
</script>

<style scoped>

</style>
