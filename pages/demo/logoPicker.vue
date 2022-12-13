<template>
  <view class="content">
    <view class="text-area" @click="showPopup">
      <view class="logo-wrapper" v-for="(logoItem, index) in logoImg" @>
        <view class="name">{{ logoItem.photo_name }}({{ logoItem.photo_name_en }})</view>
        <image :src="logoItem.photo_url" mode="heightFix"></image>
      </view>
    </view>
    <u-popup ref="popup" mode="bottom" :show="showForm" :safeAreaInsetBottom="true">
      <multi-select #left="{ itemString, keyValue, keyLabel }" color="#D7C2F3" :show="showForm" :isMultiple="isMultiple" :list="markLogoList" :defaultValue="logoImg" keyLabel="photo_name" keyValue="photo_keyword" @cancel="cancelFun" @change="memberChange"> </multi-select>
    </u-popup>
  </view>
</template>
<script>
import multiSelect from "@/components/logoSelect/index.vue";
import photoLogo from "@/static/common/json/database_photoLogo.json";
export default {
  data() {
    return {
      isMultiple: true,
      logoImg: [
        {
          _id: { $oid: "6304807cb4a67e4013cd2b10" },
          photo_name: "默认",
          photo_name_en: "default",
          photo_keyword: "default",
          photo_url: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-915d01a8-6118-4e1e-840f-697d960cbba2/47e9cb99-42e4-4b8b-8447-c8597ea8b5b2.png",
          photo_original_name: "卷蛋糕.png",
        },
      ],
      //会员list数据
      markLogoList: [],
      showForm: false,
    };
  },
  components: {
    multiSelect,
  },
  onLoad() {
    //模拟数据加载
    setTimeout(() => {
      this.getPhotoConfigListByDB();
    }, 1500);
  },
  methods: {
    JSON2Str(json = {}) {
      return JSON.stringify(json);
    },
    getValueByStringJSON(json = "{}", findKey = "") {
      let newJson = JSON.parse(json);
      let value = "";
      for (const key in newJson) {
        if (Object.hasOwnProperty.call(newJson, key)) {
          const item = newJson[key];
          if (key === findKey) {
            value = item;
          }
        }
      }
      return value;
    },
    getPhotoConfigListByDB() {
      let that = this;
      let tempPhotoLogo = photoLogo;
      tempPhotoLogo = _.sortBy(tempPhotoLogo, function (o) {
        return o.sort_key;
      });
      console.log("markLogoList", tempPhotoLogo);
      that.markLogoList = tempPhotoLogo;
    },
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
      this.logoImg = callBackObj;
      this.cancelFun();
    },
  },
};
</script>
<style lang="scss"></style>
