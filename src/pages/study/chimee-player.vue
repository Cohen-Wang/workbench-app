<template>
  <view class="bg-gray">

    <!-- 标题区 -->
    <view class="margin-bottom bg-white">
      <view class="padding">
        <view class="margin-bottom-sm">
          <text class="text-black text-bold">组件化H5播放器框架</text>
        </view>
        <view class="margin-bottom-sm">
          <text class="text-gray">支持mp4、m3u8、flv 等多种格式，由奇舞团视频云前端组研发。它帮我们解决大部分的兼容性问题，能够解决包括全屏、自动播放、内联播放、直播解码等常见视频需求。 通过组件化开发，能满足业务方快速迭代、灰度发布等要求。让开发者能够轻松快捷地完成视频场景的开发</text>
        </view>
      </view>
    </view>

    <!-- web视频区 -->
    <view class="margin-bottom bg-white">
      <view class="padding">
        <text class="text-black text-bold">ChimeePlayer</text>
      </view>
      <view>
        <view id="ChimeePlayerWrapper" style="min-height: 100upx; box-sizing: border-box; border: 4px solid blue;">
          <!-- chimee-player -->
        </view>
        <view class="padding">
          <text class="text-bold text-cut">...</text>
        </view>
      </view>
    </view>

    <!-- 移动端 -->
    <view class="margin-bottom bg-white">
      <view class="padding">
        <text class="text-black text-bold">ChimeeMobilePlayer</text>
      </view>
      <view>
        <view id="ChimeeMobilePlayerWrapper" style="min-height: 100upx; box-sizing: border-box; border: 4px solid blue;">
          <!-- chimee-player -->
        </view>
        <view class="padding">
          <text class="text-bold text-cut">...</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// web端
// import ChimeePlayer from 'chimee-player'
import Chimee from 'chimee' // 样式
import chimeePluginControlbar from 'chimee-plugin-controlbar' // # 依赖于 chimee， 首先需要安装 chimee; # 安装控制条组件
import chimeePluginCenterState from 'chimee-plugin-center-state' // # 依赖于 chimee， 首先需要安装 chimee; # 安装控制条组件
import contextmenu from 'chimee-plugin-contextmenu' // 菜单
import chimeePluginLog from 'chimee-plugin-log' // 日志
import chimeePluginPopup from 'chimee-plugin-popup' // 模态框
// 移动端
import ChimeeMobilePlayer from 'chimee-mobile-player'
import 'chimee-mobile-player/lib/chimee-mobile-player.browser.css' // 必须手动引入CSS

