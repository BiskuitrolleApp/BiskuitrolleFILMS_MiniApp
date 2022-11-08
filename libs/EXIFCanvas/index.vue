<template>
  <view class="exifCanvas">
    <canvas
      class="canvas"
      id="exifCanvas"
      canvas-id="exifCanvas"
      :style="[canvasStyle]"
    ></canvas>
  </view>
</template>

<script>
import { EXIFDrawJSON } from "@/libs/configCanvas";
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
      showGenerator: false,

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
      EXIFDrawJSON(that.canvas, that, that.value);
    }, 500);
  },
  //方法集合
  methods: {
    setCanvasConfigList(list = []) {
      this.EXIFConfigList = list;
      if (list.length > 0) {
        // 设置 canvas 样式
        let style = {};
        for (let index = 0; index < list.length; index++) {
          const item = list[index];
          if (item.root) {
            style.width = item.width + "px";
            style.height = item.height + "px";
            break;
          }
        }
        this.canvasStyle = style;
      }
    },
    downLoader() {
      let that = this;
      console.log("down");
      let { EXIFConfigList } = this;
      this.showGenerator = true;
      let photoDrawInfo = {};
      for (let index = 0; index < EXIFConfigList.length; index++) {
        const item = EXIFConfigList[index];
        if (item.root) {
          photoDrawInfo = item;
        }
      }

      uni.canvasToTempFilePath(
        {
          //将canvas生成图片
          x: 0,
          y: 0,
          width: photoDrawInfo.width,
          height: photoDrawInfo.height,
          canvasId: "exifCanvas",
          // canvas: that.canvas,
          fileType: "jpg",
          success: (res) => {
            console.log("res.tempFilePath", res.tempFilePath);
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
  .canvas {
    border: 1px rgb(229, 222, 255) solid;
    margin: 10px;
    min-width: 320px;
    height: 320px;
    background: rgb(229, 222, 255);
  }
}
</style>


