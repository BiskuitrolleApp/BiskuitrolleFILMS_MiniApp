<template>
  <view class="editForm">
    <t-color-picker
      ref="colorPicker"
      @confirm="confirmColorPicker"
    ></t-color-picker>
  </view>
</template>

<script>
import tColorPicker from "@/components/t-color-picker/t-color-picker.vue";
export default {
  components: {
    tColorPicker,
  },
};
</script>

<style lang="scss" scoped>
</style>