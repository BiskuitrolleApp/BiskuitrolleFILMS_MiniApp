<script>
import { initConfiguration } from "@/libs/initConfiguration/index.js";
export default {
  onLaunch: function () {
    initConfiguration();
  },
  onShow: function () {},
  onHide: function () {},
};
</script>

<style lang="scss">
/*每个页面公共css */
@import "@/uni_modules/uview-ui/index.scss";
@import "common/demo.scss";
</style>
