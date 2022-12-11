<template>
  <view class="editForm">
    <u-form labelPosition="left" ref="editForm">
      <view class="highClass">
        <u-tabs :list="tabsList" lineWidth="100" lineColor="#D7C2F3" @change="tabsChange" :current="currentTabs"></u-tabs>
      </view>
      <view class="formWrapper">
        <view class="form-simple" v-show="currentTabs === 0">
          <view v-for="(item, index) in formList" class="formItem">
            <!-- 内容start -->
            <view v-if="item.fieldData.type === 'input'" class="fieldItem fieldItemPadding">
              <u-form-item :label="item.fieldData.cnName" labelWidth="80" :prop="item.key">
                <u--input
                  :value="item.fieldData.content"
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
            <view v-else-if="item.fieldData.type === 'timepicker'" class="fieldItem fieldItemPadding">
              <u-form-item :label="item.fieldData.cnName" labelWidth="80" :prop="item.key">
                <view class="timePickShowerWrapper">
                  <view class="timePicker" @click="openTimePicker(index)">{{ timestamp2Str(item.fieldData.content) }} </view>
                  <u-icon name="arrow-right" color="#000000" width='18'></u-icon>
                </view>
                <!-- <u-icon name="arrow-right"></u-icon> -->
              </u-form-item>
            </view>
            <view v-else-if="item.fieldData.type === 'icon'" class="fieldItem fieldItemPadding">
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
                    <u-icon name="arrow-right" color="#000000" width='18'></u-icon>
                  </view>
                </hpy-form-select>
              </u-form-item>
            </view>
            <!-- 内容end -->
          </view>
        </view>
        <view class="form-complex" v-show="currentTabs === 1">
          <u-cell-group :border="false">
            <u-cell v-for="(item, index) in formList" :title="item.fieldData.cnName" :key="index" :border="index !== formList.length - 1">
              <view slot="label" class="formItem">
                <!-- 内容start -->
                <view class="fieldItem fieldItemPadding" v-if="item.fieldData.type === 'input'">
                  <u-form-item label="内容" labelWidth="80" :prop="item.key" customStyle="padding:0px">
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
                <view class="fieldItem fieldItemPadding" v-else-if="item.fieldData.type === 'timepicker'">
                  <u-form-item label="内容" labelWidth="80" :prop="item.key" customStyle="padding:0px">
                    <view class="timePicker" @click="openTimePicker(index)">{{ timestamp2Str(item.fieldData.content) }}</view>
                  </u-form-item>
                </view>
                <view class="fieldItem fieldItemPadding" v-else-if="item.fieldData.type === 'icon'">
                  <u-form-item
                    label="内容"
                    labelWidth="80"
                    customStyle="padding:0px"
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
                <!-- 内容end -->
                <!-- 内容块样式start -->
                <view class="fieldItem fieldItemPadding">
                  <u-form-item label="背景颜色" labelWidth="80" customStyle="padding:5px 0px">
                    <view class="colorBox-wrapper">
                      <view class="colorBox" @click="openColorPicker(item.baseData.background, index)" :style="{ color: oppositeColor(item.baseData.background, -1), background: item.baseData.background }">
                        {{ item.baseData.background }}
                      </view>
                    </view>
                  </u-form-item>
                </view>
                <view class="fieldItem fieldItemPadding">
                  <u-form-item label="x轴" labelWidth="80" customStyle="padding:5px 0px">
                    <view class="slider-wrapper">
                      <view class="tip-wrapper tip-left">-50</view>
                      <view class="slider"><u-slider v-model="item.baseData.xAxisOffset" step="1" min="-50" max="50" activeColor="#67C23A"></u-slider></view>
                      <view class="tip-wrapper tip-right">50</view>
                      <view class="tip-wrapper tip-right"></view>
                      <view class="inputWrapper">{{ item.baseData.xAxisOffset }}</view>
                    </view>
                  </u-form-item>
                </view>
                <view class="fieldItem fieldItemPadding">
                  <u-form-item label="y轴" labelWidth="80" customStyle="padding:5px 0px">
                    <view class="slider-wrapper">
                      <view class="tip-wrapper tip-left">-50</view>
                      <view class="slider"><u-slider v-model="item.baseData.yAxisOffset" step="1" min="-50" max="50" activeColor="#67C23A"></u-slider></view>
                      <view class="tip-wrapper tip-right">50</view>
                      <view class="tip-wrapper tip-right"></view>
                      <view class="inputWrapper">{{ item.baseData.yAxisOffset }}</view>
                    </view>
                  </u-form-item>
                </view>
                <!-- 内容块样式end -->
                <!-- 字体样式start -->
                <view class="fieldItem fieldItemCollapse" v-if="item.baseData.font">
                  <u-collapse :border="false">
                    <u-collapse-item title="字体" name="fontSettingWrapper">
                      <view class="fieldItem fieldItemPadding">
                        <u-form-item label="字体颜色" labelWidth="80" customStyle="padding:0px">
                          <view class="colorBox-wrapper">
                            <view class="colorBox" @click="openColorPicker(item.baseData.font.color, index)" :style="{ color: oppositeColor(item.baseData.font.color, -1), background: item.baseData.font.color }">
                              {{ item.baseData.font.color }}
                            </view>
                          </view>
                        </u-form-item>
                      </view>
                      <view class="fieldItem fieldItemPadding">
                        <u-form-item label="字体大小" labelWidth="80">
                          <u--input
                            :value="item.baseData.font.fontSize"
                            border="bottom"
                            placeholder="请输入字体大小"
                            inputAlign="right"
                            @change="
                              (value) => {
                                inputDefaultChange(value, item, index, 'baseData.font.fontSize');
                              }
                            "
                            customStyle="padding-right:0px"
                          ></u--input>
                        </u-form-item>
                      </view>
                    </u-collapse-item>
                  </u-collapse>
                </view>
                <!-- 字体样式end -->
              </view>
            </u-cell>
          </u-cell-group>
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
import setContentByInputType from "../js/inputConfigSetter";
import demo from "./demo";

