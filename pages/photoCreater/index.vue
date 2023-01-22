<template>
  <view class="photoCreater">
    <view class="select-box" @click="onUpdatedFile" v-show="emptyCanvas">
      <view class="iconTipBox_wrapper">
        <view class="icon_wrapper"><u-icon name="photo"></u-icon></view>
        <view class="tip">点击上传图片</view>
      </view>
    </view>
    <view class="canvas-box" v-show="!emptyCanvas">
      <exif-canvas :value="configListInfo" ref="exifCanvas" @EXIFConfigUpdata="EXIFConfigUpdata" @click="onUpdatedFile"></exif-canvas>
    </view>
    <view class="downLoadBtn">
      <!-- <u-button text="编辑" size="normal" type="info" @click="openSetting"></u-button> -->
      <view class="toolWrapper">
        <u-icon name="setting" label="设置" labelSize="10" labelPos="bottom" color="#D7C2F3" size="28" @click="openSetting" customStyle="margin:0px 10px"></u-icon>
        <u-icon name="share-square" label="分享" labelSize="10" labelPos="bottom" color="#D7C2F3" size="28" @click="openShare" customStyle="margin:0px 10px"></u-icon>
        <u-icon name="plus-circle" label="保存" labelSize="10" labelPos="bottom" color="#D7C2F3" size="28" @click="saveConfig" customStyle="margin:0px 10px"></u-icon>
      </view>
      <u-button text="下载" size="normal" color="#D7C2F3" @click="saveImage"></u-button>
    </view>
    <view class="popup-wrapper">
      <u-popup mode="bottom" :closeable="true" :round="10" :show="showForm" @close="closePopup" :safeAreaInsetTop="true" :safeAreaInsetBottom="true">
        <edit-form ref="editForm" :visible="showForm" :markLogo="markLogoList" @close="closePopup" @change="resetPhotoInfo"></edit-form>
      </u-popup>
    </view>
  </view>
</template>

<script>
// import { EXIFDrawJSON } from "@/libs/configCanvas";
import exifCanvas from "@/components/EXIFCanvas";
import editForm from "./components/editForm.vue";

import { generateConfiguration } from "@/libs/configCanvas";
import { ImageInfo } from "./js/readImageInfo.js";
import dataMap from "./config/dataMap.js";
import { setContentByInputType, getPhotoConfigList } from "./js/inputConfigSetter.js";
// import demo from "./components/demo.js";

