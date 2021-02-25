<template>
  <view class="index">
    <button @tap='handleSelectImg()'>选择图片</button>
    <view class="img-wrapper" v-if="previewUrl">
      <image :src="previewUrl" mode="widthFix" />
    </view>

    <view v-if="!previewUrl && originUrl">
      <ImageCropper @setPreview="setPreview($event)" :cutRatio=(3/1) :imgPath='originUrl'></ImageCropper>
    </view>
  </view>
</template>

<script>
import ImageCropper from '../../components/Cropper'
export default {
  name: 'Index',
  data() {
    return {
      previewUrl: null,
      originUrl: 'https://tuixiaomi.oss-cn-beijing.aliyuncs.com/app/poster/logo.png', // null,
    }
  },
  components: {
    ImageCropper
  },
  methods: {
    setPreview(url) {
      this.previewUrl = url
    },
    handleSelectImg() {
      this.previewUrl = ''
      this.originUrl = ''
      wx.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: res => {
          var tempFilePaths = res.tempFilePaths
          this.originUrl = tempFilePaths[0]
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
