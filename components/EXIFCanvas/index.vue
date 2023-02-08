<template>
  <view class="exifCanvas" @click="clickCanvas">
    <!-- <view>{{tempViewImage}}</view> -->
    <view class="viewer">
      <view v-show="tempViewImage" class="showImgageWrapper">
        <u--image showMenuByLongpress="true" :showLoading="true" :src="tempViewImage" :width="canvasStyle.width" :height="canvasStyle.height" mode="aspectFit"></u--image>
        <!-- <image class="showImgageWrapper" show-menu-by-longpress="true" :src="tempViewImage" mode="aspectFit" :style="[canvasStyle]" /> -->
      </view>
      <view v-show="!tempViewImage">
        <canvas class="canvas" id="exifCanvas" canvas-id="exifCanvas" :style="[canvasStyle]"></canvas>
      </view>
    </view>
    <!-- <view class="downloader" v-show="showGenerator"> -->
    <view class="downloader" v-show="showGenerator">
      <canvas class="downloaderCanvas" id="downloaderCanvas" canvas-id="downloaderCanvas" :style="[downloaderCanvasStyle]"></canvas>
    </view>
  </view>
</template>

<script>
import { EXIFDrawJSON, EXIFRedraw, EXIFReload } from "@/libs/configCanvas";
import { getScaling, getCoreVar } from "@/libs/configCanvas/var";
import tools from "@/libs/tools/index.js";
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
      test: "",
      downloaderCanvasStyle: {},
      showGenerator: false,

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
      let width = tools.times(photoDrawInfo.width, scaling, 1);
      let height = tools.times(photoDrawInfo.height, scaling, 1);
      uni.showLoading({
        title: "生成中...",
        duration: 60000,
        mask: true,
      });
      setTimeout(() => {
        uni.hideLoading();
        uni.canvasToTempFilePath(
          {
            //将canvas生成图片
            x: 0,
            y: 0,
            width: width,
            height: height,
            canvasId: "exifCanvas",
            // canvas: this.canvas,
            // quality: "1", // 图片质量
            fileType: "jpg",
            success: (res) => {
              // that.tempDownloadImage = res.tempFilePath;
              that.tempViewImage = res.tempFilePath;
              uni.hideLoading();
            },
            fail: (err) => {
              console.log(err);
              that.loading = false;
              uni.hideLoading();
            },
          },
          that
        );
      }, 2000);
    },

    setCanvasConfigList(configList = []) {
      console.log("setCanvasConfigList");
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
            console.log("this.", this);
            style.width = tools.times(item.width, scaling, 1) + "px";
            style.height = tools.times(item.height, scaling, 1) + "px";
            // style.width = item.width + "px";
            // style.height = item.height + "px";
            break;
          }
        }
        let isDownloader = getCoreVar("downloader");
        if (!isDownloader) {
          this.canvasStyle = style;
          this.test = JSON.stringify(style);
        } else {
          this.downloaderCanvasStyle = style;
        }
        console.log("style", style, isDownloader, scaling);
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
      uni.hideLoading();
      uni.showLoading({
        title: "下载中...",
        duration: 15000,
        mask: true,
      });
      uni.saveImageToPhotosAlbum({
        filePath: that.tempDownloadImage,
        success() {
          uni.hideLoading();
          uni.showToast({
            title: "图片已保存图片到相册",
            icon: "none",
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
      EXIFRedraw(
        this.canvas,
        this,
        newEXIFConfigList,
        {
          downloader: false,
        },
        () => {
          console.log("reset");
          this.showCanvasImage();
        }
      );
    },
    // 绘制逻辑
    draw() {
      this.tempViewImage = "";
      console.log("EXIFDrawJSON draw start");
      EXIFDrawJSON(
        this.canvas,
        this,
        this.value,
        {
          downloader: false,
        },
        () => {
          console.log("EXIFDrawJSON end cb 1");
          this.showCanvasImage();
        }
      );
    },
    // 下载器
    downLoader() {
      let that = this;
      uni.showLoading({
        title: "生成中..",
        icon: "none",
        duration: 60000,
      });
      console.log("down");
      this.showGenerator = true;

      let tempCanvas = uni.createCanvasContext("downloaderCanvas", this);
      EXIFRedraw(
        tempCanvas,
        that,
        this.EXIFConfigList,
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
          setTimeout(() => {
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
                  console.log("res.tempFilePath", res.tempFilePath);
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
          }, 2000);
        }
      );
    },

    // downLoader() {
    //   let that = this;
    //   console.log("down");
    //   this.showGenerator = true;
    //   setTimeout(() => {
    //     let tempCanvas = uni.createCanvasContext("downloaderCanvas", this);
    //     EXIFDrawJSON(
    //       tempCanvas,
    //       that,
    //       that.value,
    //       {
    //         downloader: true,
    //       },
    //       function () {
    //         console.log("EXIFDrawJSON end cb");
    //         let scaling = getScaling();
    //         let photoDrawInfo = {};
    //         for (let index = 0; index < that.EXIFConfigList.length; index++) {
    //           const item = that.EXIFConfigList[index];
    //           if (item.root) {
    //             photoDrawInfo = item;
    //           }
    //         }
    //         uni.canvasToTempFilePath(
    //           {
    //             //将canvas生成图片
    //             x: 0,
    //             y: 0,
    //             width: photoDrawInfo.width * scaling,
    //             height: photoDrawInfo.height * scaling,
    //             canvasId: "downloaderCanvas",
    //             // canvas: that.canvas,
    //             fileType: "jpg",
    //             success: (res) => {
    //               that.tempDownloadImage = res.tempFilePath;
    //               try {
    //                 uni.getFileSystemManager().readFile({
    //                   filePath: res.tempFilePath,
    //                   encoding: "base64",
    //                   success: (res2) => {
    //                     let base64 = "data:image/jpeg;base64," + res2.data; //不加上这串字符，在页面无法显示
    //                     that.tempImageBase64 = base64;
    //                     that.showGenerator = false;
    //                     that.downloadImage();
    //                   },
    //                 });
    //               } catch (e) {
    //                 console.log("urlTobase64", e);
    //                 that.showGenerator = false;
    //               }
    //             },
    //             fail: (err) => {
    //               console.log(err);
    //               that.loading = false;
    //               uni.hideLoading();
    //               that.showGenerator = false;
    //             },
    //           },
    //           that
    //         );
    //       }
    //     );
    //   }, 500);
    // },

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
    // min-height: 320px;
    // background: rgb(229, 222, 255);
    border: 1px dashed #ccc;
    opacity: 0;
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
