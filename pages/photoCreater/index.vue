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
      <!-- <u-button text="编辑" size="normal" type="info" @click="openSetiingPopup"></u-button> -->
      <view class="toolWrapper">
        <u-icon name="setting" label="设置" labelSize="10" labelPos="bottom" color="#D7C2F3" size="28" @click="openSetiingPopup" customStyle="margin:0px 10px"></u-icon>
        <!-- <u-icon name="share-square" label="分享" labelSize="10" labelPos="bottom" color="#D7C2F3" size="28" @click="openShare" customStyle="margin:0px 10px"></u-icon>
        <u-icon name="plus-circle" label="保存" labelSize="10" labelPos="bottom" color="#D7C2F3" size="28" @click="saveConfig" customStyle="margin:0px 10px"></u-icon> -->
      </view>
      <u-button text="下载" size="normal" color="#D7C2F3" @click="saveImage"></u-button>
    </view>
    <view class="popup-wrapper">
      <u-popup mode="bottom" :closeable="true" :round="10" :show="showForm" @close="closeSetiingPopup" :safeAreaInsetTop="true" :safeAreaInsetBottom="true">
        <edit-form ref="editForm" :visible="showForm" :markLogo="markLogoList" @close="closeSetiingPopup" @change="resetPhotoInfo"></edit-form>
      </u-popup>
    </view>
    <view class="userInfoModal">
      <u-modal :show="inputUserInfoModal" title="用户昵称" @confirm="setNicknameConfirm">
        <u-cell icon="account-fill" title="昵称" :border="false">
          <view class="slot-content" slot="value">
            <input type="nickname" class="nicknameInput" placeholder="请输入昵称" v-model="userInfo.nickName" />
          </view>
        </u-cell>
      </u-modal>
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
import { setContentByInputType } from "./js/inputConfigSetter.js";
import { getPhotoConfigList } from "@/libs/mainInit/index.js";
// import demo from "./components/demo.js";

