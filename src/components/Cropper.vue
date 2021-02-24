<template>
  <view class="image-cropper-wrapper">
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
    <image class="img" :src="imgSrc" @touchstart='_img_touch_start($event)' @touchmove='img_touch_move($event)' @touchend='_img_touch_end()' :style='{
						width: img_width * scale + "px",
						height: img_height * scale + "px",
						top: img_top - (img_height * (scale - 1)) / 2 + "px",
						left: img_left - (img_width * (scale - 1)) / 2 + "px",
						// translate3d(${img_left}px,${img_top}px,0)
						transform: `rotate(${angle}deg) `,
					}' />
    <canvas canvasId="my-canvas" class="my-canvas-class" :disableScroll='false' :style='{
						width: canvas_width + "px",
						height: canvas_height + "px",
						left: canvas_left + "px",
						top: canvas_top + "px",
					}'></canvas>
  </view>
</template>

<script>
import Taro from '@tarojs/taro'
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
export default {
  props: {
    imgSrc: '', //图片路径
    // cut_ratio: 0.5, //裁剪框的 宽/高 比
    // destWidth: null, //要导出的图片的宽度
    // img_height: null, //图片的高度
    // img_width: null, //图片的宽度
    // img_left: null, //图片相对可使用窗口的左边距
    // img_top: null, //图片相对可使用窗口的上边距
  },
  watch: {
    imgSrc(newV, oldV) {
      console.log(newV, oldV)
    }
  },
  data() {
    return {
      destWidth: null,
      // imgSrc: props.imgSrc,
      // cut_ratio: props.cut_ratio, //裁剪框的 宽/高 比
      cut_ratio: 1, //裁剪框的 宽/高 比
      img_height: 0, //图片的高度
      img_width: 0, //图片的宽度
      img_ratio: 2, //图片的 宽/高 比
      img_left: 0, //图片相对可使用窗口的左边距
      img_top: 0, //图片相对可使用窗口的上边距
      window_height: 0, //可使用窗口的高度
      window_width: 0, //可使用窗口宽度
      canvas_width: 0, //canvas的宽度
      canvas_height: 0, //canvas的高度
      canvas_left: 0, //canvas相对可使用窗口的左边距
      canvas_top: 0, //canvas相对可使用窗口的上边距
      cut_width: 200, //裁剪框的宽度
      cut_height: 200, //裁剪框的高度
      cut_left: 0, //裁剪框相对可使用窗口的左边距
      cut_top: 0, //裁剪框相对可使用窗口的上边距
      scale: 1, //默认图片的放大倍数
      angle: 0, //图片旋转角度
      max_scale: 2,//图片可以放大的最大倍数
      min_scale: 0.5,// 图片可以缩小的最小倍数
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
      ],
      // 斜边长
      hypotenuse_length: 0,
      // img_touch_move: throttle(this.img_touch_move, 1000 / 40, this)
    }
  },
  async mounted() {
    this.img_touch_move = throttle(this.img_touch_move, 1000 / 40, this)
    this.initCanvas();
    await this.getDeviceInfo();
    this.computedCutSize();
    this.computedCutDistance();
    this.initImageInfo();
    this.computedImageSize();
    this.computedImageDistance();
  },
  methods: {
    setState(data) {
      for (let key in data) {
        this[key] = data[key]
      }
    },
    /**
   *  获取canvas上下文
   */
    initCanvas() {
      this.ctx = Taro.createCanvasContext("my-canvas", this.$scope);
    },
    /**
     * 获取设备屏幕的宽高
     */
    async getDeviceInfo() {
      let { windowHeight, windowWidth } = await Taro.getSystemInfoSync();
      this.window_width = windowWidth
      this.window_height = windowHeight
    },
    /**
     * 初始化图片信息
     */
    async initImageInfo() {
      const { imgSrc } = this;
      const { width, height, path } = await Taro.getImageInfo({
        src: imgSrc,
      });
      this.imgSrc = path
      this.img_ratio = width / height
    },
    /**
     *  计算裁剪框的宽高
     */
    computedCutSize() {
      const { window_width, window_height, cut_ratio } = this; // this.state;
      //设裁剪框的框度为可使用窗口宽度的2/3
      let initialcut_width = Math.floor((window_width * 2) / 3);
      //则裁剪框的高度 = 宽度/_cut_ratio
      let initialcut_height = initialcut_width / cut_ratio;

      // 如果计算后的高度大于等于屏幕高度，则让裁剪框的高度等于可使用窗口的1/2
      if (initialcut_height >= window_height) {
        initialcut_height = Math.floor(window_height / 2);
        initialcut_width = initialcut_height * cut_ratio;
      }
      this.cut_height = initialcut_height
      this.cut_width = initialcut_width
    },
    /**
     *  计算裁剪框距离可使用窗口的距离
     */
    computedCutDistance() {
      const {
        window_height,
        window_width,
        cut_height,
        cut_width,
      } = this; // this.state;
      const cut_top = (window_height - cut_height) / 2; //因为裁剪框居中，所以可直接对半分
      const cut_left = (window_width - cut_width) / 2;
      this.cut_top = cut_top
      this.cut_left = cut_left
      // return new Promise((resolve) => {
      //   this.setState(
      //     {
      //       cut_top,
      //       cut_left,
      //     },
      //     resolve
      //   );
      // });
    },
    /**
     * 计算图片的宽高信息
     * 让图片的长边铺满裁剪框
     */
    computedImageSize() {
      const { img_ratio, cut_height, cut_width } = this;
      let img_width, img_height;
      //宽比较长
      if (img_ratio >= 1) {
        img_width = cut_width;
        img_height = img_width / img_ratio;
      } else {
        // 高比较长
        img_height = cut_height;
        img_width = img_height * img_ratio;
      }
      this.img_height = img_height // Number(this.props.img_height) || img_height,
      this.img_width = img_width // Number(this.props.img_width) || img_width,
      console.log('imgw', this.img_width)
      console.log('imgh', this.img_height)
      // return new Promise((resovle) => {
      //   this.setState(
      //     {
      //       img_height: Number(this.props.img_height) || img_height,
      //       img_width: Number(this.props.img_width) || img_width,
      //     },
      //     resovle
      //   );
      // });
    },

    /**
     * 计算图片相对可使用窗口的距离
     */
    computedImageDistance() {
      const {
        img_width,
        img_height,
        window_height,
        window_width,
      } = this; // this.state;
      let img_left, img_top;
      img_left = (window_width - img_width) / 2;
      img_top = (window_height - img_height) / 2;
      this.img_left = img_left
      this.img_top = img_top
    },

    /**
     *  图片的点击，移动，移动结束事件
     */
    _img_touch_start(e) {
      this._touch_end_flag = false; //开始触摸
      if (e.touches.length === 1) {
        // 是否单指触摸
        this._touch_pointer_one = true;
        // 单指触摸
        // 记录下开始时的触摸点的位置
        this.img_touch_relative[0] = {
          //减去图片相对视口的位置，得到手指相对图片的左上角的位置x,y
          x: e.touches[0].clientX - this.img_left,
          y: e.touches[0].clientY - this.img_top,
        };
      } else {
        this._touch_pointer_one = false;
        //双指放大
        let width = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
        let height = Math.abs(e.touches[0].clientY - e.touches[1].clientY);

        this.hypotenuse_length = Math.sqrt(
          Math.pow(width, 2) + Math.pow(height, 2)
        );

        //双指旋转
        this.img_touch_relative = [
          {
            x:
              e.touches[0].clientX -
              this.img_left -
              this.img_width / 2,
            y:
              e.touches[0].clientY -
              this.img_top -
              this.img_height / 2,
          },
          {
            x:
              e.touches[1].clientX -
              this.img_left -
              this.img_width / 2,
            y:
              e.touches[1].clientY -
              this.img_top -
              this.img_height / 2,
          },
        ];
      }
    },

    img_touch_move(e) {
      //如果结束触摸，则不再移动
      if (this._touch_end_flag) {
        console.log("结束false");
        return;
      }

      if (e.touches.length === 1 && this._touch_pointer_one) {
        // 单指拖动
        let left = e.touches[0].clientX - this.img_touch_relative[0].x;
        let top = e.touches[0].clientY - this.img_touch_relative[0].y;
        this.img_left = left
        this.img_top = top
      } else if (e.touches.length >= 2 && !this._touch_pointer_one) {
        //双指放大
        let width = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
        let height = Math.abs(e.touches[0].clientY - e.touches[1].clientY);

        let newhypotenuse_length = Math.sqrt(
          Math.pow(width, 2) + Math.pow(height, 2)
        );
        //放大的倍数，等于现在的倍数*（现在两点的距离/上次两点间的距离）
        let newScale =
          this.scale *
          (newhypotenuse_length / this.hypotenuse_length);
        //如果缩放倍数超过max_scale或是min_scale，则不变化，
        newScale =
          newScale > this.max_scale ||
            newScale < this.min_scale
            ? this.scale
            : newScale;
        this.hypotenuse_length = newhypotenuse_length;

        // 双指旋转
        let _newimg_touch_relative = [
          {
            x:
              e.touches[0].clientX -
              this.img_left -
              this.img_width / 2,
            y:
              e.touches[0].clientY -
              this.img_top -
              this.img_height / 2,
          },
          {
            x:
              e.touches[1].clientX -
              this.img_left -
              this.img_width / 2,
            y:
              e.touches[1].clientY -
              this.img_top -
              this.img_height / 2,
          },
        ];
        // 第一根手指的旋转角度
        let first_atan_old =
          (180 / Math.PI) *
          Math.atan2(
            this.img_touch_relative[0].y,
            this.img_touch_relative[0].x
          );
        let first_atan =
          (180 / Math.PI) *
          Math.atan2(
            _newimg_touch_relative[0].y,
            _newimg_touch_relative[0].x
          );

        let first_deg = first_atan - first_atan_old;
        // 第二根手指的旋转角度
        let second_atan_old =
          (180 / Math.PI) *
          Math.atan2(
            this.img_touch_relative[1].y,
            this.img_touch_relative[1].x
          );

        let second_atan =
          (180 / Math.PI) *
          Math.atan2(
            _newimg_touch_relative[1].y,
            _newimg_touch_relative[1].x
          );
        let second_deg = second_atan - second_atan_old;
        // 当前的旋转角度
        let current_deg = 0;
        if (first_deg != 0 && first_deg != 360) {
          current_deg = first_deg;
        } else if (second_deg != 0 && second_deg != 360) {
          current_deg = second_deg;
        }
        this.img_touch_relative = _newimg_touch_relative;
        this.scale = newScale
        this.angle = this.angle + current_deg
      }
    },

    _img_touch_end() {
      this._touch_end_flag = true;
    },
    /**
     * 导出图片的本地地址
     */
    getImg() {
      const { cut_height, cut_width, cut_ratio, quality } = this;
      return new Promise((resolve, reject) => {
        this.handleDraw(() => {
          setTimeout(() => {
            Taro.canvasToTempFilePath({
              width: cut_width,
              height: cut_height,
              destWidth: this.destWidth || cut_width,
              destHeight: this.destWidth ? this.destWidth / cut_ratio : cut_height,
              canvasId: "my-canvas",
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
            }, this.$scope); // }, this.$scope //不这样写会报错
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
        img_width,
        img_height,
        img_left,
        img_top,
        imgSrc,
      } = this; // this.state;

      this.canvas_height = cut_height
      this.canvas_width = cut_width
      this.canvas_left = cut_left
      this.canvas_top = cut_top

      img_width = img_width * scale;
      img_height = img_height * scale;
      // 图片和裁剪框的相对距离
      let distX = img_left - (img_width * (scale - 1)) / 2 - cut_left;
      let distY = img_top - (img_height * (scale - 1)) / 2 - cut_top;
      console.log(this.ctx, "ctx前");

      // 根据图像的旋转角度，旋转画布的坐标轴,
      //为了旋转中心在图片的中心，需要先移动下画布的坐标轴
      this.ctx.translate(
        distX + img_width / 2,
        distY + img_height / 2
      );
      this.ctx.rotate((angle * Math.PI) / 180);
      this.ctx.translate(
        -distX - img_width / 2,
        -distY - img_height / 2
      );
      console.log(this.ctx, "ctx");
      //根据相对距离移动画布的原点
      this.ctx.translate(distX, distY);

      // 绘制图像

      this.ctx.drawImage(imgSrc, 0, 0, img_width, img_height);
      this.ctx.draw(false, () => {
        callback && callback();
      });
    }
  }
}
</script>

<style lang="less">
.image-cropper-wrapper {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: #fff;
  .bg_container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    pointer-events: none;
    .bg_top {
      flex: 1;
      background-color: rgba(0, 0, 0, 0.3);
    }
    .bg_middle {
      display: flex;
      .bg_middle_left,
      .bg_middle_right {
        flex: 1;
        background-color: rgba(0, 0, 0, 0.3);
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
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
  .img {
    position: absolute;
    z-index: -1;
    backface-visibility: hidden;
    transform-origin: center center;
  }
  .my-canvas-class {
    position: absolute;
    z-index: -2;
  }
}
</style>