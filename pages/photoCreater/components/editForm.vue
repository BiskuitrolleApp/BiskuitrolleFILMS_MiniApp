<template>
  <view class="editForm">
    <u-form labelPosition="left" ref="editForm">
      <view v-for="(item, index) in formList" class="formItem">
        <view v-if="item.fieldData.type === 'input'">
          <u-form-item :label="item.fieldData.cnName" labelWidth="80" :prop="item.key">
            <u--input
              :value="item.fieldData.content"
              border="bottom"
              :placeholder="'请输入' + item.fieldData.cnName"
              inputAlign="right"
              @change="
                (value) => {
                  inputChange(value, item, index);
                }
              "
              customStyle="padding-right:0px"
            ></u--input>
          </u-form-item>
        </view>
        <view v-else-if="item.fieldData.type === 'timepicker'">
          <u-form-item :label="item.fieldData.cnName" labelWidth="80" :prop="item.key">
            <view class="timePicker" @click="openTimePicker(index)">{{ timestamp2Str(item.fieldData.content) }}</view>
          </u-form-item>
        </view>
        <view v-else-if="item.fieldData.type === 'icon'">
          <u-form-item
            :label="item.fieldData.cnName"
            labelWidth="80"
            customStyle="padding:5px 0px"
            @click="
              () => {
                openLogoPicker(args, item, index);
              }
            "
            :key="item.key"
          >
            <hpy-form-select v-if="item.componentData.visible" :dataList="markLogo" text="photo_name" name="photo_keyword" hideBorder="true" @change="logoPickerConfirm" islot="true">
              <view
                class="logo-wrapper"
                @click="
                  () => {
                    openLogoPicker(args, item, index);
                  }
                "
              >
                <view class="name">{{ item.componentData.photo_name }}({{ item.componentData.photo_name_en }})</view>
                <image :src="item.componentData.photo_url" mode="heightFix"></image>
              </view>
            </hpy-form-select>
          </u-form-item>
        </view>
      </view>
      <view class="button-wrapper">
        <view class="button-item"> <u-button @click="resetForm">重置</u-button></view>
        <view class="button-item"><u-button @click="submit" color="#D7C2F3">确认</u-button></view>
      </view>
    </u-form>
    <!-- picker组件start -->
    <t-color-picker ref="colorPicker" @confirm="confirmColorPicker"></t-color-picker>
    <u-datetime-picker :show="timePicker.visible" v-model="timePicker.value" mode="datetime" closeOnClickOverlay @confirm="timePickerConfirm" @cancel="timePickerCancel"></u-datetime-picker>
    <!-- picker组件end -->
  </view>
</template>

<script>
import tColorPicker from "@/components/t-color-picker/t-color-picker.vue";
import tools from "@/libs/tools/index";

