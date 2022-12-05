<template>
  <view class="itools-list move-bg">
    <!-- <u-navbar title="主页" :autoBack="false" leftIcon="home">
      <view class="u-nav-slot" slot="right" :style="navStyle">
        <u-icon :name="rightIcon" size="20" @click="layoutChange"></u-icon>
      </view>
    </u-navbar> -->
    <u-navbar
      title="主页"
      :autoBack="false"
      :leftIcon="rightIcon"
      @leftClick="layoutChange"
    >
    </u-navbar>
    <view class="list-wrap" v-if="rightIcon == 'grid'">
      <cardItem
        class="cardList-item"
        :value="item"
        v-for="(item, index) in list"
      >
      </cardItem>
    </view>
    <view class="list-wrap" v-if="rightIcon == 'list'">
      <listItem
        class="cellList-item"
        :value="item"
        v-for="(item, index) in list"
      >
      </listItem>
    </view>
  </view>
</template>

<script>
import config from "./config/listConfig.js";
import cardItem from "./components/cardItem.vue";
import listItem from "./components/listItem.vue";
import { saveStorage, queryStorage } from "@/util/storage/index.js";
export default {
  components: {
    cardItem,
    listItem,
  },
  data() {
    return {
      navStyle: 0,
      rightIcon: "grid",
      list: config.pageEntrance,
    };
  },
  async mounted() {
    try {
      let menu = uni.getMenuButtonBoundingClientRect();
      let navRight = menu.width + 5 || 0;
      this.navStyle = "padding-right:" + (navRight || 0) + "px";
    } catch (error) {
      console.error("getMenuButtonBoundingClientRect error", error);
    }

    try {
      let config = await queryStorage("home:config");
      console.log("config", config);
      this.rightIcon = config.toggleBtnConfig;
    } catch (e) {
      this.rightIcon = "grid";
      //TODO handle the exception
    }
  },
  methods: {
    layoutChange() {
      this.rightIcon == "grid"
        ? (this.rightIcon = "list")
        : (this.rightIcon = "grid");
      saveStorage("home:config", {
        toggleBtnConfig: this.rightIcon,
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
  background-size: 130vmax 130vmax, 80vmax 80vmax, 90vmax 90vmax,
    110vmax 110vmax, 90vmax 90vmax;
  background-position: -80vmax -80vmax, 60vmax -30vmax, 10vmax 10vmax,
    -30vmax -10vmax, 50vmax 50vmax;
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
    background-size: 130vmax 130vmax, 80vmax 80vmax, 90vmax 90vmax,
      110vmax 110vmax, 90vmax 90vmax;
    background-position: -80vmax -80vmax, 60vmax -30vmax, 10vmax 10vmax,
      -30vmax -10vmax, 50vmax 50vmax;
  }
  25% {
    background-size: 100vmax 100vmax, 90vmax 90vmax, 100vmax 100vmax,
      90vmax 90vmax, 60vmax 60vmax;
    background-position: -60vmax -90vmax, 50vmax -40vmax, 0vmax -20vmax,
      -40vmax -20vmax, 40vmax 60vmax;
  }
  50% {
    background-size: 80vmax 80vmax, 110vmax 110vmax, 80vmax 80vmax,
      60vmax 60vmax, 80vmax 80vmax;
    background-position: -50vmax -70vmax, 40vmax -30vmax, 10vmax 0vmax,
      20vmax 10vmax, 30vmax 70vmax;
  }
  75% {
    background-size: 90vmax 90vmax, 90vmax 90vmax, 100vmax 100vmax,
      90vmax 90vmax, 70vmax 70vmax;
    background-position: -50vmax -40vmax, 50vmax -30vmax, 20vmax 0vmax,
      -10vmax 10vmax, 40vmax 60vmax;
  }
}
</style>
