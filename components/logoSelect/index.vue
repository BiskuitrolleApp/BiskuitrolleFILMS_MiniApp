<template>
  <view class="page-content">
    <view class="cu-form-group justify-between">
      <view :style="{ color: cancelColor }" @tap="cancal()">取消</view>
      <view class="text-title">{{ title }}</view>
      <view :style="{ color: confirmColor }" @tap="submit()">确认</view>
    </view>
    <scroll-view scroll-y style="max-height: 600rpx">
      <template v-if="checkedList.length">
        <block v-for="(item, index) in checkedList" :key="index">
          <view class="cu-form-group justify-between" @tap="changeCheck(item)">
            <logo-item :value="item"></logo-item>
            <template v-if="item.isCheck">
              <u-icon name="checkmark" :color="themeColor" size="20"></u-icon>
            </template>
          </view>
        </block>
      </template>
      <template v-else>
        <view class="text-center">暂无数据～</view>
      </template>
    </scroll-view>
    <slot></slot>
  </view>
</template>

<script>
Object.clone = (obj, func = false) => {
  if (!obj || !(obj instanceof Object) || typeof obj == "function") {
    if (typeof obj == "function" && func) {
      return null;
    }
    return obj;
  }
  var constructor = obj.constructor;
  var result = new constructor();
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = Object.clone(obj[key]);
    }
  }
  return result;
};
/**********
 * @author fjj
 * @list 需要选择的列表数据，如果没有传空数组
 * @keyLabel 显示字段
 * @defaultValue 默认选中数据，数据对象格式
 * @title 标题名称
 * @isMultiple 是否多选，默认多选
 * @cancel 方法 点击取消时触发
 * @change 方法 点击确定时触发 返回selectedList数据
 * ********/
import logoItem from "./components/logoItem.vue";
export default {
  components: {
    logoItem,
  },
  props: {
    show: {
      require: false,
      type: Boolean,
      default: false,
    },
    list: {
      require: true,
      type: Array,
      default() {
        return [];
      },
    },
    isMultiple: {
      require: false,
      type: Boolean,
      default: true,
    },
    keyValue: {
      require: true,
      type: String,
      default: "id",
    },
    keyLabel: {
      require: true,
      type: String,
      default: "name",
    },
    defaultValue: {
      require: true,
      type: Array,
      default() {
        return [];
      },
    },
    title: {
      require: true,
      type: String,
    },
    color: {
      require: true,
      type: String,
      default: "#1890FF",
    },
    // 确认按钮颜色
    confirmColor: {
      type: String,
      default: uni.$u.props.modal.confirmColor,
    },
    // 取消文字颜色
    cancelColor: {
      type: String,
      default: uni.$u.props.modal.cancelColor,
    },
  },
  watch: {
    show(value) {
      if (value) {
        this.checkedList = Object.clone(this.list);
        this.resetDefaultValueFun();
      }
    },
  },
  computed: {},
  data() {
    return {
      checkedList: [],
      themeColor: this.color || "#1890FF",
    };
  },
  mounted() {
    this.checkedList = Object.clone(this.list);
    this.resetDefaultValueFun();
  },
  methods: {
    JSON2Str(json = {}) {
      return JSON.stringify(Object.clone(json));
    },
    resetDefaultValueFun() {
      console.log("checkedList", this.checkedList);
      console.log("defaultValue", this.defaultValue);
      if (this.defaultValue.length) {
        this.defaultValue.map((arrParam) => {
          for (let i = this.checkedList.length - 1; i >= 0; i--) {
            console.log("this.defaultValue", typeof arrParam == "object");
            if (typeof arrParam == "object") {
              if (arrParam[this.keyValue] === this.checkedList[i][this.keyValue]) {
                this.checkedList[i].isCheck = true;
                return;
              }
            } else {
              if (arrParam === this.checkedList[i][this.keyValue]) {
                this.checkedList[i].isCheck = true;
                return;
              }
            }
          }
        });
        console.log("this.checkedList", this.checkedList);
      }
    },
    resetCheckedList() {
      this.checkedList = Object.clone(this.list);
      this.resetDefaultValueFun();
    },
    cancal() {
      this.resetCheckedList();
      this.show = false;
      this.$emit("cancel");
    },
    submit() {
      let selectedList = [];
      for (let index = 0; index < this.checkedList.length; index++) {
        const item = this.checkedList[index];
        if (item.isCheck) {
          let newItem = Object.clone(item);
          delete newItem.isCheck;
          selectedList.push(newItem);
        }
      }
      this.$emit("change", selectedList);
    },
    changeCheck(item) {
      if (!this.isMultiple) {
        this.checkedList.map((item) => {
          return (item.isCheck = false);
        });
      }
      item.isCheck = item.isCheck ? false : true;
      this.$forceUpdate();
    },
  },
};
</script>

<style lang="scss" scoped>
.page-content {
  background: #ffffff;
  padding: 0;
  .text-title {
    color: $uni-text-color;
  }

  .text-theme {
    //设定自己的主题色
    color: #d7c2f3;
  }

  .cu-form-group {
    font-size: 30rpx;
    color: $uni-text-color;
    background-color: #ffffff;
    padding: 1rpx 30rpx;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    min-height: 100rpx;
  }

  .justify-between {
    -webkit-box-pack: justify;
    justify-content: space-between;
  }

  .text-center {
    text-align: center;
  }
}

.icon-duihao:before {
  content: "\e60b";
}
</style>
