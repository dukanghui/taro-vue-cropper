<template>
  <view class="image-cropper-wrapper">
    <view class="cropper-btn">
      <view class="btn-li" @tap="handleChoose()">选择图片</view>
      <view class="btn-li btn-save" @tap="handleSave()">保存</view>
    </view>
    <view class="bg_container">
      <view class="bg_top"></view>
      <view class="bg_middle">
        <view class="bg_middle_left"></view>
        <view class="cut_wrapper" :style="{ width: cut_width + 'px' , height: cut_height + 'px' }">
          <view class="border border-top-left"></view>
          <view class="border border-top-right"></view>
          <view class="border border-right-top"></view>
          <view class="border border-bottom-right"></view>
          <view class="border border-right-bottom"></view>
          <view class="border border-bottom-left"></view>
          <view class="border border-left-bottom"></view>
          <view class="border border-left-top"></view>
        </view>
        <view class="bg_middle_right"></view>
      </view>
      <view class="bg_bottom"></view>
    </view>
    <image class="img" :src="imgSrc" @touchstart='img_touch_start($event)' @touchmove='img_touch_move($event)' @touchend='img_touch_end()' :style="{
						width: imgWidth * scale + 'px',
						height: imgHeight * scale + 'px',
						top: imgTop - (imgHeight * (scale - 1)) / 2 + 'px',
						left: imgLeft - (imgWidth * (scale - 1)) / 2 + 'px'
					}" />
    <canvas canvasId="cropper-canvasid" class="cropper-canvas" :disableScroll='false' :style="{
						width: canvas_width + 'px',
						height: canvas_height + 'px',
						left: canvas_left + 'px',
						top: canvas_top + 'px',
					}"></canvas>
  </view>
</template>

