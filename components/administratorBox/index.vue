<template>
  <view class="">
    <u-modal :show="show" @confirm="confirm" ref="uModal" title="管理员模式" :closeOnClickOverlay="true" @close="close">
      <u-code-input v-model="password" :maxlength="maxlength" dot @finish="confirm"></u-code-input>
    </u-modal>
  </view>
</template>

<script>
export default {
  data() {
    return {
      password: "",
      adminpassword: "147258",
      maxlength: 6,
    };
  },
  props: {
    show: {
      default: false,
      type: Boolean,
    },
  },
  watch: {
    show(newval) {
      if (newval) {
        this.password = "";
      }
    },
  },
  methods: {
    confirm() {
      if (!this.password || this.password.length < this.maxlength) {
        return;
      }
      let isValidity = false;
      if (this.password === this.adminpassword) {
        isValidity = true;
      }
      this.$emit("confirm", isValidity);
    },
    close() {
      this.$emit("close", { type: "in" });
    },
  },
};
</script>
