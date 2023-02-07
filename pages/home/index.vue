<template>
  <view class="itools-list move-bg">
    <!-- <u-navbar title="主页" :autoBack="false" leftIcon="home">
      <view class="u-nav-slot" slot="right" :style="navStyle">
        <u-icon :name="rightIcon" size="20" @click="layoutChange"></u-icon>
      </view>
    </u-navbar> -->
    <u-navbar title="主页" :autoBack="false" placeholder="true">
      <view class="u-nav-slot" slot="left">
        <i-icon size="20px" color="#000" name="menu-line" @click="showDropdownList = true"></i-icon>
      </view>
    </u-navbar>
    <view class="dropdown-wrap">
      <dropdown v-show="showDropdownList" :list="dropdownList" @select="selectDropdownItem" @close="showDropdownList = false"></dropdown>
    </view>
    <view class="list-wrap" v-if="dropdownList[0].icon == 'layout-row-line'">
      <cardItem @click="clickItem" class="cardList-item" :value="item" v-for="(item, index) in pagesConfigList"> </cardItem>
    </view>
    <view class="list-wrap" v-if="dropdownList[0].icon == 'file-list-line'">
      <listItem @click="clickItem" class="cellList-item" :value="item" v-for="(item, index) in pagesConfigList"> </listItem>
    </view>
  </view>
</template>

<script>
import cardItem from "./components/cardItem.vue";
import listItem from "./components/listItem.vue";
import dropdown from "@/uni_modules/dropdown";

import config from "./config.js";
import { initMainConfig } from "@/libs/mainInit/index.js";
export default {
  components: {
    cardItem,
    listItem,
    dropdown,
  },
  data() {
    return {
      navStyle: 0,
      showDropdownList: false,
      dropdownList: [
        { value: 0, name: "切换排列", icon: "layout-row-line" },
        { value: 1, name: "刷新列表", icon: "refresh-line" },
        { value: 2, name: "导入配置", icon: "add-box-line" },
        // { value: 2, name: "夜晚模式" },
      ],
      pagesConfigList: [],
    };
  },
  async onLoad() {
    this.init();
  },
  methods: {
    // 初始化存储的页面数据
    init() {
      let that = this;
      uni.getStorage({
        key: "itools-config-pagesList",
        success: function ({ data }) {
          that.pagesConfigList = data.content;
        },
        fail: (err) => {
          console.log("get itools-config-pagesList error", err);
          that.pagesConfigList = [];
        },
      });
      uni.getStorage({
        key: "itools-config-pagesList-custom",
        success: function ({ data }) {
          that.pagesConfigList = that.pagesConfigList.concat(data.content || []);
        },
        fail: (err) => {
          console.log("get itools-config-pagesList-custom error", err);
        },
      });
      if (that.pagesConfigList.length == 0) {
        that.pagesConfigList = config.pageEntrance;
      }
      console.log("that.pagesConfigList", that.pagesConfigList);
    },
    // 选择下拉
    selectDropdownItem(key) {
      this.showDropdownList = false;
      switch (key) {
        case 0:
          this.layoutChange();
          break;
        case 1:
          initMainConfig(true);
          break;
        case 2:
          this.addNewConfig();
          break;
        default:
          break;
      }
    },
    // 布局更新
    layoutChange() {
      let icon = this.dropdownList[0].icon;
      icon == "layout-row-line" ? (this.dropdownList[0].icon = "file-list-line") : (this.dropdownList[0].icon = "layout-row-line");
    },
    // 添加本地新配置逻辑
    addNewConfig() {
      // TODO 对 setStorage itools-config-pagesList-custom 进行设置结构和 itools-config-pagesList一致版本 无需判断
      uni.showToast({
        icon: "error",
        duration: 1000,
        title: "稍后上线",
      });
    },
    // 点击选项
    clickItem(item) {
      console.log("item", item);
      uni.navigateTo({
        url: `${item.page}?id=${item.id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.itools-list {
  min-height: calc(100vh - 44px);
  .list-wrap {
    padding: 10px 10px;
    width: calc(100vw - 20px);
    // background-color: #f8fcf8;
    position: relative;
    z-index: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
    .cardList-item {
      // width: 300px;
      width: 300px;
      margin-top: 10px;
      // flex: 1;
    }
    .cellList-item {
      width: calc(100vw - 20px);
      margin: 0px 10px 0px 10px;
      background: #fff;
    }
    .cellList-item:first-child {
      border-radius: 4px 4px 0px 0px;
    }
    .cellList-item:last-child {
      border-radius: 0px 0px 4px 4px;
    }
  }
  .layoutToggleWrapper {
    padding: 10px 20px 5px;
    text-align: right;
    display: flex;
    justify-content: flex-end;
  }
  .dropdown-wrap {
    margin-left: 10px;
  }
}
.move-bg {
  margin: 0;
  min-height: 100vh;
  // background-color: #e493d0;
  // background-color: #d7c2f3;
  background-color: #f8f8f8;
  // background-image: radial-gradient(
  //     closest-side,
  //     rgba(235, 105, 78, 1),
  //     rgba(235, 105, 78, 0)
  //   ),
  //   radial-gradient(closest-side, rgba(243, 11, 164, 1), rgba(243, 11, 164, 0)),
  //   radial-gradient(
  //     closest-side,
  //     rgba(254, 234, 131, 1),
  //     rgba(254, 234, 131, 0)
  //   ),
  //   radial-gradient(
  //     closest-side,
  //     rgba(170, 142, 245, 1),
  //     rgba(170, 142, 245, 0)
  //   ),
  //   radial-gradient(
  //     closest-side,
  //     rgba(248, 192, 147, 1),
  //     rgba(248, 192, 147, 0)
  //   );
  background-size: 130vmax 130vmax, 80vmax 80vmax, 90vmax 90vmax, 110vmax 110vmax, 90vmax 90vmax;
  background-position: -80vmax -80vmax, 60vmax -30vmax, 10vmax 10vmax, -30vmax -10vmax, 50vmax 50vmax;
  background-repeat: no-repeat;
  animation: 10s movement linear infinite;
}

.move-bg::before {
  content: "";
  display: block;
  position: fixed;
  z-index: 0px;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

@keyframes movement {
  0%,
  100% {
    background-size: 130vmax 130vmax, 80vmax 80vmax, 90vmax 90vmax, 110vmax 110vmax, 90vmax 90vmax;
    background-position: -80vmax -80vmax, 60vmax -30vmax, 10vmax 10vmax, -30vmax -10vmax, 50vmax 50vmax;
  }
  25% {
    background-size: 100vmax 100vmax, 90vmax 90vmax, 100vmax 100vmax, 90vmax 90vmax, 60vmax 60vmax;
    background-position: -60vmax -90vmax, 50vmax -40vmax, 0vmax -20vmax, -40vmax -20vmax, 40vmax 60vmax;
  }
  50% {
    background-size: 80vmax 80vmax, 110vmax 110vmax, 80vmax 80vmax, 60vmax 60vmax, 80vmax 80vmax;
    background-position: -50vmax -70vmax, 40vmax -30vmax, 10vmax 0vmax, 20vmax 10vmax, 30vmax 70vmax;
  }
  75% {
    background-size: 90vmax 90vmax, 90vmax 90vmax, 100vmax 100vmax, 90vmax 90vmax, 70vmax 70vmax;
    background-position: -50vmax -40vmax, 50vmax -30vmax, 20vmax 0vmax, -10vmax 10vmax, 40vmax 60vmax;
  }
}
</style>
