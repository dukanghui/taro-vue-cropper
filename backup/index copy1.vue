<template>
  <view class="index">
    <my-cropper bind:close="hideCut" :cutRatio="cutRatio" v-if="showCropper" :imageSrc="imageSrc" :cropperRatio="cropperRatio" :cropperWidth="cropperWidth" :minCropperW="minCropperW" />
  </view>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      cutRatio: 1,
      showCropper: true,
      imageSrc: '',
      cropperRatio: 1,
      cropperWidth: 150,
      minCropperW: 100
    }
  },

  components: {
  },

  methods: {
    hideCut() {
      this.setData({
        showCropper: false
      })
      const img = arguments[0].detail
      if (img && img.path) {
        console.log(img)
        this.setData({
          imageInfo: img
        })
      }
    }
  },

  mounted() {
  }
}
</script>

<style>
.cropper-wrapper {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #e5e5e5;
}

.cropper-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  padding: 0 20rpx;
  box-sizing: border-box;
  line-height: 50px;
}

.cropper-buttons .upload,
.cropper-buttons .getCropperImage {
  text-align: center;
}

.cropper {
  position: absolute;
  top: 0;
  left: 0;
}

.cropper-buttons {
  background-color: rgba(0, 0, 0, 0.95);
}

.btn {
  height: 30px;
  line-height: 30px;
  padding: 0 24rpx;
  border-radius: 2px;
  color: #ffffff;
}
</style>