<script>
export default {
  name: 'Cropper',
  props: {
    imgPath: String, //图片路径
    cutRatio: { // 裁剪框的 宽/高 比
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      destWidth: null,
      imgSrc: this.imgPath,
      imgRatio: 1, //图片的 宽/高 比
      imgHeight: 0, //图片的高度
      imgWidth: 0, //图片的宽度
      imgLeft: 0, //图片相对可使用窗口的左边距
      imgTop: 0, //图片相对可使用窗口的上边距
      window_width: 0, //可使用窗口宽度
      window_height: 0, //可使用窗口的高度
      canvas_width: 0, //canvas的宽度
      canvas_height: 0, //canvas的高度
      canvas_left: 0, //canvas相对可使用窗口的左边距
      canvas_top: 0, //canvas相对可使用窗口的上边距
      cut_width: 200, //裁剪框的宽度
      cut_height: 200, //裁剪框的高度
      cut_left: 0, //裁剪框相对可使用窗口的左边距
      cut_top: 0, //裁剪框相对可使用窗口的上边距
      scale: 1, //默认图片的放大倍数
      max_scale: 2, //图片可以放大的最大倍数
      min_scale: 0.5, // 图片可以缩小的最小倍数
      hypotenuse_length: 0, // 斜边长
      //触摸事件的相对位置
      img_touch_relative: [
        {
          x: 0,
          y: 0,
        },
        {
          x: 0,
          y: 0,
        }
      ]
    }
  },
  mounted() {
    this.handleReset()
    // this.img_touch_move = throttle(this.img_touch_move, 1000 / 40, this)
  },
  methods: {
    async handleReset() {
      this.initCanvas()
      this.getDeviceInfo()
      this.computedCutSize()
      await this.initImageInfo()
      this.computedImageSize()
    },
    // 重新选图
    handleChoose() {
      wx.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: res => {
          let tempFilePaths = res.tempFilePaths
          this.imgSrc = tempFilePaths[0]
          this.handleReset()
        }
      })
    },
    // 获取canvas上下文
    initCanvas() {
      this.ctx = wx.createCanvasContext("cropper-canvasid"); // , this.$scope
    },
    // 获取设备屏幕的宽高
    getDeviceInfo() {
      let { windowHeight, windowWidth } = wx.getSystemInfoSync();
      this.window_width = windowWidth
      this.window_height = windowHeight
    },
    // 初始化图片信息
    async initImageInfo() {
      const { width, height, path } = await wx.getImageInfo({
        src: this.imgSrc,
      });
      this.imgSrc = path
      this.imgRatio = width / height
    },
    // 计算裁剪框的宽高
    computedCutSize() {
      //设裁剪框的框度为可使用窗口宽度的2/3
      let initialcut_width = Math.floor((this.window_width * 2) / 3);
      //则裁剪框的高度 = 宽度/_cutRatio
      let initialcut_height = initialcut_width / this.cutRatio;

      // 如果计算后的高度大于等于屏幕高度，则让裁剪框的高度等于可使用窗口的1/2
      if (initialcut_height >= this.window_height) {
        initialcut_height = Math.floor(this.window_height / 2);
        initialcut_width = initialcut_height * this.cutRatio;
      }
      this.cut_height = initialcut_height
      this.cut_width = initialcut_width
      this.cut_top = (this.window_height - this.cut_height) / 2; //因为裁剪框居中，所以可直接对半分
      this.cut_left = (this.window_width - this.cut_width) / 2;
    },
    // 计算图片的宽高信息 让图片的长边铺满裁剪框
    computedImageSize() {
      let imgWidth, imgHeight;
      //宽比较长
      // if (this.imgRatio >= 1) {
      if (this.imgRatio <= this.cutRatio) {
        imgWidth = this.cut_width;
        imgHeight = imgWidth / this.imgRatio;
      } else {
        // 高比较长
        imgHeight = this.cut_height;
        imgWidth = imgHeight * this.imgRatio;
      }
      this.imgHeight = imgHeight
      this.imgWidth = imgWidth
      console.log('img w h', this.imgWidth, this.imgHeight)
      // 计算图片相对可使用窗口的距离
      this.imgLeft = (this.window_width - this.imgWidth) / 2;
      this.imgTop = (this.window_height - this.imgHeight) / 2;
    },
    // 图片的点击，移动，移动结束事件
    img_touch_start(e) {
      this.touch_end_flag = false; //开始触摸
      if (e.touches.length === 1) {
        // 单指触摸
        this.touch_pointer_one = true;
        // 记录下开始时的触摸点的位置
        this.img_touch_relative[0] = {
          //减去图片相对视口的位置，得到手指相对图片的左上角的位置x,y
          x: e.touches[0].clientX - this.imgLeft,
          y: e.touches[0].clientY - this.imgTop,
        };
      } else {
        this.touch_pointer_one = false;
        //双指放大
        let width = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
        let height = Math.abs(e.touches[0].clientY - e.touches[1].clientY);

        this.hypotenuse_length = Math.sqrt(
          Math.pow(width, 2) + Math.pow(height, 2)
        );

        //双指旋转
        this.img_touch_relative = [
          {
            x: e.touches[0].clientX - this.imgLeft - this.imgWidth / 2,
            y: e.touches[0].clientY - this.imgTop - this.imgHeight / 2,
          },
          {
            x: e.touches[1].clientX - this.imgLeft - this.imgWidth / 2,
            y: e.touches[1].clientY - this.imgTop - this.imgHeight / 2,
          },
        ];
      }
    },

    img_touch_move(e) {
      //如果结束触摸，则不再移动
      if (this.touch_end_flag) {
        console.log("结束false");
        return;
      }

      if (e.touches.length === 1 && this.touch_pointer_one) {
        // 单指拖动
        let left = e.touches[0].clientX - this.img_touch_relative[0].x;
        let top = e.touches[0].clientY - this.img_touch_relative[0].y;
        if (left > this.cut_left) left = this.cut_left // 图片左边距不大于裁剪框左边距
        if (top > this.cut_top) top = this.cut_top // 图片顶边距不大于裁剪框顶边距
        if (left < (this.cut_left + this.cut_width - this.imgWidth)) left = (this.cut_left + this.cut_width - this.imgWidth)
        if (top < (this.cut_top + this.cut_height - this.imgHeight)) top = (this.cut_top + this.cut_height - this.imgHeight)
        this.imgLeft = left
        this.imgTop = top
      } else if (e.touches.length >= 2 && !this.touch_pointer_one) {
        //双指放大
        let width = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
        let height = Math.abs(e.touches[0].clientY - e.touches[1].clientY);

        let newhypotenuse_length = Math.sqrt(
          Math.pow(width, 2) + Math.pow(height, 2)
        );
        let newScale = (newhypotenuse_length / this.hypotenuse_length);
        // //放大的倍数，等于现在的倍数*（现在两点的距离/上次两点间的距离）
        // let newScale = this.scale * (newhypotenuse_length / this.hypotenuse_length);
        // //如果缩放倍数超过max_scale或是min_scale，则不变化，
        // newScale = (newScale > this.max_scale || newScale < this.min_scale) ? this.scale : newScale;
        this.hypotenuse_length = newhypotenuse_length;

        // 双指旋转
        this.img_touch_relative = [
          {
            x: e.touches[0].clientX - this.imgLeft - this.imgWidth / 2,
            y: e.touches[0].clientY - this.imgTop - this.imgHeight / 2,
          },
          {
            x: e.touches[1].clientX - this.imgLeft - this.imgWidth / 2,
            y: e.touches[1].clientY - this.imgTop - this.imgHeight / 2,
          },
        ];
        // this.scale = newScale
        let newWidth = this.imgWidth * newScale
        let newHeight = this.imgHeight * newScale
        let top = (newHeight - this.imgHeight) / 2
        let left = (newWidth - this.imgWidth) / 2
        this.imgTop = this.imgTop + top
        this.imgLeft = this.imgLeft + left
        this.imgWidth = this.imgWidth * newScale
        this.imgHeight = this.imgHeight * newScale
      }
    },

    img_touch_end() {
      this.touch_end_flag = true;
    },
    /**
     * 导出图片的本地地址
     */
    handleSave() {
      const { cut_height, cut_width, cutRatio, quality } = this;
      return new Promise((resolve, reject) => {
        this.handleDraw(() => {
          setTimeout(() => {
            wx.canvasToTempFilePath({
              width: cut_width,
              height: cut_height,
              destWidth: this.destWidth || cut_width,
              destHeight: this.destWidth ? this.destWidth / cutRatio : cut_height,
              canvasId: "cropper-canvasid",
              fileType: "png",
              quality: quality,
              success: res => {
                console.log(res, "成功");
                this.$emit('setPreview', res.tempFilePath)
                resolve(res);
              },
              fail: err => {
                console.log(err, "err");
                reject(err);
              },
            }); // }, this.$scope //不这样写会报错
          }, 200)
        })
      })
    },
    /**
     * 绘制图片
     */
    handleDraw(callback) {
      let {
        cut_height,
        cut_width,
        cut_left,
        cut_top,
        angle,
        scale,
        imgWidth,
        imgHeight,
        imgLeft,
        imgTop,
        imgSrc,
      } = this;

      this.canvas_height = cut_height
      this.canvas_width = cut_width
      this.canvas_left = cut_left
      this.canvas_top = cut_top

      imgWidth = imgWidth * scale;
      imgHeight = imgHeight * scale;
      // 图片和裁剪框的相对距离
      let distX = imgLeft - (imgWidth * (scale - 1)) / 2 - cut_left;
      let distY = imgTop - (imgHeight * (scale - 1)) / 2 - cut_top;
      console.log(this.ctx, "ctx前");

      // 根据图像的旋转角度，旋转画布的坐标轴,
      //为了旋转中心在图片的中心，需要先移动下画布的坐标轴
      this.ctx.translate(
        distX + imgWidth / 2,
        distY + imgHeight / 2
      );
      this.ctx.rotate((angle * Math.PI) / 180);
      this.ctx.translate(
        -distX - imgWidth / 2,
        -distY - imgHeight / 2
      );
      console.log(this.ctx, "ctx");
      //根据相对距离移动画布的原点
      this.ctx.translate(distX, distY);

      // 绘制图像

      this.ctx.drawImage(imgSrc, 0, 0, imgWidth, imgHeight);
      this.ctx.draw(false, () => {
        callback && callback();
      });
    }
  }
}
function throttle(fn, threshold = 1000 / 40, context = null) {
  let _lastExecTime = null;
  return function (...args) {
    let _nowTime = new Date().getTime();
    if (_nowTime - Number(_lastExecTime) > threshold || !_lastExecTime) {
      fn.apply(context, args);
      _lastExecTime = _nowTime;
    }
  };
}
</script>