export default {
  components: {
    exifCanvas,
    editForm,
  },
  data() {
    return {
      configId: "",
      emptyCanvas: true, // 是否是空canvas 页面
      showForm: false, // 现在输入表单
      inputUserInfoModal: false, // 输入用户信息Popop
      // 用于reLoadConfigData的数据赋值 start
      userInfo: {}, // 获取用户信息
      imageInfo: {}, // 上传的图片
      // 用于reLoadConfigData的数据赋值 end
      markLogoList: [], // 加载的logo对应的码值列表
      EXIFConfigList: [], // 生成返回EXIFConfig 列表 ，可直接提供用于渲染
      // 渲染数据的页面结构的配置项
      configListInfo: [],
    };
  },
  async onLoad(options) {
    //此处接收传递过来的参数wx.navigateTo跳转时传递的参数
    console.log("onLoad options:", options.id);
    //如果要在页面中使用
    this.configId = options.id;

    // console.log("this.configId ", this.configId, this.configListInfo);
    // this.markLogoList = await getPhotoConfigList();
    // setTimeout(() => {
    //   uni.downloadFile({
    //     // url: "http://127.0.0.1/image/test.JPG",
    //     url: "http://127.0.0.1/image/xk.jpeg",
    //     success: (res) => {
    //       this.drawUrl(res.tempFilePath);
    //     },
    //   });
    //   // this.openSetiingPopup();
    // }, 250);
  },
  async mounted() {
    this.getConfigListInfo(this.configId);
    this.markLogoList = await getPhotoConfigList();
    // setTimeout(() => {
    //   uni.downloadFile({
    //     // url: "http://127.0.0.1/image/test.JPG",
    //     url: "http://127.0.0.1/image/xk.jpeg",
    //     success: (res) => {
    //       this.drawUrl(res.tempFilePath);
    //     },
    //   });
    //   // this.openSetiingPopup();
    // }, 250);
  },
  //方法集合
  methods: {
    // 关闭setting弹出窗口
    closeSetiingPopup() {
      this.showForm = false;
    },
    // 开启setting弹出窗口
    openSetiingPopup() {
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

    // TODO 保存当前配置
    // 保存当前配置
    saveConfig() {
      console.log("保存config");
    },
    // 配置id获取配置信息
    getConfigListInfo(id = "") {
      let that = this;
      if (id == "") {
        uni.showToast({
          title: "获取配置信息失败",
          icon: "none",
        });
      }
      uni.showLoading({
        title: "获取配置信息",
        duration: 15000,
        mask: true,
      });
      uni.getStorage({
        key: "itools-config-pagesList",
        success: function ({ data }) {
          let pagesList = data.content;
          for (let index = 0; index < pagesList.length; index++) {
            const item = pagesList[index];
            if (item.id == id) {
              that.configListInfo = item.config;
              console.log("that.configListInfo", that.configListInfo);
              break;
            }
          }
          uni.hideLoading();
          if (!that.configListInfo || that.configListInfo.length == 0) {
            uni.showToast({
              title: "获取配置信息失败，加载默认配置",
              icon: "none",
            });
            that.configListInfo = pagesList[0].config;
          }
        },
        fail: () => {
          // 获取失败
          uni.hideLoading();
        },
      });
    },

    // TODO
    // TODO 自订个性化配置，则是吧当前EXIFObject 转换为config，
    // TODO 新增分享config 逻辑
    // 分享参数逻辑
    openShare() {
      let config = generateConfiguration(this.EXIFConfigList);
      console.log("config", config);
      console.log("分享给好友");
    },

    // 配置信息更新
    EXIFConfigUpdata(value = []) {
      console.log("EXIFConfigUpdata", value);
      this.EXIFConfigList = value;
      this.$refs.editForm.setValue(value);
    },

    // 点击下载逻辑
    saveImage() {
      this.$refs.exifCanvas.$downLoad();
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
    // 获取Storage用户信息，作为显示凭证
    getUserInfo(callback) {
      let that = this;
      if (that.userInfo && that.userInfo.nickName) {
        if (callback && typeof callback == "function") {
          callback();
          return;
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
            // 未过期
            that.userInfo = data.userInfo;
            that.userInfo.author = that.userInfo.nickName || "User";
            if (callback && typeof callback == "function") {
              // 选择图片方法
              callback();
            }
          } else {
            // 过期
            that.getUserProfile(callback);
          }
          uni.hideLoading();
        },
        fail: () => {
          // 获取失败
          that.getUserProfile(callback);
          uni.hideLoading();
        },
      });
    },
    // 重新请求获取用户信息
    getUserProfile(callback) {
      let that = this;
      wx.getSystemInfo({
        success: function (res) {
          let version = res.SDKVersion;
          console.log("该版本号为: ", res.SDKVersion);
          if (version >= "2.27.1") {
            // 小于230的版本 基础库
            that.inputUserInfoModal = true;
            return;
          } else {
            uni.getUserProfile({
              desc: "用于您的页面展示用户头像与昵称",
              lang: "zh_CN",
              success: (resData) => {
                that.userInfo = resData.userInfo;
                that.userInfo.author = that.userInfo.nickName || "User";
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
                uni.showModal({
                  title: "提示",
                  title: "获取用户失败，是否开启用户权限？",
                  success: function (res) {
                    if (res.confirm) {
                      // 开启用户设置逻辑
                      wx.openSetting({
                        success(res) {},
                      });
                      // that.inputUserInfoModal = true;
                    } else {
                      if (callback && typeof callback == "function") {
                        callback();
                      }
                    }
                  },
                });
              },
            });
          }
        },
      });
    },
    // 自设设置用户信息，解决2.27.1版本后无法获取用户信息问题
    setNicknameConfirm() {
      console.log("userInfo.author", this.userInfo);
      let that = this;
      that.inputUserInfoModal = false;
      that.userInfo.author = that.userInfo.nickName || "User";
      console.log("userInfo.author", this.userInfo);
      uni.setStorageSync("userInfo", {
        userInfo: that.userInfo,
        expirationTime: new Date().getTime() + 12 * 60 * 60 * 1000, // 过期时间为12小时
      });
      // this.chooseImage();
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
      imageObject.computerImageInfo().then(async (res) => {
        that.imageInfo = imageObject.getImageInfo();
        that.imageInfo.url = src;
        let infoMap = dataMap;
        // 更新配置信息
        this.configListInfo = await this.reLoadConfigData(this.configListInfo, infoMap);
        console.log("new configListInfo", that.configListInfo);
        // 绘制
        this.emptyCanvas = false;
        setTimeout(() => {
          this.$refs.exifCanvas.$draw();
        }, 250);
      });
    },
    // 重新配置config信息
    // 将dataMap对应的信息input里面的content数据填入外部的content中
    // 外部content数据可以用于最终渲染页面
    async reLoadConfigData(configList, map) {
      let that = this;
      for (let index = 0; index < configList.length; index++) {
        const item = configList[index];
        // console.log("input.id", item.input);
        if (item.input && item.input.id && map[item.input.id]) {
          // console.log("id==>", map[item.input.id], item);
          // 默认使用的是content 和input content 中的内容
          let defaultContent = item.content || item.input.content || "";
          let key = map[item.input.id].queryKey || defaultContent || map.Default.queryKey;
          if (map[item.input.id].queryKey) {
            // console.log("key", _.get(that, key, defaultContent), "<<1>>", key, "<<2>>", defaultContent);
            configList[index].input.content = _.get(that, key, defaultContent) || defaultContent;
          }
          let content = await setContentByInputType(configList[index].input, map[item.input.id].additional);
          // console.log("content", content);
          configList[index].content = content || defaultContent;
          console.log("<<1>>key:", key, "，<<2>>content", content || defaultContent);
        }
        if (item.child && item.child.length > 0) {
          configList[index].child = await this.reLoadConfigData(item.child, map);
        }
      }
      return configList;
    },
    resetPhotoInfo(value) {
      console.log("resetPhotoInfo", value);
      this.EXIFConfigList = value;
      this.$refs.exifCanvas.$redraw(value);
      this.closeSetiingPopup();
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
  min-height: calc(100vh - 10px - constant(safe-area-inset-bottom) - 50px);
  min-height: calc(100vh - 10px - env(safe-area-inset-bottom) - 50px);
  padding-top: 10px;
  padding-bottom: calc(constant(safe-area-inset-bottom) + 50px); /* 兼容 iOS<11.2 */
  padding-bottom: calc(env(safe-area-inset-bottom) + 50px); /* 兼容iOS>= 11.2 */
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
      // border: 1px dashed #ccc;
      // background: #fff;
      width: 320px;
      height: auto;
      margin: 0 auto;
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
  .userInfoModal {
    .slot-content {
      width: 200px;
      .nicknameInput {
        text-align: right;
      }
    }
  }
}
</style>
