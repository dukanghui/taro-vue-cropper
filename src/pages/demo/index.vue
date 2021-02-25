<template>
  <view class="index">
    <view v-html="b" class="taro_html"></view>
  </view>
</template>

<script>
import '@tarojs/taro/html.css'
export default {
  name: 'Demo',
  data() {
    return {
      c: '',
      b: '<p style="line-height: 1.75em;"><strong><span style="font-size: 16px; color: rgb(255, 0, 0);"></span></strong></p><section data-role="outer" label="Powered by 135editor.com"><section class="_135editor" data-tools="135编辑器" data-id="92724" style="border: 0px none; box-sizing: border-box;"><section style="padding: 10px; margin: 0px auto; text-align: center; box-sizing: border-box;"><section style="display: inline-block;padding: 2px 0px;border-bottom: 1px dotted rgb(250,151,156);box-sizing: border-box;"><section class="135brush" data-brushtype="text" style="padding: 5px 8px; color: rgb(255, 254, 255); letter-spacing: 1px; background: rgb(250, 151, 156); box-sizing: border-box;"><span style="font-size: 18px; color: rgb(255, 255, 255);">奖品设置</span></section></section></section></section><p><br/></p></section><p style="line-height: 1.75em;"><strong><span style="font-size: 16px; color: rgb(255, 0, 0);">一等奖1名：平板电脑+电脑同步的学习卡一张</span></strong></p><p style="line-height: 1.75em;"><strong><span style="font-size: 16px; color: rgb(255, 0, 0);"><img src="http://oss.jblasen.cn/app/wx/uploadImg/48e41d46-ad2f-460e-bf58-b8eba9587816/43571527489054550.jpg" title="微信图片_20180528142950.jpg"/></span></strong></p><p style="line-height: 1.75em;"><strong><span style="font-size: 16px; color: rgb(255, 0, 0);"><img src="http://oss.jblasen.cn/app/wx/uploadImg/48e41d46-ad2f-460e-bf58-b8eba9587816/11551527489331628.jpg" title="微信图片_20180528143000.jpg"/></span></strong></p><p style="line-height: 1.75em;"><br/></p><p style="line-height: 1.75em;"><strong><span style="font-size: 16px; color: rgb(255, 0, 0);">二等奖1名：遥控飞行器+影视VIP卡</span></strong></p><p style="line-height: 1.75em;"><strong><span style="font-size: 16px; color: rgb(255, 0, 0);"><img src="http://oss.jblasen.cn/app/wx/uploadImg/48e41d46-ad2f-460e-bf58-b8eba9587816/91651527644394102.jpg" title="微信图片_20180530091450.jpg"/></span></strong></p><p style="line-height: 1.75em;"><strong><span style="font-size: 16px; color: rgb(255, 0, 0);"><img src="http://oss.jblasen.cn/app/wx/uploadImg/48e41d46-ad2f-460e-bf58-b8eba9587816/90721527489109143.jpg" title="微信图片_20180528143003.jpg"/></span></strong></p><p style="line-height: 1.75em;"><br/></p><p style="line-height: 1.75em;"><strong><span style="font-size: 16px; color: rgb(255, 0, 0);">三等奖1名：智能电话手表+影视VIP卡</span></strong></p><p style="line-height: 1.75em;"><strong><span style="font-size: 16px; color: rgb(255, 0, 0);"><img src="http://oss.jblasen.cn/app/wx/uploadImg/48e41d46-ad2f-460e-bf58-b8eba9587816/57991527644427399.jpg" title="微信图片_20180530091501.jpg"/></span></strong></p><p style="line-height: 1.75em;"><strong><span style="font-size: 16px; color: rgb(255, 0, 0);">四等奖1名：磁能护眼宝</span></strong></p><p style="line-height: 1.75em;"><strong><span style="font-size: 16px; color: rgb(255, 0, 0);"><img src="http://oss.jblasen.cn/app/wx/uploadImg/48e41d46-ad2f-460e-bf58-b8eba9587816/98461527489182722.jpg" title="微信图片_20180528142944.jpg"/></span></strong></p><p style="line-height: 1.75em;"><strong><span style="font-size: 16px; color: rgb(255, 0, 0);"><br/></span></strong></p><p style="line-height: 1.75em;"><strong><span style="font-size: 16px; color: rgb(255, 0, 0);">五等奖1名：VR3D眼镜</span></strong></p><p style="line-height: 1.75em;"><strong><span style="font-size: 16px; color: rgb(255, 0, 0);"><img src="http://oss.jblasen.cn/app/wx/uploadImg/48e41d46-ad2f-460e-bf58-b8eba9587816/71551527489194503.jpg" title="微信图片_20180528142953.jpg"/></span></strong></p><p style="line-height: 1.75em;"><strong><span style="font-size: 16px; color: rgb(255, 0, 0);"><br/></span></strong></p><p style="line-height: 1.75em;"><strong><span style="font-size: 16px; color: rgb(255, 0, 0);">六等奖1名：计步器手表</span></strong></p><p style="line-height: 1.75em;"><strong><span style="font-size: 16px; color: rgb(255, 0, 0);"><img src="http://oss.jblasen.cn/app/wx/uploadImg/48e41d46-ad2f-460e-bf58-b8eba9587816/63621527489237925.jpg" title="微信图片_20180528142947.jpg"/></span></strong></p><p style="line-height: 1.75em;"><br/></p><p><strong style="white-space: normal;"><span style="color: rgb(255, 0, 0);"><img src="http://oss.jblasen.cn/app/wx/uploadImg/48e41d46-ad2f-460e-bf58-b8eba9587816/2021527489455472.jpg" title="a.jpg"/></span></strong></p>'
    }
  },
  onLoad() {
    let b = this.b
    b = b.replace(/\<br\//gi, '')
    b = b.replace(/\<span/gi, '<div')
    b = b.replace(/\<\/span/gi, '</div')
    b = b.replace(/\<strong/gi, '<div')
    b = b.replace(/\<\/strong/gi, '</div')
    console.log(b)
    this.c = b
  },
  methods: {
  }
}
</script>

<style lang="less">
page {
  width: 100%;
  height: 100%;
}
.index {
  .img-wrapper {
    width: 500rpx;
    height: 500rpx;
    background-color: #53adff;
    image {
      background-color: pink;
    }
  }
}
</style>
