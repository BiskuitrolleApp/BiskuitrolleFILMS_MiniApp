import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex); // vue的插件机制

// Vuex.Store 构造器选项
const store = new Vuex.Store({
  // 为了不和页面或组件的data中的造成混淆，state中的变量前面建议加上$符号
  state: {
    // 用户信息
    userInfo: {},
  },
  getters: {
    userInfo(state) {
      return state.userInfo;
    },
  },
  mutations: {
    updataUserInfo(state, payload = {}) {
      let newUserInfo = { ...state.userInfo, ...payload };
      state.userInfo = newUserInfo;
      uni.setStorageSync("userInfo", {
        userInfo: newUserInfo,
        expirationTime: new Date().getTime() + 12 * 60 * 60 * 1000, // 过期时间为12小时
      });
    },
    setUserInfo(state, payload = {}) {
      let newUserInfo = payload;
      state.userInfo = newUserInfo;
      uni.setStorageSync("userInfo", {
        userInfo: newUserInfo,
        expirationTime: new Date().getTime() + 12 * 60 * 60 * 1000, // 过期时间为12小时
      });
    },
  },
  actions: {
    initUserInfo({ commit, state }, option = {}) {
      let userInfo = {};
      userInfo = { ...userInfo, ...state.userInfo };
      let callback = option.callback;
      uni.getStorage({
        key: "userInfo",
        success: function ({ data }) {
          let time = new Date().getTime();
          if (data.expirationTime && time < data.expirationTime) {
            // 未过期
            userInfo = { ...userInfo, ...data.userInfo };
            userInfo.author = userInfo.nickName;
            if (userInfo.author) {
              commit("setUserInfo", userInfo);
            }
            if (callback && typeof callback == "function") {
              // 选择图片方法
              callback(userInfo);
            }
          } else {
            if (callback && typeof callback == "function") {
              // 选择图片方法
              callback(userInfo);
            }
          }
        },
        fail: () => {
          commit("setUserInfo", userInfo);
          // 获取失败
          if (callback && typeof callback == "function") {
            // 选择图片方法
            callback(userInfo);
          }
        },
      });
    },
  },
});

export default store;
