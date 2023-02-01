function getRequestListConfigItem(item = {}) {
  uni.request({
    url: item.url,
    success: (res) => {
      console.log("request", res.data);
      uni.setStorageSync("itools-config-" + item.name, {
        version: item.version, // 过期时间为10天
        url: item.url,
        content: res.data,
      });
      uni.hideLoading();
    },
    fail: (err) => {
      uni.setStorageSync("itools-config-" + item.name, {
        version: "-1",
        url: item.url,
        content: null,
      });
      uni.hideLoading();
    },
  });
}

function getRequestListConfig(list = []) {
  for (let index = 0; index < list.length; index++) {
    const item = list[index];
    uni.getStorage({
      key: "itools-config-" + item.name,
      success: function ({ data }) {
        if (!data.version) {
          // 当前版本过去
          getRequestListConfigItem(item);
        } else if (data.version && item.version && item.version > data.version) {
          // 存在内容有新版本
          getRequestListConfigItem(item);
        } else {
          // 无需更新
        }
      },
      fail: () => {
        getRequestListConfigItem(item);
      },
    });
  }
}

/**
 * 重新请求index配置信息
 * @param {*} callback
 */
function getRequestMainConfig(callback) {
  uni.request({
    url: "https://gitee.com/KevinJZheng/itools-oss/raw/master/index.json",
    success: (res) => {
      console.log("request", res.data);
      uni.setStorageSync("itools-config", {
        data: res.data,
        expirationTime: new Date().getTime() + 10 * 24 * 60 * 60 * 1000, // 过期时间为10天
      });
      getRequestListConfig(res.data);
      if (callback && typeof callback == "function") {
        callback();
      }
      uni.hideLoading();
    },
    fail: (err) => {
      console.log("getRequestConfig error", err);
      if (callback && typeof callback == "function") {
        callback();
      }
      uni.hideLoading();
    },
  });
}

/**
 * 初始化配置信息
 * @param {*} callback
 */
export const initConfiguration = function (callback) {
  console.log("initConfiguration");
  uni.showLoading({
    title: "初始化...",
    duration: 60000,
    mask: true,
  });
  uni.getStorage({
    key: "itools-config",
    success: function ({ data }) {
      let time = new Date().getTime();
      if (data.expirationTime && time < data.expirationTime) {
        if (callback && typeof callback == "function") {
          callback();
          uni.hideLoading();
        }
      } else {
        getRequestMainConfig(callback);
      }
    },
    fail: (err) => {
      console.log("initConfiguration error", err);
      getRequestMainConfig(callback);
    },
  });
};
