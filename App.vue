<script>
import { initMainConfig } from "@/libs/mainInit/index.js";
export default {
  onLaunch: function () {
    initMainConfig();
  },
  onShow: function () {},
  onHide: function () {},
};
</script>

<style lang="scss">
/*每个页面公共css */
@import "@/uni_modules/uview-ui/index.scss";
@import "common/demo.scss";
// @import "common/darkMode.scss";
</style>
