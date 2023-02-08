<template>
  <view class="listItem" @click="clickItem(value)">
    <u-cell size="large" :label="value.subtitle">
      <view slot="title" class="u-slot-title">
        <text class="u-cell-text">{{ value.title }}</text>
        <view class=""></view>
        <view class="tag_wrapper" v-if="value.type">
          <u-tag text="NEW" borderColor="#1890ff" bgColor="#1890ff" color="#fff" size="mini" v-if="value.type == 'new'"></u-tag>
          <u-tag text="HOT" borderColor="#eb6159" bgColor="#eb6159" color="#fff" size="mini" v-if="value.type == 'hot'"></u-tag>
        </view>
      </view>
      <u-avatar slot="icon" shape="square" size="50" :src="value.thumbnail" customStyle="background-color: #ccc;margin: -3px 5px -3px 0"></u-avatar>
    </u-cell>
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
  //方法集合
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
.listItem {
  width: 100%;
  .u-slot-title {
    display: flex;
    justify-items: flex-start;
    .tag_wrapper {
      margin-left: 10px;
    }
  }
  .avatar_wrapper {
    background-color: #ccc;
  }
}
//@import url(); 引入公共css类
</style>
