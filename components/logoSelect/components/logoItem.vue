<template>
  <view class="logo-wrapper">
    <view class="name">{{ value.photo_name }}({{ value.photo_name_en }})</view>
    <image :src="value.photo_url" mode="heightFix"></image>
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
.logo-wrapper {
  width: 100%;
  height: 40px;
  display: flex;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
  .name {
    font-size: 10px;
    line-height: 40px;
    margin: 0px 10px;
  }
  image {
    height: 16px;
  }
}
</style>