export default {
  components: {
    exifCanvas,
    editForm,
  },
  data() {
    return {
      emptyCanvas: true, // 是否是空canvas 页面
      showForm: false, // 现在输入表单
      userInfo: {}, // 获取用户信息
      imageInfo: {}, // 上传的图片
      markLogoList: [], // 加载的logo对应的码值列表

      EXIFConfigList: [], // 生成返回EXIFConfig 列表 ，可直接提供用于渲染

      // 渲染数据的页面结构的配置项
      configListInfo: [
        {
          id: "canvas",
          child: [
            {
              type: "image",
              maxWidth: 320, // 只能设置宽度
              // content: "http://127.0.0.1/image/test.JPG",
              content: "",
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
              maxWidth: 320,
              // round: 10,
              background: "#ffffff00",
              child: [
                {
                  content: "",
                  maxWidth: 120,
                  // border: "1 solid #ff0000ff",
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
                  maxWidth: 200,
                  horizontal: "right",
                  vertical: "center",
                  display: "flex",
                  // border: "1 solid #000",
                  content: "",
                  padding: "0 10 20 0",
                  // border: "1 solid #0000ffff",
                  child: [
                    {
                      type: "image",
                      // height: 20, // 只能设置宽度
                      maxHeight: 20,
                      maxWidth: 60,
                      // content: "",
                      content: "http://127.0.0.1/image/leica.png",
                      // marign: "0 5 0 0",
                      margin: "0 5 0 0",
                      // border: "1 solid #0000ffff",
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
                      padding: "0 5 0 0",
                      // border: "1 solid #000",
                      // border: "1 solid #0000ffff",
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
  async mounted() {
    let markLogoList = await getPhotoConfigList();
    setTimeout(() => {
      // uni.downloadFile({
      //   url: "http://127.0.0.1/image/test.JPG",
      //   success: (res) => {
      //     this.drawUrl(res.tempFilePath);
      //   },
      // });
      // this.openSetting();
    }, 250);
  },
  //方法集合
  methods: {
    openSetting2() {
      console.log("openSetting");
      wx.openSetting({
        success(res) {
          console.log("openSetting", res.authSetting);
          // res.authSetting = {
          //   "scope.userInfo": true,
          //   "scope.userLocation": true
          // }
        },
      });
    },
    EXIFConfigUpdata(value = []) {
      console.log("EXIFConfigUpdata", value);
      this.EXIFConfigList = value;
      this.$refs.editForm.setValue(value);
    },
    closePopup() {
      this.showForm = false;
    },
    openSetting() {
      let that = this;
      if (!that.imageInfo.url || that.imageInfo.url == "") {
        uni.showModal({
          title: "提示",
          content: "需要先上传图片",
          success: function (res) {
            if (res.confirm) {
              that.onUpdatedFile();
            }
          },
        });
      } else {
        that.showForm = true;
      }
    },
    // TODO
    // TODO 自订个性化配置，则是吧当前EXIFObject 转换为config，
    // TODO 新增分享config 逻辑
    openShare() {
      let config = this.getCurrentConfiguration();
      console.log("config", config);
      console.log("分享给好友");
    },
    // TODO 保存当前配置
    saveConfig() {
      console.log("保存config");
    },
    getCurrentConfiguration() {
      let config = generateConfiguration(this.EXIFConfigList);
      return config;
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
          this.drawUrl(src);
          // console.log("src tempFilePaths", src);
          // let imageObject = new ImageInfo(src);
          // imageObject.computerImageInfo().then((res) => {
          //   that.imageInfo = imageObject.getImageInfo();
          //   that.imageInfo.url = src;
          //   that.init();
          // });
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
    drawUrl(src = "") {
      let that = this;
      if (src === "") {
        uni.showToast({
          title: "非法图片地址",
          icon: "none",
        });
        return;
      }

      let imageObject = new ImageInfo(src);
      imageObject.computerImageInfo().then((res) => {
        that.imageInfo = imageObject.getImageInfo();
        that.imageInfo.url = src;
        this.init();
      });
      // infoMap.get(userKey) || infoMap.get("Default");
    },
    // 初始化信息
    init() {
      // let infoMap = new Map(dataMap);
      let infoMap = dataMap;
      // console.log("infoMap", infoMap);
      // 更新配置信息
      this.configListInfo = this.reLoadConfigData(this.configListInfo, infoMap);
      // 绘制
      this.emptyCanvas = false;
      setTimeout(() => {
        this.$refs.exifCanvas.draw();
      }, 250);
      // infoMap.get(userKey) || infoMap.get("Default");
    },
    // 重新配置config信息
    // 将dataMap对应的信息input里面的content数据填入外部的content中
    // 外部content数据可以用于最终渲染页面
    // reLoadConfigData(configList, map) {
    //   let that = this;
    //   for (let index = 0; index < configList.length; index++) {
    //     const item = configList[index];
    //     // console.log("input.id", item.input);
    //     if (item.input && item.input.id) {
    //       let newContent = map.get(item.input.id) || item.content || map.get("Default");
    //       if (map.has(item.input.id)) {
    //         configList[index].input.content = _.get(that, newContent, item.input.content || "");
    //       } else {
    //         configList[index].input.content = newContent;
    //       }
    //       configList[index].content = setContentByInputType(configList[index].input) || item.content;
    //     }
    //     if (item.child && item.child.length > 0) {
    //       configList[index].child = this.reLoadConfigData(item.child, map);
    //     }
    //   }
    //   return configList;
    // },
    reLoadConfigData(configList, map) {
      let that = this;
      for (let index = 0; index < configList.length; index++) {
        const item = configList[index];
        // console.log("input.id", item.input);
        if (item.input && item.input.id && map[item.input.id]) {
          console.log("id==>", map[item.input.id], item);
          // let key = map.get(item.input.id) || item.content || map.get("Default");
          let key = map[item.input.id].queryKey || item.content || map.Default.queryKey;

          if (map[item.input.id].queryKey) {
            configList[index].input.content = _.get(that, key, item.input.content || "");
          } else {
            configList[index].input.content = item.content;
          }
          let content = setContentByInputType(configList[index].input, map[item.input.id].additional) || item.content;
          console.log("content", content);
          configList[index].content = content;
        }
        if (item.child && item.child.length > 0) {
          configList[index].child = this.reLoadConfigData(item.child, map);
        }
      }
      return configList;
    },
    resetPhotoInfo(value) {
      console.log("resetPhotoInfo", value);
      this.EXIFConfigList = value;
      this.$refs.exifCanvas.EXIFInfoRedraw(value);
      this.closePopup();
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
    grid-template-columns: auto 1fr;
    grid-column-gap: 10px;
    padding-bottom: calc(constant(safe-area-inset-bottom) + 12px); /* 兼容 iOS<11.2 */
    padding-bottom: calc(env(safe-area-inset-bottom) + 12px); /* 兼容iOS>= 11.2 */
    .toolWrapper {
      display: inline-flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
  // .popup-wrapper {
  // }
}
</style>
