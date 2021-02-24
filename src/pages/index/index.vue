<template>
  <view class="index">
    <view class="img-wrapper" v-if="previewUrl">
      <image :src="previewUrl" mode="aspectFit" :style='{ width: "100%", height: "100%" }' />
    </view>
    <button @tap='handleSelectImg()'>选择图片</button>

    <view v-if="!previewUrl && originUrl">
      <ImageCropper @setPreview="setPreview($event)" :imgSrc='originUrl' ref='imageCropper'></ImageCropper>
      <button @tap='handleOk()' class="confirm-btn">
        保存图片
      </button>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
import ImageCropper from '../../components/Cropper'
export default {
  name: 'Index',
  data() {
    return {
      previewUrl: null,
      originUrl: null,
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
      Taro.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: res => {
          var tempFilePaths = res.tempFilePaths
          this.originUrl = tempFilePaths[0]
        }
      })
    },
    async handleOk() {
      this.$refs.imageCropper.getImg()
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
  // width: 100%;
  // height: 100%;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // flex-direction: column;

  .confirm-btn {
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999;
    font-size: 24rpx;
  }
  .img-wrapper {
    width: 66.66vw;
    height: 133.32vw;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
