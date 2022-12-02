<template>
  <view class="itools-home">
    <view class="layoutToggleWrapper"
      ><u-icon :name="rightIcon" size="30" @click="layoutChange"></u-icon
    ></view>
    <view class="list-wrap">
      <view v-if="rightIcon == 'grid'"
        ><cardItem
          class="cardList-item"
          :value="item"
          v-for="(item, index) in list"
        ></cardItem
      ></view>
      <view v-if="rightIcon == 'list'"
        ><listItem
          class="cellList-item"
          :value="item"
          v-for="(item, index) in list"
        ></listItem
      ></view>
    </view>
  </view>
</template>

<script>
import config from "./config.js";
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
      rightIcon: "grid",
      list: config.pageEntrance,
    };
  },
  async mounted() {
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
.itools-home {
  min-height: calc(100vh - 44px);
  .list-wrap {
    padding: 10px 10px;
    width: calc(100vw - 20px);

    // background-color: #f8fcf8;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
    .cardList-item {
      width: 260px;
      margin-bottom: 20px;
      margin-right: 10px;
      // flex: 1;
    }
    .cellList-item {
      width: calc(100vw - 20px);
      margin: 0px 10px 0px 10px;
    }
  }
  .layoutToggleWrapper {
    padding: 10px 20px 5px;
    text-align: right;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
