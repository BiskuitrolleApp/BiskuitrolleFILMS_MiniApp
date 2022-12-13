<template>
  <view class="content">
    <view class="text-area">
      <text class="title" @click="showPopup">{{ memberSelected.length ? memberSelected.join(",") : "请选择" }}</text>
    </view>
    <u-popup ref="popup" mode="bottom" :show="showForm" :safeAreaInsetBottom="true">
      <multi-select color="#D7C2F3" :isMultiple="isMultiple" :list="memberList" :defaultValue="memberSelected" showParam="name" @cancel="cancelFun" @change="memberChange"></multi-select>
    </u-popup>
  </view>
</template>
<script>
import multiSelect from "@/components/multiSelect/index.vue";
export default {
  data() {
    return {
      isMultiple: true,
      memberSelected: ["张三"],
      //会员list数据
      memberList: [],
      showForm: false,
    };
  },
  components: {
    multiSelect,
  },
  onLoad() {
    //模拟数据加载
    setTimeout(() => {
      this.memberList = [
        {
          name: "张三",
          id: 1,
          type: 1,
        },
        {
          name: "李四",
          id: 2,
          type: 2,
        },
        {
          name: "王五",
          id: 3,
          type: 3,
        },
        {
          name: "王五",
          id: 3,
          type: 3,
        },
        {
          name: "王五",
          id: 3,
          type: 3,
        },
        {
          name: "王五",
          id: 3,
          type: 3,
        },
        {
          name: "王五",
          id: 3,
          type: 3,
        },
        {
          name: "王五",
          id: 3,
          type: 3,
        },
        {
          name: "王五",
          id: 3,
          type: 3,
        },

        {
          name: "王五",
          id: 3,
          type: 3,
        },
        {
          name: "王五",
          id: 3,
          type: 3,
        },
        {
          name: "王五",
          id: 3,
          type: 3,
        },
        {
          name: "王五",
          id: 3,
          type: 3,
        },
        {
          name: "王五",
          id: 3,
          type: 3,
        },
        {
          name: "王五",
          id: 3,
          type: 3,
        },
        {
          name: "王五",
          id: 3,
          type: 3,
        },
        {
          name: "王五",
          id: 3,
          type: 3,
        },
      ];
    }, 1500);
  },
  methods: {
    //显示
    showPopup() {
      this.showForm = true;
    },
    cancelFun() {
      this.showForm = false;
    },
    //多选确认后
    memberChange(callBackObj) {
      console.log(callBackObj);
      this.memberSelected = [];
      callBackObj.selectedList.map((item) => {
        this.memberSelected.push(item.name);
      });
      this.cancelFun();
    },
  },
};
</script>
