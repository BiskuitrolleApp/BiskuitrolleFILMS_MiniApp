<template>
  <view class="dropdown">
    <view class="dropdown-mask" @click="handlerMask"></view>
    <view class="ul" :style="{ color: fontColor, 'background-color': bgColor }">
      <view class="li" v-for="item in list" :key="item.value" @click="handlerItem(item.value)">
        <i-icon size="20px" :color="fontColor" :name="item.icon"></i-icon>
        <view class="li-name">{{ item.name }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "dropdown",
  props: {
    list: {
      type: Array,
      default: () => [],
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
  methods: {
    handlerItem(value) {
      this.$emit("select", value);
    },
    handlerMask() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped lang="scss">
.dropdown {
  position: absolute;
  z-index: 100;
  .ul {
    position: relative;
    z-index: 101;
    list-style: none;
    // background-color: #fff;
    border-radius: 4rpx;
    padding-left: 0;
    box-shadow: 10rpx 10rpx 20rpx rgba(224, 32, 32, 0.2);
    .li {
      display: flex;
      align-items: center;
      min-width: 100px;
      // color: #000;
      padding: 20rpx;
      border-bottom: 1px solid #e6eaeb;
      font-size: 24rpx;
      height: 20px;
      line-height: 20px;
      .li-name {
        margin-left: 5px;
      }
    }
    li:last-child {
      border-bottom: none;
    }
  }
  .dropdown-mask {
    top: 0;
    left: 0;
    position: fixed;
    width: 100vw;
    height: 100vh;
    z-index: 99;
    touch-action: none;
  }
}
</style>
