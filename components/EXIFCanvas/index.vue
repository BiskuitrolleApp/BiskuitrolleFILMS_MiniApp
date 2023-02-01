<template>
  <view class="exifCanvas" @click="clickCanvas">
    <view class="viewer">
      <view>
        <image class="showImgageWrapper" :src="tempViewImage" mode="widthFix" :style="{ width: '320px', height: 'auto' }" v-show="tempViewImage" />
      </view>
      <view v-show="!tempViewImage">
        <canvas class="canvas" id="exifCanvas" canvas-id="exifCanvas" :style="[canvasStyle]"></canvas>
      </view>
    </view>
    <!-- <view class="downloader" v-show="showGenerator"> -->
    <view class="downloader">
      <canvas class="downloaderCanvas" id="downloaderCanvas" canvas-id="downloaderCanvas" :style="[downloaderCanvasStyle]"></canvas>
    </view>
  </view>
</template>

<script>
import { EXIFDrawJSON, EXIFRedraw, EXIFReload } from "@/libs/configCanvas";
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

      tempViewImage: "",
      tempDownloadImage: "",
      tempImageBase64: "",
    };
  },
  //监控data中的数据变化
  watch: {
    value: {
      handler(newValue, oldValue) {
        // console.log("newValue, oldValue", newValue, oldValue);
        if (newValue.length > 0 && oldValue.length > 0 && this.autoReDraw) {
          EXIFDrawJSON(this.canvas, this, newValue);
        }
      },
      deep: true,
    },
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    let that = this;
    // setTimeout(() => {
    that.canvas = uni.createCanvasContext("exifCanvas", this);
    //   EXIFDrawJSON(that.canvas, that, that.value, {}, function () {
    //     console.log("EXIFDrawJSON end cb 1");
    //   });
    // }, 500);
  },
  //方法集合
  methods: {
    clickCanvas() {
      this.$emit("click");
    },
    // 使用显示图片替换canvas
    showCanvasImage() {
      let that = this;
      let scaling = 1;
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
          canvasId: "exifCanvas",
          // canvas: that.canvas,
          fileType: "jpg",
          success: (res) => {
            // that.tempDownloadImage = res.tempFilePath;
            that.tempViewImage = res.tempFilePath;
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
    },

    setCanvasConfigList(configList = []) {
      let list = _.cloneDeep(configList);
      this.EXIFConfigList = list;
      this.$emit("EXIFConfigUpdata", list);
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
        filePath: that.tempDownloadImage,
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

    // 重新绘制逻辑
    async EXIFInfoRedraw(value = {}) {
      let newEXIFConfigList = _.cloneDeep(value);
      value = await EXIFReload(this.canvas, this, newEXIFConfigList);
      this.EXIFConfigList = newEXIFConfigList;
      this.tempViewImage = "";
      // 渲染列表操作
      EXIFRedraw(this.canvas, this, newEXIFConfigList, {}, () => {
        console.log("reset");
        this.showCanvasImage();
      });
    },
    // 绘制逻辑
    draw() {
      this.tempViewImage = "";
      EXIFDrawJSON(this.canvas, this, this.value, {}, () => {
        console.log("EXIFDrawJSON end cb 1");
        this.showCanvasImage();
      });
    },
    // 下载器
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
                  that.tempDownloadImage = res.tempFilePath;
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

    /**
     * 重绘方法，ref 可以直接调用
     */
    $redraw(value) {
      this.EXIFInfoRedraw(value);
    },
    /**
     * 绘制方法，ref 可以直接调用
     */
    $draw() {
      this.draw();
    },
    /**
     * 下载方法，ref 可以直接调用
     */
    $downLoad() {
      this.downLoader();
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
    // border: 1px rgb(229, 222, 255) solid;
    // margin: 10px;
    min-width: 320px;
    height: 320px;
    // background: rgb(229, 222, 255);
    border: 1px dashed #ccc;
  }
  .showImgageWrapper {
    border: 1px dashed #ccc;
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
