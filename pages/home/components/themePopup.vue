<template>
  <view class="theme-popup">
    <u-popup :show="show" @close="close" afeAreaInsetBottom="true" round="10" :bgColor="bgColor" :closeable="true">
      <view class="themelist-wrapper" :style="{ color: fontColor }">
        <view class="themelist-item" @click="select(item)" :class="{ active: item.key == value }" v-for="(item, index) in list" :key="index">
          <image :src="item.image" class="themelist-item__image"></image>
          <view class="themelist-item__tips">{{ item.name }}</view>
        </view>
      </view>
    </u-popup>
  </view>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: () => [],
    },
    value: {
      type: String,
      default: "day",
    },
    bgColor: {
      type: String,
      default: "#ffffff",
    },
    fontColor: {
      type: String,
      default: "#000000",
    },
  },
  data() {
    return {
      // show: false,
    };
  },
  methods: {
    select(item) {
      this.$emit("select", item);
      // console.log('open');
    },
    close() {
      this.$emit("close");
      // console.log('close');
    },
  },
};
</script>
<style lang="scss" scoped>
.theme-popup {
  .themelist-wrapper {
    height: 200px;
    padding: 60px 0px 10px 0px;
    // background-color: #fff;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 120px 120px 120px;
    grid-row-gap: 5px;
    grid-column-gap: 5px;
    justify-items: center;
    align-items: start;
    .themelist-item {
      padding: 10px;
      width: 100px;
      height: 120px;
      text-align: center;
      &__image {
        border-radius: 5px;
        width: 100px;
        height: 100px;
      }
      &__tips {
        font-size: 14px;
        line-height: 20px;
      }
    }
  }
  .active {
    border: $u-primary 2px solid;
    border-radius: 5px;
  }
}
</style>
