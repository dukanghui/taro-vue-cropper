<template>
  <view class="index">
    <image v-if="previewUrl" :src="$oss + '/' + previewUrl" mode="widthFix" />
    <button @tap='handleSelectImg()'>选择图片</button>
    <view v-if="showCrop">
      <ImageCropper @setPreview="setPreview($event)" :cutRatio=(1) :imgPath='originUrl'></ImageCropper>
    </view>
  </view>
</template>

<script>
import ImageCropper from '../../components/Cropper'
export default {
  name: 'Index',
  data() {
    return {
      showCrop: false,
      previewUrl: '',
      originUrl: '', //'https://tuixiaomi.oss-cn-beijing.aliyuncs.com/app/poster/logo.png', // null,
    }
  },
  components: {
    ImageCropper
  },
  methods: {
    setPreview(url) {
      this.previewUrl = url
      this.showCrop = false
    },
    handleSelectImg() {
      wx.chooseImage({
        count: 1,
        // sizeType: ["original", "compressed"],
        // sourceType: ["album", "camera"],
        success: res => {
          var tempFilePaths = res.tempFilePaths
          this.originUrl = tempFilePaths[0]
          this.showCrop = true
        }
      })
    }
  }
}
</script>

<style lang="less">
page {
  width: 100%;
  height: 100%;
}
</style>
