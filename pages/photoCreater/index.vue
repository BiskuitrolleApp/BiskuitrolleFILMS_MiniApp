<template>
  <view class="photoCreater">
    <view class="canvas-box" @click="onUpdatedFile" v-if="emptyCanvas">
      <view class="iconTipBox_wrapper">
        <view class="icon_wrapper"><u-icon name="photo"></u-icon></view>
        <view class="tip">点击上传图片</view>
      </view>
    </view>
    <exif-canvas :value="configListInfo" ref="exifCanvas"></exif-canvas>
    <view class="downLoadBtn">
      <u-button
        text="下载"
        size="normal"
        color="#67C23A"
        @click="saveImage"
      ></u-button>
    </view>
  </view>
</template>

<script>
// import { EXIFDrawJSON } from "@/libs/configCanvas";
import exifCanvas from "@/components/EXIFCanvas";
import { ImageInfo } from "./js/readImageInfo";
import dataMap from "./config/dataMap";
import setContentByInputType from "./js/inputConfigSetter";
import tools from "@/libs/tools";

export default {
  components: {
    exifCanvas,
  },
  data() {
    return {
      emptyCanvas: true,
      userInfo: {},
      imageInfo: {},
      configListInfo: [
        {
          id: "canvas",
          child: [
            {
              type: "imageMain",
              maxWidth: 320, // 只能设置宽度
              content: "http://127.0.0.1/image/test.JPG",
              // content: "http://127.0.0.1/image/test2.JPG",
              // border: "20 solid #ccc",
              // margin:'20',
              // padding:'20',
              // round: 10,
              input: {
                type: "imageMain",
                id: "imageMain",
              },
            },
            {
              content: "",
              display: "flex",
              horizontal: "space-between",
              vertical: "center",
              width: 320,
              child: [
                {
                  content: "",
                  width: 100,
                  child: [
                    {
                      type: "text",
                      content: "",
                      padding: "10 10 1 10",
                      font: {
                        fontSize: 8,
                        bold: true,
                      },
                      input: {
                        content:'XSXS',
                        type: "input",
                        id: "Model",
                      },
                    },
                    {
                      type: "text",
                      content: "",
                      padding: "1 10 10 10",
                      font: {
                        fontSize: 8,
                      },
                      input: {
                        content: "PHOTO BY @User",
                        type: "input",
                        id: "Author",
                      },
                    },
                  ],
                },
                {
                  width: 180,
                  horizontal: "right",
                  vertical: "center",
                  display: "flex",
                  // border: "1 solid #000",
                  content: "66",
                  margin: "0 10 0 0",
                  child: [
                    {
                      type: "image",
                      // height: 20, // 只能设置宽度
                      maxHeight: 20,
                      maxWidth: 60,
                      content: "",
                      // content: "http://127.0.0.1/image/leica.png",
                      // marign: "0 5 0 0",
                      margin: "0 5 0 0",
                      input: {
                        content: "http://127.0.0.1/image/fujifilm.png",
                        type: "icon",
                        id: "Make",
                      },
                    },
                    {
                      type: "block",
                      border: "0 0 0 0.7 solid #000",
                      margin: "0 5 0 0",
                      // border: "1 solid #000",
                      child: [
                        {
                          type: "text",
                          content: "XSXS",
                          padding: "0 0 1 5",
                          // border: "1 solid #000",
                          font: {
                            fontSize: 8,
                            textAlign: "right",
                            bold: true,
                          },
                          input: {
                            content: "56mm f/2.2 1/1600 ISO600",
                            type: "input",
                            id: "ShotInfo",
                          },
                        },
                        {
                          type: "text",
                          content: "",
                          padding: "1 0 0 5",
                          // border: "1 solid #000",
                          font: {
                            fontSize: 8,
                            textAlign: "right",
                          },
                          input: {
                            content: "2022-01-01 00:00:00",
                            type: "input",
                            id: "DateTime",
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  },
  mounted() {
    // let ctx = uni.createCanvasContext("canvas");
    // EXIFDrawJSON(ctx, this, this.demo);
  },
  //方法集合
  methods: {
    saveImage() {
      this.$refs.exifCanvas.downLoader();
    },
    // 点击重新上传图片
    async onUpdatedFile() {
      let that = this;
      try {
        that.getUserInfo(that.chooseImage);
        uni.hideLoading();
      } catch (e) {
        uni.showToast({
          icon: "error",
          duration: 1000,
          title: "需要用户信息",
        });
        uni.hideLoading();
      }
    },
    // 获取用户信息
    getUserInfo(callback) {
      let that = this;
      console.log(that.userInfo);
      if (that.userInfo && that.userInfo.nickName) {
        console.log(that.userInfo);
        if (callback && typeof callback == "function") {
          callback();
        }
      }
      uni.showLoading({
        title: "获取用户信息",
        duration: 15000,
        mask: true,
      });
      uni.getStorage({
        key: "userInfo",
        success: function ({ data }) {
          let time = new Date().getTime();
          if (data.expirationTime && time < data.expirationTime) {
            that.userInfo = data.userInfo;
            that.userInfo.author =
              "PHOTO BY @" + that.userInfo.nickName || "User";
            if (callback && typeof callback == "function") {
              callback();
            }
          } else {
            that.getUserProfile(callback);
          }
          uni.hideLoading();
        },
        fail: () => {
          that.getUserProfile(callback);
          uni.hideLoading();
        },
      });
    },
    // 重新请求获取用户信息
    getUserProfile(callback) {
      let that = this;
      uni.getUserProfile({
        desc: "用于您的页面展示用户头像与昵称",
        lang: "zh_CN",
        success: (resData) => {
          that.userInfo = resData.userInfo;
          that.userInfo.author =
            "PHOTO BY @" + that.userInfo.nickName || "User";
          uni.setStorageSync("userInfo", {
            userInfo: resData.userInfo,
            expirationTime: new Date().getTime() + 12 * 60 * 60 * 1000, // 过期时间为12小时
          });
          if (callback && typeof callback == "function") {
            callback();
          }
        },
        fail: () => {
          uni.setStorageSync("userInfo", {});
          uni.showToast({
            title: "获取用户失败",
            icon: "none",
          });
          if (callback && typeof callback == "function") {
            callback();
          }
        },
      });
    },
    // 选择图片
    chooseImage() {
      let that = this;
      if (that.loading) {
        return;
      }
      uni.chooseImage({
        sizeType: ["original"],
        sourceType: ["album"],
        count: 1,
        success: async (e) => {
          uni.showLoading({
            title: "加载图片信息",
            duration: 15000,
            mask: true,
          });
          that.loading = true;
          setTimeout(() => {
            this.loading = false;
          }, 10000);
          let src = e.tempFilePaths[0];
          console.log("src tempFilePaths", src);
          let imageObject = new ImageInfo(src);
          imageObject.computerImageInfo().then((res) => {
            that.imageInfo = imageObject.getImageInfo();
            that.imageInfo.url = src;
            that.init();
          });
          uni.hideLoading();
          that.loading = false;
        },
        fail() {
          uni.showToast({
            title: "获取图片失败",
            icon: "none",
          });
        },
      });
    },
    // 初始化信息
    init() {
      let infoMap = new Map(dataMap);
      console.log("infoMap", infoMap);
      // 更新配置信息
      this.configListInfo = this.reLoadConfigData(this.configListInfo, infoMap);

      console.log("this.configListInfo", this.configListInfo);
      console.log("this.configListInfo", JSON.stringify(this.configListInfo));
      // 绘制
      this.emptyCanvas = false;
      setTimeout(() => {
        this.$refs.exifCanvas.draw();
      }, 250);

      // infoMap.get(userKey) || infoMap.get("Default");
    },
    // 重新配置config信息
    reLoadConfigData(configList, map) {
      let that = this;
      for (let index = 0; index < configList.length; index++) {
        const item = configList[index];
        // console.log("input.id", item.input);
        if (item.input && item.input.id) {
          let newContent =
            map.get(item.input.id) || item.content || map.get("Default");
          if (map.has(item.input.id)) {
            configList[index].input.content = _.get(
              that,
              newContent,
              item.input.content || ""
            );
          } else {
            configList[index].input.content = newContent;
          }
          configList[index].content =
            setContentByInputType(configList[index].input) || item.content;
        }
        if (item.child && item.child.length > 0) {
          configList[index].child = this.reLoadConfigData(item.child, map);
        }
      }
      return configList;
    },
  },
};
</script>
<style lang="scss" scoped>
.photoCreater {
  // display: flex;
  // align-items: center;
  // justify-content: center;
  .canvas-box {
    margin: 10px auto;
    border: 1px dashed #ccc;
    width: 320px;
    height: 240px;
    position: relative;
    .iconTipBox_wrapper {
      opacity: 0.3;
      position: absolute;
      left: 50%;
      top: 40%;
      transform: translate(-50%, -50%);
      .icon_wrapper {
        width: 50px;
        height: 50px;
        margin: 0px auto;
        /deep/.u-icon__icon {
          font-size: 50px !important;
          line-height: 50px !important;
        }
      }
      .tip {
        text-align: center;
        font-size: 12px !important;
        line-height: 24px !important;
      }
    }
  }
  .canvas {
    border: 1px;
    margin: 10px;
    width: 320px;
    // background: rgb(229, 222, 255);
  }
  .downLoadBtn {
    position: fixed;
    bottom: 0px;
    width: calc(100vw - 24px);
    padding: 12px;
    background-color: #fff;
    border-top: 1px #ebedf0 solid;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 10px;
    margin-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS<11.2 */
    margin-bottom: env(safe-area-inset-bottom); /* 兼容iOS>= 11.2 */
  }
}
</style>