export default {
  name: 'ChimeePlayer',
  data() {
    return {
      chimeeInstance: null
    }
  },
  created() {
    // console.groupCollapsed()
    // console.log('Chimee:', Chimee)
    // console.log('ChimeePlayer:', ChimeePlayer)
    // console.log('chimeePluginControlbar:', chimeePluginControlbar)
    // console.log('chimeePluginCenterState:', chimeePluginCenterState)
    // console.log('contextmenu:', contextmenu)
    // console.log('chimeePluginLog:', chimeePluginLog)
    // console.log('chimeePluginPopup:', chimeePluginPopup)
    // console.groupEnd()
  },
  mounted() {
    this.$nextTick(() => {
      this.H5init()
      this.mobileInit()
    })
  },
  methods: {
    H5init() {
      // 安装插件
      Chimee.install(chimeePluginControlbar)
      Chimee.install(chimeePluginCenterState)
      Chimee.install(contextmenu)
      Chimee.install(chimeePluginLog)
      Chimee.install(chimeePluginPopup({
        name: 'cc_popup',
        title: '这是一个居中信息框',
        body: '这里是信息内容',
        offset: '50% 50%',
        width: '200px'
      }))
      // // 初始化
      this.chimeeInstance = new Chimee({
        // video dom容器
        wrapper: '#ChimeePlayerWrapper',
        // 视频路径
        // src: 'http://chimee.org/vod/1.mp4',
        // src: `../../../assets/video/office.mp4`,
        // src: `https://f.video.weibocdn.com/001WEasBlx07AwW7QpGM01041202lNOG0E010.mp4?label=mp4_720p&template=1280x720.25.0&trans_finger=721584770189073627c6ee9d880087b3&media_id=4466024205189142&tp=8x8A3El:YTkl0eM8&us=0&ori=1&bf=2&ot=h&ps=3lckmu&uid=5EAIaR&ab=3915-g1,966-g1,3370-g1&Expires=1611825339&ssig=n1IOjdzib6&KID=unistore,video`,
        src: `http://chimee.org/vod/1.mp4`,
        // 自动播放
        autoplay: true, // 给了true 也没有看到自动播放
        // 能否控制
        controls: true,
        // 插件
        plugins: [
          // 控制条样式
          {
            name: chimeePluginControlbar.name,
            majorColor: '#f00',
            hoverColor: '#fff',
            hideBarTime: 1000,
            // 控制条显示由， move 还是 enter/leave 来控制显示／隐藏
            barShowByMouse: 'enter',
            children: {
              play: {
                // bitmap: true,
              },
              progressTime: true,
              progressBar: {
                layout: 'right' // baseline
              },
              clarity: {
                list: [
                  { name: '标清', src: 'http://v.96koo.net/common/LzEvcmVsZWFzZS8yMDE4MDUzMC9NQmoycnhITUUzL01CajJyeEhNRTNfNjQwXzgwMA==_8446.m3u8' },
                  { name: '高清', src: 'http://v.96koo.net/common/LzEvcmVsZWFzZS8yMDE4MDUzMC9NQmoycnhITUUzL01CajJyeEhNRTNfOTYwXzEwMDA=_8446.m3u8' }
                ],
                duration: 3,
                increment: 0
              }
            }
          },
          // 控制条样式
          {
            name: chimeePluginCenterState.name
          },
          // 菜单：不使用的话，就是浏览器默认菜单
          {
            name: contextmenu.name,
            menus: [
              {
                text: 'alert',
                action: 'menu-alert'
              },
              {
                text: '播放',
                action: 'menu-play'
              },
              {
                text: '暂停',
                action: 'menu-pause'
              }
            ]
          },
          // 日志：会在菜单栏里面自动多出一个“查看日志”选项，不需要自己写
          {
            name: chimeePluginLog.name,
            // 告诉插件你有一个可以接受日志上报的服务端接口
            logPostUrl: 'https://myDomain.xx/log_push'
          }
        ]
      })

      const _this = this

      // 菜单
      this.chimeeInstance.on('menu-alert', function() {
        alert(1)
      })
      this.chimeeInstance.on('menu-play', function() {
        _this.chimeeInstance.emit('play') // 通知播放器开始
      })
      this.chimeeInstance.on('menu-pause', function() {
        _this.chimeeInstance.emit('pause') // 通知播放器暂停
      })

      // 日志
      // 打开日志输出
      // this.chimeeInstance[chimeePluginLog.name].open()
      // 关闭日志输出
      // chimee[myLog.name].close()
    },
    mobileInit() {
      new ChimeeMobilePlayer({
        wrapper: '#ChimeeMobilePlayerWrapper', // video dom容器
        // src: 'http://cdn.toxicjohann.com/lostStar.mp4',
        src: 'http://chimee.org/vod/1.mp4',
        autoplay: false,
        controls: true,
        playsInline: true,
        preload: 'auto',
        x5VideoPlayerFullscreen: true,
        x5VideoOrientation: 'landscape|portrait',
        xWebkitAirplay: true,
        muted: true
        // removeInnerPlugins: ['chimeeMobiControlbar', 'chimeeState'] // 需要移除的插件
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  //@import './../../style/lib/chimee-mobile-player.browser.css';
</style>