export default {
  components: {
    tColorPicker,
  },
  props: {
    value: {
      default: [],
      type: Array,
    },
    visible: {
      default: false,
      type: Boolean,
    },
    markLogo: {
      default: [],
      type: Array,
    },
  },
  data() {
    return {
      timePicker: {
        visible: false,
        editData: {},
        index: -1,
        value: "",
      },
      logoPicker: {
        formItem: {},
        index: -1,
      },
      form: {},
      formList: [],
    };
  },
  watch: {
    visible(newval) {
      console.log("visible", newval);
      if (newval) this.init(this.value);
    },
    // markLogoList(val) {
    //   this.computedLogoImage(val);
    // },
  },
  methods: {
    init(value = {}) {
      let formList = [];
      let newValue = _.cloneDeep(value);
      console.log("formList value", value);
      formList = this.getFormList("value", newValue);
      console.log("formList", formList);
      this.formList = formList;
    },
    getFormList(baseKey = "", list = []) {
      let formList = [];
      for (let index = 0; index < list.length; index++) {
        const item = list[index];
        console.log("index", index);
        if (item.input && item.input.type) {
          let formItem = {
            key: baseKey + "[" + index + "]",
            baseData: item,
            fieldData: item.input,
          };
          if (item.input.type && item.input.type === "icon") {
            let componentData = {
              visible: true,
            };
            let logoImg = this.computedLogoImage(item.input.content);
            componentData = Object.assign(componentData, logoImg);
            formItem.componentData = componentData;
          }
          formList.push(formItem);
        }
        if (item.child && item.child.length > 0) {
          let key = baseKey + "[" + index + "].child";
          let childList = this.getFormList(key, item.child);
          formList = [...formList, ...childList];
        }
      }
      return formList;
    },
    computedLogoImage(val) {
      let markLogoList = this.markLogo;
      let that = this;
      let logoImg = {};
      let listImgDefault = {};
      for (let i = 0; i < markLogoList.length; i++) {
        if (markLogoList[i].photo_keyword == "default") {
          listImgDefault = markLogoList;
        }
        if (val && (val.toLowerCase().indexOf(markLogoList[i].photo_keyword.toLowerCase()) >= 0 || markLogoList[i].photo_keyword.toLowerCase().indexOf(val.toLowerCase()) >= 0)) {
          console.log("setLogo");
          logoImg = markLogoList[i];
          break;
        }
      }
      // 设置logo 的url
      if (!logoImg.photo_keyword) {
        logoImg = listImgDefault;
      } else if (!logoImg.photo_keyword && !listImgDefault.photo_keyword) {
        logoImg = {
          _id: { $oid: "6304807cb4a67e4013cd2b10" },
          photo_name: "默认",
          photo_name_en: "default",
          photo_keyword: "default",
          photo_url: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-915d01a8-6118-4e1e-840f-697d960cbba2/47e9cb99-42e4-4b8b-8447-c8597ea8b5b2.png",
          photo_original_name: "卷蛋糕.png",
        };
      }
      return logoImg;
      // this.logoPicker.logoInfo = logoImg;
      // // this.logoInfo = logoImg;
      // console.log("this.logoInfo", markLogoList, this.logoPicker);
      // that.logoPicker.visible = false;
      // that.$nextTick(() => {
      //   that.logoPicker.visible = true;
      // });
    },
    timestamp2Str(value) {
      try {
        let cDate = new Date(value);
        let newValue = tools.date2Str(cDate, "YYYY-MM-DD hh:mm:ss");
        return newValue;
      } catch (error) {
        return "";
      }
    },
    /**
     * 计算反色,
     * @param {*} a 色值
     * @param {*} ilighten 减弱对比度(-1 ~ -15)
     * @returns
     * 示例: oppositeColor("#000000", -4); 返回: #bbbbbb
     */
    oppositeColor(a, ilighten) {
      if (!a) {
        return a;
      }
      let tempA = a.substring(1, 7);
      //var max16 = 15;
      var max16 = Math.floor(15 + (ilighten || 0));
      if (max16 < 0 || max16 > 15) max16 = 15;

      var c16,
        c10,
        b = [];

      for (var i = 0; i < tempA.length; i++) {
        c16 = parseInt(tempA.charAt(i), 16); // to 16进制
        c10 = parseInt(max16 - c16, 10); // 10进制计算
        if (c10 < 0) c10 = Math.abs(c10);
        b.push(c10.toString(16)); // to 16进制
      }
      return "#" + b.join("");
    },
    inputChange(value, item, index) {
      let newItem = _.cloneDeep(item);
      newItem.fieldData.content = value;
      this.formList[index].fieldData = newItem.fieldData;
      console.log("setting input:", this.formList[index]);
    },
    openTimePicker(index) {
      let item = this.formList[index];
      this.timePicker = {
        visible: true,
        editData: item,
        index: index,
        value: item.fieldData.content,
      };
    },
    openLogoPicker(args, item, index) {
      this.logoPicker = {
        formItem: item,
        index,
      };
      this.formList[index].componentData.visible = true;
    },
    logoPickerConfirm(logoData = {}) {
      let that = this;
      console.log("logoData", logoData);
      if (logoData.value && typeof logoData.value == "string") {
        let logoPicker = this.logoPicker;
        let formItem = logoPicker.formItem;
        let newValue = logoData.value;
        let componentData = {
          visible: true,
        };
        componentData = Object.assign(componentData, logoData.data);
        formItem.componentData = componentData;
        formItem.fieldData.content = newValue;
        that.formList[logoPicker.index] = formItem;

        that.formList[logoPicker.index].componentData.visible = false;
        that.$nextTick(() => {
          that.formList[logoPicker.index].componentData.visible = true;
        });
        this.logoPicker = {
          formItem: {},
          index: -1,
        };
        console.log("setting logo:", that.formList[logoPicker.index]);
      }
    },
    timePickerConfirm(date = {}) {
      if (date.value && typeof date.value == "number") {
        let timePicker = this.timePicker;
        let newValue = date.value;
        timePicker.editData.fieldData.content = newValue;
        this.formList[timePicker.index] = timePicker.editData;
      }
      this.timePicker = {
        visible: false,
        editData: {},
        index: -1,
        value: "",
      };
    },
    timePickerCancel() {
      this.timePicker = {
        visible: false,
        editData: {},
        index: -1,
        value: "",
      };
    },
    submit() {
      let value = _.cloneDeep(this.value);
      let formList = _.cloneDeep(this.formList);
      let settingBox = {};
      settingBox.value = value;
      for (let index = 0; index < formList.length; index++) {
        const item = formList[index];
        item.baseData.input = item.fieldData;
        _.set(settingBox, item.key, item.baseData);
      }
      console.log("value 2", settingBox);
      this.$emit("change", settingBox);
    },
  },
};
</script>

<style lang="scss" scoped>
.editForm {
  padding: 0px 15px;
  .formItem {
    .timePicker {
      text-align: right;
      padding: 6px 0px 6px 9px;
    }
  }
  /deep/.u-input {
    padding-right: 0px;
  }
  .logo-wrapper {
    height: 40px;
    display: flex;
    align-content: center;
    justify-content: flex-end;
    align-items: center;
    .name {
      font-size: 14px;
      line-height: 40px;
      margin: 0px 10px;
    }
    image {
      height: 16px;
    }
  }
  .button-wrapper {
    .button-item {
      margin-top: 8px;
      margin-bottom: 8px;
    }
  }
}
</style>
