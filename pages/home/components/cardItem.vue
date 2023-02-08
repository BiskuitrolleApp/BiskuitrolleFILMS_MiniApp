<template>
  <view class="cardItem" @click="clickItem(value)">
    <view class="image_wrapper"><image :src="value.thumbnail" mode="widthFix"></image></view>
    <view class="info_wrapper">
      <view class="title">{{ value.title }}</view>
      <view class="subtitle" v-if="value.subtitle">{{ value.subtitle }}</view>
    </view>
    <view class="ribbon_wrapper" v-if="value.type" :class="'ribbon_' + value.type">
      <view class="ribbon" v-if="value.type == 'new'">NEW</view>
      <view class="ribbon" v-if="value.type == 'hot'">HOT</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    value: {
      default: {},
      type: Object,
    },
  },
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {};
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  //方法集合˝
  methods: {
    clickItem(item) {
      // console.log("path", path);
      // uni.navigateTo({
      //   url: path,
      // });
      this.$emit("click", item);
    },
  },
};
</script>
<style lang="scss" scoped>
.cardItem {
  width: calc(100% - 10px);
  // height: 160px;
  background-color: #f7f7f7;
  padding: 5px;
  box-shadow: 0 2px 16px #d9d9d9, 0 0 1px #d9d9d9, 0 0 1px #d9d9d9;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  .image_wrapper {
    width: 100%;
    min-height: 160px;
    background-color: #ccc;
    margin-bottom: 5px;
    // border-radius: 10px;
    image {
      padding: 3px;
      height: calc(100% - 6px);
      width: calc(100% - 6px);
      vertical-align: top;
      // height: 100%;
      // width: 100%;
    }
  }
  .info_wrapper {
    font-family: "黑体";
    margin: 5px 10px;
    .title {
      font-weight: bold;
      font-size: 14px;
    }
    .subtitle {
      font-size: 10px;
    }
  }
  .ribbon_wrapper {
    /* 左上角飘带 */
    background-color: #1890ff; /* 左上角飘带的背景颜色 */
    overflow: hidden;
    white-space: nowrap; /* 文字不换行*/
    position: absolute; /* 绝对定位 */
    height: 24px;
    line-height: 24px;
    right: -40px;
    top: 10px;
    transform: rotate(45deg); /* 旋转45°*/
    // box-shadow: 0 0 10px #888; /* 飘带的阴影*/
    .ribbon {
      border: 1px solid #1890ff;
      color: #fff;
      display: inline-block;
      font-size: 12px !important;
      font: bold 100% "Helvetica Neue", Helvetica, Arial, sans-serif;
      margin: 1px 0;
      padding: 5px 50px;
      text-align: center;
      text-shadow: 0 0 5px #444;
    }
  }
  .ribbon_hot {
    background-color: #eb6159; /* 左上角飘带的背景颜色 */
    .ribbon {
      border: 1px solid #eb6159;
    }
  }
  .ribbon_new {
    border: 1px solid #1890ff;
    .ribbon {
      border: 1px solid #1890ff;
    }
  }
}
//@import url(); 引入公共css类
</style>
