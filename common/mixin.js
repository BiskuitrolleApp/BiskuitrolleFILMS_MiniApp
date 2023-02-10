export default {
  data() {
    return {
      isDark: false,
      darkPickerItem: "auto",
    };
  },
  computed: {
    darkStyle() {
      let dayColor = {
        primary: "#3c9cff",
        info: "#909399",
        default: "#909399",
        warning: "#f9ae3d",
        error: "#f56c6c",
        success: "#5ac725",
        mainColor: "#303133",
        contentColor: "#606266",
        tipsColor: "#909399",
        lightColor: "#c0c4cc",
        borderColr: "#e4e7ed",
        bgColor: "#ffffff",
      };
      let darkColor = {
        primary: "#3c9cff",
        info: "#909399",
        default: "#909399",
        warning: "#f9ae3d",
        error: "#f56c6c",
        success: "#5ac725",
        mainColor: "#f8f8f8",
        contentColor: "#606266",
        tipsColor: "#909399",
        lightColor: "#c0c4cc",
        borderColor: "#e4e7ed",
        bgColor: "#242424",
      };
      return {
        color: this.isDark ? darkColor : dayColor,
      };
    },
    // 可以拓展其他的类型
    themeType() {
      let type = "day-theme";
      if (this.isDark) {
        type = "dark-theme";
      } else {
        type = "day-theme";
      }
      return type;
    },
  },
  methods: {
    getIsDark(darkPickerItem = "auto") {
      var that = this;
      that.darkPickerItem = darkPickerItem || "auto";
      //夜间模式开始
      if (darkPickerItem == "day") {
        that.isDark = false;
        // plus.setStatusBarStyle("dark");
      } else if (darkPickerItem == "night") {
        that.isDark = true;
      } else {
        // 获取当前时间
        let timeNow = new Date();
        // 获取当前小时
        let hours = timeNow.getHours();
        // 设置默认文字
        let state = ``;
        console.log("hours", hours);
        // 判断当前时间段
        if (hours > 18 && hours <= 24) {
          that.isDark = true;
        } else if (hours < 6) {
          that.isDark = true;
        } else {
          that.isDark = false;
        }
      }
      if (that.isDark) {
        // 关于tabBar的深色模式修改
        uni.setNavigationBarColor({
          frontColor: "#ffffff",
          backgroundColor: "#111111",
          animation: {
            duration: 0,
            timingFunc: "easeIn",
          },
        });
        // 关于导航栏的深色模式修改
        uni.setTabBarStyle({
          color: "#7e858f",
          selectedColor: "#e91d42",
          backgroundColor: "#18202d",
          borderStyle: "black",
        });
      }
      //夜间模式结束
    },
  },
  onShow() {
    var that = this;
    // 加载暗夜模式 开始
    uni.getStorage({
      key: "itools-ui-config",
      success: function ({ data }) {
        console.log("itools-ui-config:", data);
        that.getIsDark(data.nightMode);
      },
      fail: () => {
        that.getIsDark();
        // 获取失败
        uni.hideLoading();
      },
    });
    // 加载暗夜模式 结束
  },
};
