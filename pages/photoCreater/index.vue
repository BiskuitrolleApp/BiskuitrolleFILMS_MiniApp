<template>
  <view class="photoCreater">
    <view class="select-box" @click="onUpdatedFile" v-show="emptyCanvas">
      <view class="iconTipBox_wrapper">
        <view class="icon_wrapper"><u-icon name="photo"></u-icon></view>
        <view class="tip">点击上传图片</view>
      </view>
    </view>
    <view class="canvas-box" v-show="!emptyCanvas">
      <exif-canvas :value="configListInfo" ref="exifCanvas"></exif-canvas>
    </view>
    <view class="downLoadBtn">
      <u-button text="高级" size="normal" type="info" @click="openPopup"></u-button>
      <u-button text="下载" size="normal" color="#D7C2F3" @click="saveImage"></u-button>
    </view>
    <view class="popup-wrapper">
      <u-popup mode="bottom" :closeable="true" :round="10" :show="showForm" @close="closePopup" :safeAreaInsetTop="true" :safeAreaInsetBottom="true">
        <edit-form :value="configListInfo" :visible="showForm" :markLogo="markLogoList" @close="closePopup" @change="resetPhotoInfo"></edit-form>
      </u-popup>
    </view>
  </view>
</template>

<script>
// import { EXIFDrawJSON } from "@/libs/configCanvas";
import exifCanvas from "@/components/EXIFCanvas";
import { ImageInfo } from "./js/readImageInfo";
import dataMap from "./config/dataMap";
import setContentByInputType from "./js/inputConfigSetter";
import editForm from "./components/editForm";
import photoLogo from "@/static/common/json/database_photoLogo.json";
import tools from "@/libs/tools";

export default {
  components: {
    exifCanvas,
    editForm,
  },
  data() {
    return {
      emptyCanvas: true,
      showForm: false,
      userInfo: {},
      imageInfo: {},
      markLogoList: [],
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
                cnName: "主要图片",
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
                        cnName: "型号",
                        content: "XSXS",
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
                        cnName: "作者",
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
                        cnName: "品牌",
                        content: "fujifilm",
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
                            cnName: "拍摄信息",
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
                            cnName: "时间",
                            content: 1640966400000,
                            type: "timepicker",
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
    this.getPhotoConfigList();
    // let ctx = uni.createCanvasContext("canvas");
    // EXIFDrawJSON(ctx, this, this.demo);
  },
  //方法集合
  methods: {
    // 获得配置信息
    getPhotoConfigList() {
      let that = this;
      uni.getStorage({
        key: "photoConfigData",
        success: function ({ data }) {
          let time = new Date().getTime();
          if (data.expirationTime && time < data.expirationTime) {
            that.photoConfigData = data.data;
          } else {
            that.getPhotoConfigListByDB();
          }
        },
        fail: () => {
          that.getPhotoConfigListByDB();
        },
      });
    },
    // 获得配置信息，从数据库中请求
    getPhotoConfigListByDB() {
      let that = this;
      let tempPhotoLogo = photoLogo;
      tempPhotoLogo = _.sortBy(tempPhotoLogo, function (o) {
        return o.sort_key;
      });
      // console.log("photoLogo", photoLogo, tempPhotoLogo);
      that.markLogoList = tempPhotoLogo;
      // console.log("photoLogo", photoLogo);
      // const db = uniCloud.database();
      // console.log("数据库中获取");
      // db.collection("photo_broder_logo_list")
      //   .get()
      //   .then(({ result }) => {
      //     // res 为数据库查询结果
      //     console.log("配置加载完成");
      //     let list = result.data;
      //     list = _.sortBy(list, function (o) {
      //       return o.sort_key;
      //     });
      //     that.photoConfigData = list;
      //     uni.setStorageSync("photoConfigData", {
      //       data: list,
      //       expirationTime: new Date().getTime() + 24 * 60 * 60 * 1000, // 过期时间为24小时
      //     });
      //   })
      //   .catch((e) => {
      //     that.photoConfigData = [];
      //     uni.showToast({
      //       icon: "error",
      //       duration: 1000,
      //       title: "配置加载失败",
      //     });
      //   });
    },
    closePopup() {
      this.showForm = false;
    },
    openPopup() {
      let that = this;
      // if (!that.imageInfo.url || that.imageInfo.url == "") {
      //   uni.showModal({
      //     title: "提示",
      //     content: "需要先上传图片",
      //     success: function (res) {
      //       if (res.confirm) {
      //         that.onUpdatedFile();
      //       }
      //     },
      //   });
      // } else {
      that.showForm = true;
      // }
    },
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
            that.userInfo.author = "PHOTO BY @" + that.userInfo.nickName || "User";
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
          that.userInfo.author = "PHOTO BY @" + that.userInfo.nickName || "User";
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
          let newContent = map.get(item.input.id) || item.content || map.get("Default");
          if (map.has(item.input.id)) {
            configList[index].input.content = _.get(that, newContent, item.input.content || "");
          } else {
            configList[index].input.content = newContent;
          }
          configList[index].content = setContentByInputType(configList[index].input) || item.content;
        }
        if (item.child && item.child.length > 0) {
          configList[index].child = this.reLoadConfigData(item.child, map);
        }
      }
      return configList;
    },

    resetPhotoInfo(data) {
      console.log("resetPhotoInfo", data.value);
    },
  },
};
</script>
<style lang="scss" scoped>
.photoCreater {
  // display: flex;
  // align-items: center;
  // justify-content: center;
  background-color: #f8f8f8;
  min-height: calc(100vh - 10px - constant(safe-area-inset-bottom) - 12px);
  min-height: calc(100vh - 10px - env(safe-area-inset-bottom) - 12px);
  padding-top: 10px;
  padding-bottom: calc(constant(safe-area-inset-bottom) + 12px); /* 兼容 iOS<11.2 */
  padding-bottom: calc(env(safe-area-inset-bottom) + 12px); /* 兼容iOS>= 11.2 */
  .select-box {
    background: #fff;
    margin: 0 auto;
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
  .canvas-box {
    /deep/.exifCanvas {
      border: 1px dashed #ccc;
      background: #fff;
      width: 320px;
      margin: 0 auto;
      // background: rgb(229, 222, 255);
    }
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
    padding-bottom: calc(constant(safe-area-inset-bottom) + 12px); /* 兼容 iOS<11.2 */
    padding-bottom: calc(env(safe-area-inset-bottom) + 12px); /* 兼容iOS>= 11.2 */
  }
  .popup-wrapper {
    .form-wrapper {
      background-color: #fff;
      max-height: 60vh;
      height: 60vh;
      overflow-y: auto;
    }
  }
}
</style>