export default {
  components: {
    tColorPicker,
  },
  props: {
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
      // ui start
      cellCustomStyle: "margin: 0px -15px",
      currentTabs: 1, // 切换开启高级选项
      tabsList: [
        {
          name: "简易",
          key: "simple",
        },
        {
          name: "高级",
          key: "complex",
        },
      ],
      // ui end
      value: [],
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
      colorPicker: {
        color: "",
        index: -1,
      },
      form: {},
      formList: [],
    };
  },
  watch: {
    visible(newval) {
      this.value = demo;
      if (newval) this.init(this.value);
    },
    // markLogoList(val) {
    //   this.computedLogoImage(val);
    // }
  },
  methods: {
    setValue(list = []) {
      let newValue = _.cloneDeep(list);
      this.value = newValue;
    },
    init(value = {}) {
      let formList = [];
      formList = this.getFormList(value);
      console.log("formList", value, formList);
      this.formList = formList;
    },
    getFormList(list = []) {
      let formList = [];
      for (let index = 0; index < list.length; index++) {
        const item = list[index];
        if (item.customOption.input && item.customOption.input.type) {
          let formItem = {
            key: index,
            baseData: _.cloneDeep(item),
            fieldData: _.cloneDeep(item.customOption.input),
          };
          if (item.customOption.input.type === "icon") {
            let componentData = {
              visible: true,
            };
            let logoImg = this.computedLogoImage(formItem.fieldData.content);
            componentData = Object.assign(componentData, logoImg);
            formItem.componentData = componentData;
          }
          formList.push(formItem);
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
    /**
     * rgba 转 二进制 hex
     * @param {Object} rgb
     */
    rgbaToHex(rgba) {
      let alpha = Math.round(rgba.a * 255);
      let hex = [rgba.r.toString(16), rgba.g.toString(16), rgba.b.toString(16), alpha.toString(16)];
      hex.map(function (str, i) {
        if (str.length == 1) {
          hex[i] = "0" + str;
        }
      });
      return "#" + hex.join("");
    },
    tabsChange(item) {
      this.currentTabs = item.index;
      // console.log("tabsChange", item);
    },
    inputChange(value, item, index) {
      let newItem = _.cloneDeep(item);
      newItem.fieldData.content = value;
      this.formList[index].fieldData = newItem.fieldData;
      console.log("setting input:", this.formList[index]);
    },
    inputDefaultChange(value, item, index, key) {
      let newItem = _.cloneDeep(item);
      _.set(newItem, key, value);
      this.formList[index] = newItem;
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
    openColorPicker(data, index) {
      this.colorPicker = {
        color: data,
        index,
      };
      console.log("openColorPicker", data, index);
      // 打开颜色选择器
      this.$refs.colorPicker.open(data);
    },
    logoPickerConfirm(logoData = {}) {
      let that = this;
      console.log("logoData", logoData);
      if (logoData.value && typeof logoData.value == "string") {
        let logoPicker = this.logoPicker;
        let formItem = that.formList[logoPicker.index];
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
    confirmColorPicker(data) {
      // 获得当前颜色rgba值
      let hex = this.rgbaToHex(data.rgba);
      console.log("hex", hex, data.rgba, data);
      this.formList[this.colorPicker.index].baseData.background = hex;
      this.colorPicker = {
        color: "",
        index: -1,
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

    resetForm() {
      this.init(this.value);
    },
    submit() {
      let value = _.cloneDeep(this.value);
      let formList = _.cloneDeep(this.formList);
      let settingBox = {};
      settingBox.value = value;
      for (let index = 0; index < formList.length; index++) {
        const item = formList[index];
        // 设置input属性
        item.baseData.input = item.fieldData;
        // 设置content内容
        item.baseData.content = setContentByInputType(item.fieldData) || item.baseData.content;
        // _.set(settingBox, item.key, item.baseData);
        settingBox.value[item.key] = item.baseData;
      }
      this.$emit("change", settingBox.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.editForm {
  background-color: #fff;
  .formItem {
    .fieldItemPadding {
      padding: 0px 15px;
    }
    .fieldItem {
      height: 50px;
      display: grid;
      align-items: center;
      .timePickShowerWrapper{
        display: flex;
        justify-content: flex-end;
      }
      // border: 1px solid #000;
    }
    .fieldItemCollapse {
      height: auto;
    }
    .timePicker {
      text-align: right;
      padding: 6px 0px 6px 9px;
    }
  }
  /deep/.u-input {
    padding-right: 0px;
  }
  .formWrapper {
    max-height: 60vh;
    // height: 60vh;
    overflow-y: auto;
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
    padding: 0px 15px;
    .button-item {
      margin-top: 8px;
      margin-bottom: 8px;
    }
  }
  .colorBox-wrapper {
    display: flex;
    justify-content: flex-end;
    .colorBox {
      display: inline-block;
      height: 18px;
      font-size: 14px;
      padding: 4px 8px;
      border-radius: 2px;
      border: 1px solid rgb(214, 215, 217);
      // -webkit-text-stroke: 1px  #000;
      // text-stroke: 1px #000;
      font-weight: 600;
    }
  }
  .slider-wrapper {
    width: 100%;
    display: flex;
    align-content: center;
    justify-content: center;
    .tip-wrapper {
      flex: 1;
      line-height: 38px;
    }
    .slider {
      flex: 5;
    }
    .inputWrapper {
      text-align: right;
      flex: 1;
      line-height: 38px;
    }
  }
}
</style>
