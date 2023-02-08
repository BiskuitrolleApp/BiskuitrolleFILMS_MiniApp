<template>
  <view class="logoItem-wrapper">
    <view class="name">{{ value.photo_name }}({{ value.photo_name_en }})</view>
    <image :src="value.photo_url" mode="heightFix" v-show="value.photo_url"></image>
  </view>
</template>

<script>
export default {
  props: {
    value: {
      require: true,
      type: Object,
      default: {},
    },
  },
};
</script>

<style lang="scss" scoped>
.logoItem-wrapper {
  width: 100%;
  min-height: 40px;
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  align-items: center;
  .name {
    font-size: 10px;
    line-height: 20px;
    margin: 0px 10px;
  }
  image {
    height: 16px;
    width: auto;
  }
}
</style>