<style lang="less">
@bgcolor: rgba(0, 0, 0, 0.8);
.image-cropper-wrapper {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #fff;
  .cropper-btn {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    height: 90rpx;
    line-height: 90rpx;
    color: #fff;
    background-color: #333;
    font-weight: bold;
    .btn-li {
      flex: 1;
      text-align: center;
    }
    .btn-save {
      color: #01b315;
    }
  }
  .bg_container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    pointer-events: none;
    .bg_top {
      flex: 1;
      background-color: @bgcolor;
    }
    .bg_middle {
      display: flex;
      .bg_middle_left,
      .bg_middle_right {
        flex: 1;
        background-color: @bgcolor;
      }
      .cut_wrapper {
        position: relative;
        .border {
          background-color: rgba(255, 255, 255, 0.4);
          position: absolute;
        }
        .border-top-left {
          height: 4px;
          top: -4px;
          left: -4px;
          width: 30rpx;
        }
        .border-left-top {
          height: 30rpx;
          top: -4px;
          left: -4px;
          width: 4px;
        }
        .border-top-right {
          top: -4px;
          right: -4px;
          width: 30rpx;
          height: 4px;
        }
        .border-right-top {
          top: -4px;
          right: -4px;
          height: 30rpx;
          width: 4px;
        }
        .border-right-bottom {
          bottom: -4px;
          right: -4px;
          height: 30rpx;
          width: 4px;
        }
        .border-bottom-right {
          width: 30rpx;
          height: 4px;
          bottom: -4px;
          right: -4px;
        }
        .border-left-bottom {
          height: 30rpx;
          width: 4px;
          bottom: -4px;
          left: -4px;
        }
        .border-bottom-left {
          width: 30rpx;
          height: 4px;
          bottom: -4px;
          left: -4px;
        }
      }
    }
    .bg_bottom {
      flex: 1;
      background-color: @bgcolor;
    }
  }
  .img {
    position: absolute;
    z-index: -1;
    backface-visibility: hidden;
    transform-origin: center center;
  }
  .cropper-canvas {
    position: absolute;
    z-index: -2;
  }
}
</style>