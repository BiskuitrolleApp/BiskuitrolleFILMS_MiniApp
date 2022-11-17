<template>
  <view class="exifCanvas">
    <canvas
      class="canvas"
      id="exifCanvas"
      canvas-id="exifCanvas"
      :style="[canvasStyle]"
    ></canvas>
    <!-- <view class="downloader" v-show="showGenerator"> -->
    <view class="downloader">
      <canvas
        class="downloaderCanvas"
        id="downloaderCanvas"
        canvas-id="downloaderCanvas"
        :style="[downloaderCanvasStyle]"
      ></canvas>
    </view>
  </view>
</template>

<script>
import { EXIFDrawJSON, EXIFRedraw } from "@/libs/configCanvas";
import { getScaling, getCoreVar } from "@/libs/configCanvas/var";
export default {
  props: {
    value: {
      default: [],
      type: Array,
    },
    autoReDraw: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    //这里存放数据
    return {
      EXIFConfigList: [],
      canvas: null,
      canvasStyle: {},
      downloaderCanvasStyle: {},
      showGenerator: true,

      tempImage: "",
      tempImageBase64: "",
    };
  },
  //监控data中的数据变化
  watch: {
    value: {
      handler(newValue, oldValue) {
        // console.log("newValue, oldValue", newValue, oldValue);
        if (newValue.length > 0) {
          if (oldValue.length > 0) {
            if (this.autoReDraw) {
              EXIFDrawJSON(this.canvas, this, newValue);
            }
          }
          if (oldValue.length == 0) {
            EXIFDrawJSON(this.canvas, this, newValue);
          }
        }
      },
      deep: true,
    },
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    let that = this;
    setTimeout(() => {
      that.canvas = uni.createCanvasContext("exifCanvas", this);
      EXIFDrawJSON(that.canvas, that, that.value, {}, function () {
        console.log("EXIFDrawJSON end cb 1");
      });
    }, 500);
  },
  //方法集合
  methods: {
    setCanvasConfigList(list = []) {
      this.EXIFConfigList = list;
      if (list.length > 0) {
        let scaling = getScaling();
        // 设置 canvas 样式
        let style = {};
        for (let index = 0; index < list.length; index++) {
          const item = list[index];
          if (item.root) {
            style.width = item.width * scaling + "px";
            style.height = item.height * scaling + "px";
            // style.width = item.width + "px";
            // style.height = item.height + "px";
            break;
          }
        }
        let isDownloader = getCoreVar("downloader");
        if (!isDownloader) {
          this.canvasStyle = style;
        } else {
          this.downloaderCanvasStyle = style;
        }
        console.log("style", style);
      }
    },
    downLoader() {
      let that = this;
      console.log("down");
      this.showGenerator = true;
      setTimeout(() => {
        let tempCanvas = uni.createCanvasContext("downloaderCanvas", this);
        EXIFDrawJSON(
          tempCanvas,
          that,
          that.value,
          {
            downloader: true,
          },
          function () {
            console.log("EXIFDrawJSON end cb");
            let scaling = getScaling();
            let photoDrawInfo = {};
            for (let index = 0; index < that.EXIFConfigList.length; index++) {
              const item = that.EXIFConfigList[index];
              if (item.root) {
                photoDrawInfo = item;
              }
            }
            uni.canvasToTempFilePath(
              {
                //将canvas生成图片
                x: 0,
                y: 0,
                width: photoDrawInfo.width * scaling,
                height: photoDrawInfo.height * scaling,
                canvasId: "downloaderCanvas",
                // canvas: that.canvas,
                fileType: "jpg",
                success: (res) => {
                  that.tempImage = res.tempFilePath;
                  try {
                    uni.getFileSystemManager().readFile({
                      filePath: res.tempFilePath,
                      encoding: "base64",
                      success: (res2) => {
                        let base64 = "data:image/jpeg;base64," + res2.data; //不加上这串字符，在页面无法显示
                        that.tempImageBase64 = base64;
                        that.showGenerator = false;
                        that.downloadImage();
                      },
                    });
                  } catch (e) {
                    //TODO handle the exception
                    console.log("urlTobase64", e);
                    that.showGenerator = false;
                  }
                },
                fail: (err) => {
                  console.log(err);
                  that.loading = false;
                  uni.hideLoading();
                  that.showGenerator = false;
                },
              },
              that
            );
          }
        );
      }, 500);
    },

    //点击保存到相册
    downloadImage() {
      var that = this;
      // let { photoDrawInfo } = this;
      // let compressTime = tools.formatNumber(
      //   tools.formatDecimal(photoDrawInfo.compress / 100, 2)
      // );
      // if (
      //   photoDrawInfo.width * compressTime > 3000 ||
      //   photoDrawInfo.height * compressTime > 3000
      // ) {
      //   uni.showLoading({
      //     title: "文件较大，下载中...",
      //     duration: 60000,
      //     mask: true,
      //   });
      // } else {
      //   uni.showLoading({
      //     title: "下载中...",
      //     duration: 15000,
      //     mask: true,
      //   });
      // }
      uni.saveImageToPhotosAlbum({
        filePath: that.tempImage,
        success() {
          uni.hideLoading();
          uni.showToast({
            title: "图片已保存图片到相册",
            icon: "none",
            duration: 2000,
          });
        },
        fail(error) {
          console.log("error", error);
          uni.hideLoading();
          if (error.errMsg.indexOf("cancel") >= 0) {
            uni.showToast({
              title: "取消保存",
              icon: "none",
            });
          } else {
            uni.showToast({
              title: "保存失败，请检查权限功能重试",
              icon: "none",
            });
          }
        },
      });
      that.loading = false;
      uni.hideLoading();
    },
  },
};
</script>
<style lang="scss" scoped>
.exifCanvas {
  display: flex;
  align-items: center;
  justify-content: center;
  // overflow: hidden;
  position: relative;
  .canvas {
    border: 1px rgb(229, 222, 255) solid;
    margin: 10px;
    min-width: 320px;
    height: 320px;
    background: rgb(229, 222, 255);
  }
  .downloaderCanvas {
    // visibility: hidden;
    position: absolute;
    // left: 0px;
    // right: 0px;
    // background: rgb(177, 229, 190);
    left: 10000px;
  }
}
</style>


