<template>
  <view class="editForm">
    <u-form labelPosition="left" ref="editForm">
      <view class="tabWrapper">
        <u-tabs :list="tabsList" lineWidth="50" itemStyle="width:100px;height:50px" lineColor="#D7C2F3" @change="tabsChange" :current="currentTabs"></u-tabs>
      </view>
      <u-line :length="tabsList[currentTabs].showLine ? '100%' : '0%'"></u-line>
      <scroll-view scroll-y="true" class="formWrapper" @scroll="viewScroll" @scrolltoupper="viewScrollToTop">
        <view class="form-simple" v-show="currentTabs === 0">
          <view v-for="(item, index) in formList" class="formItem">
            <!-- 内容start -->
            <view v-if="item.fieldData.type === 'input'" class="fieldItem fieldItemPadding">
              <u-form-item :label="item.fieldData.cnName || `内容-${index + 1}`" labelWidth="80" :prop="item.key">
                <u--input
                  :value="item.fieldData.content"
                  :placeholder="'请输入' + item.fieldData.cnName"
                  inputAlign="right"
                  border="bottom"
                  clearable="true"
                  @change="
                    (value) => {
                      inputDefaultChange(value, item, index, 'fieldData.content');
                    }
                  "
                  customStyle="padding-right:0px"
                ></u--input>
              </u-form-item>
            </view>
            <view v-else-if="item.fieldData.type === 'timepicker'" class="fieldItem fieldItemPadding">
              <u-form-item :label="item.fieldData.cnName || `内容-${index + 1}`" labelWidth="80" :prop="item.key">
                <view class="pickShowerDefaultWrapper">
                  <view class="timePicker" @click="openTimePicker(index)">{{ timestamp2Str(item.fieldData.content) }} </view>
                  <u-icon name="arrow-right" color="#000000" width="18"></u-icon>
                </view>
                <!-- <u-icon name="arrow-right"></u-icon> -->
              </u-form-item>
            </view>
            <view v-else-if="item.fieldData.type === 'icon'" class="fieldItem fieldItemPadding fieldItemLogo">
              <u-form-item :label="item.fieldData.cnName || `内容-${index + 1}`" labelWidth="80" customStyle="padding:5px 0px" :key="item.key">
                <view
                  class="logo-wrapper"
                  @click="
                    () => {
                      openLogoPicker(item, index);
                    }
                  "
                >
                  <logoItem :value="item.componentData"></logoItem>
                </view>
              </u-form-item>
            </view>
            <!-- 内容end -->
          </view>
        </view>
        <view class="form-complex" v-show="currentTabs === 1">
          <view v-for="(item, index) in formList" :key="index" class="formItem">
            <view class="form-title">{{ item.fieldData.cnName || `内容-${index + 1}` }}</view>
            <!-- 内容start -->
            <view class="fieldItem fieldItemPadding" v-if="item.fieldData.type === 'input'">
              <u-form-item label="内容" labelWidth="80" :prop="item.key" customStyle="padding:0px">
                <u--input
                  :value="item.fieldData.content"
                  border="bottom"
                  :placeholder="'请输入' + item.fieldData.cnName"
                  inputAlign="right"
                  clearable="true"
                  @change="
                    (value) => {
                      inputDefaultChange(value, item, index, 'fieldData.content');
                    }
                  "
                  customStyle="padding-right:0px"
                ></u--input>
              </u-form-item>
            </view>
            <view class="fieldItem fieldItemPadding" v-else-if="item.fieldData.type === 'timepicker'">
              <u-form-item label="内容" labelWidth="80" :prop="item.key" customStyle="padding:0px">
                <view class="pickShowerDefaultWrapper">
                  <view class="timePicker" @click="openTimePicker(index)">{{ timestamp2Str(item.fieldData.content) }} </view>
                  <u-icon name="arrow-right" color="#000000" width="18"></u-icon>
                </view>
              </u-form-item>
            </view>
            <view class="fieldItem fieldItemPadding fieldItemLogo" v-else-if="item.fieldData.type === 'icon'">
              <u-form-item label="内容" labelWidth="80" customStyle="padding:0px">
                <view
                  class="logo-wrapper"
                  @click="
                    () => {
                      openLogoPicker(item, index);
                    }
                  "
                >
                  <logoItem :value="item.componentData"></logoItem>
                </view>
              </u-form-item>
            </view>
            <!-- 内容end -->
            <!-- 内容块样式start -->
            <view class="fieldItem fieldItemPadding">
              <u-form-item label="背景颜色" labelWidth="80" customStyle="padding:5px 0px">
                <view class="colorBox-wrapper">
                  <view class="colorBox" @click="openColorPicker(item.baseData.background, index)" :style="{ color: oppositeColor(item.baseData.background, -1), background: item.baseData.background }">
                    <!-- {{ item.baseData.background }} -->
                    {{ background2Str(item.baseData.background) }}
                  </view>
                </view>
              </u-form-item>
            </view>
            <view class="fieldItem fieldItemPadding">
              <u-form-item label="x轴" labelWidth="80" customStyle="padding:5px 0px">
                <view class="slider-wrapper">
                  <view class="tip-wrapper tip-left">-50</view>
                  <view class="slider"><u-slider v-model="item.baseData.xAxisOffset" step="1" min="-50" max="50" activeColor="#D7C2F3"></u-slider></view>
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
                  <view class="slider"><u-slider v-model="item.baseData.yAxisOffset" step="1" min="-50" max="50" activeColor="#D7C2F3"></u-slider></view>
                  <view class="tip-wrapper tip-right">50</view>
                  <view class="tip-wrapper tip-right"></view>
                  <view class="inputWrapper">{{ item.baseData.yAxisOffset }}</view>
                </view>
              </u-form-item>
            </view>
            <view class="fieldItem fieldItemPadding">
              <u-form-item label="圆角半径" labelWidth="80">
                <u--input
                  :value="item.baseData.round"
                  border="bottom"
                  placeholder="请输入圆角半径"
                  inputAlign="right"
                  clearable="true"
                  type="digit"
                  @change="
                    (value) => {
                      inputDefaultChange(value, item, index, 'baseData.round');
                    }
                  "
                  customStyle="padding-right:0px"
                ></u--input>
              </u-form-item>
            </view>
            <!-- 内容块样式end -->
            <!-- 边框start -->
            <view class="fieldItem fieldItemCollapse" v-if="item.computedData.border">
              <u-collapse :border="false">
                <u-collapse-item title="边框" name="borderSettingWrapper" value="展开">
                  <view class="u-collapse-item-wrapper">
                    <view class="fieldItem fieldItemPadding" v-for="(bfItem, bfIndex) in borderFormLabel" :key="bfIndex">
                      <u-form-item :label="bfItem.label" labelWidth="80">
                        <u--input
                          :value="getValue(item, bfItem.dataKey)"
                          border="bottom"
                          :placeholder="'请输入' + bfItem.label"
                          inputAlign="right"
                          clearable="true"
                          type="digit"
                          @change="
                            (value) => {
                              inputDefaultChange(value, item, index, bfItem.dataKey);
                            }
                          "
                          customStyle="padding-right:0px"
                        ></u--input>
                      </u-form-item>
                    </view>
                    <view class="fieldItem fieldItemPadding">
                      <u-form-item label="颜色" labelWidth="80" customStyle="padding:0px">
                        <view class="colorBox-wrapper">
                          <view class="colorBox" @click="openColorPicker(item.computedData.border.color, index)" :style="{ color: oppositeColor(item.computedData.border.color, -1), background: item.computedData.border.color }">
                            {{ background2Str(item.computedData.border.color) }}
                          </view>
                        </view>
                      </u-form-item>
                    </view>
                    <view class="fieldItem fieldItemPadding">
                      <u-form-item label="样式" labelWidth="80" :prop="item.key" customStyle="padding:0px">
                        <view class="pickShowerDefaultWrapper">
                          <view @click="openDefaultPicker(index, borderTypePickerColumns, 'computedData.border.style')">
                            <!-- {{ fontFamily2Str(item.baseData.font.fontFamily) }}  -->
                            {{ defaultPikerItem2Str(borderTypePickerColumns, item.computedData.border.style) }}
                          </view>
                          <u-icon name="arrow-right" color="#000000" width="18"></u-icon>
                        </view>
                      </u-form-item>
                    </view>
                  </view>
                </u-collapse-item>
              </u-collapse>
            </view>
            <!-- 边框end -->
            <!-- 字体样式start -->
            <view class="fieldItem fieldItemCollapse" v-if="item.baseData.font">
              <u-collapse :border="false">
                <u-collapse-item title="字体" name="fontSettingWrapper" value="展开">
                  <view class="u-collapse-item-wrapper">
                    <view class="fieldItem fieldItemPadding">
                      <u-form-item label="粗细" labelWidth="80" :prop="item.key" customStyle="padding:0px">
                        <view class="switchBox-wrapper">
                          <u-switch :value="item.baseData.font.bold" size="18" activeColor="#D7C2F3"></u-switch>
                        </view>
                      </u-form-item>
                    </view>
                    <view class="fieldItem fieldItemPadding">
                      <u-form-item label="颜色" labelWidth="80" customStyle="padding:0px">
                        <view class="colorBox-wrapper">
                          <view class="colorBox" @click="openColorPicker(item.baseData.font.color, index)" :style="{ color: oppositeColor(item.baseData.font.color, -1), background: item.baseData.font.color }">
                            {{ background2Str(item.baseData.font.color) }}
                          </view>
                        </view>
                      </u-form-item>
                    </view>
                    <view class="fieldItem fieldItemPadding">
                      <u-form-item label="线形" labelWidth="80" :prop="item.key" customStyle="padding:0px">
                        <view class="pickShowerDefaultWrapper">
                          <view @click="openDefaultPicker(index, fontPickerColumns, 'baseData.font.fontFamily')">
                            {{ defaultPikerItem2Str(fontPickerColumns, item.baseData.font.fontFamily) }}
                          </view>
                          <u-icon name="arrow-right" color="#000000" width="18"></u-icon>
                        </view>
                      </u-form-item>
                    </view>
                    <view class="fieldItem fieldItemPadding">
                      <u-form-item label="大小" labelWidth="80">
                        <u--input
                          :value="item.baseData.font.fontSize"
                          border="bottom"
                          placeholder="请输入字体大小"
                          inputAlign="right"
                          clearable="true"
                          type="digit"
                          @change="
                            (value) => {
                              inputDefaultChange(value, item, index, 'baseData.font.fontSize');
                            }
                          "
                          customStyle="padding-right:0px"
                        ></u--input>
                      </u-form-item>
                    </view>
                    <view class="fieldItem fieldItemPadding">
                      <!-- <u-form-item label="样式代码" labelWidth="80" :prop="item.key" customStyle="padding:0px">
                            <u--textarea
                              :value="item.baseData.font.style"
                              border="bottom"
                              placeholder="请输入自定义样式代码"
                              height="90"
                              clearable="true"
                              @input="
                                (value) => {
                                  inputDefaultChange(value, item, index, 'baseData.font.style');
                                }
                              "
                              customStyle="padding-right:0px"
                            ></u--textarea>
                          </u-form-item> -->
                      <u-form-item label="样式" labelWidth="80" :prop="item.key" customStyle="padding:0px">
                        <view class="pickShowerDefaultWrapper">
                          <view @click="openCanvasFontPicker(index, item.baseData.font.style, 'baseData.font.style')">{{ item.baseData.font.style ? item.baseData.font.style : "请选择" }} </view>
                          <u-icon name="arrow-right" color="#000000" width="18"></u-icon>
                        </view>
                      </u-form-item>
                    </view>
                  </view>
                </u-collapse-item>
              </u-collapse>
            </view>
            <!-- 字体样式end -->
            <!-- 内外边距start -->
            <view v-for="(pmItem, pmIndex) in paddingMarginListFormLabel" :key="pmIndex">
              <view class="fieldItem fieldItemCollapse">
                <u-collapse :border="false">
                  <u-collapse-item :title="pmItem.title" value="展开">
                    <view class="u-collapse-item-wrapper">
                      <view class="fieldItem fieldItemPadding" v-for="(pmlItem, pmlIndex) in pmItem.list" :key="pmlIndex">
                        <u-form-item :label="pmlItem.label" labelWidth="80">
                          <u--input
                            :value="getValue(item, pmlItem.dataKey)"
                            border="bottom"
                            :placeholder="'请输入' + pmlItem.label"
                            inputAlign="right"
                            clearable="true"
                            type="digit"
                            @change="
                              (value) => {
                                inputDefaultChange(value, item, index, pmlItem.dataKey);
                              }
                            "
                            customStyle="padding-right:0px"
                          ></u--input>
                        </u-form-item>
                      </view>
                    </view>
                  </u-collapse-item>
                </u-collapse>
              </view>
            </view>
            <!-- 内外边距end -->
            <u-line v-if="index !== formList.length - 1" margin="10px 0px"></u-line>
          </view>
        </view>
      </scroll-view>
      <view class="button-wrapper">
        <view class="button-item"> <u-button @click="resetForm">重置</u-button></view>
        <view class="button-item"><u-button :disabled="!isFormChange" @click="submit" color="#D7C2F3">确认</u-button></view>
      </view>
    </u-form>
    <!-- picker组件start -->
    <t-color-picker ref="colorPicker" @confirm="confirmColorPicker"></t-color-picker>
    <u-datetime-picker :show="timePicker.visible" v-model="timePicker.value" mode="datetime" closeOnClickOverlay @confirm="timePickerConfirm" @cancel="timePickerCancel"></u-datetime-picker>
    <u-picker :show="defaultPicker.visible" ref="defaultPicker" :columns="defaultPicker.columns" @confirm="confirmDefaultPicker" keyName="label" @cancel="defaultPickerCancel"></u-picker>
    <!-- picker组件 - 字体样式popup start -->
    <u-popup ref="popup" mode="bottom" :show="canvasFontPicker.visible" :safeAreaInsetBottom="true">
      <multi-select color="#D7C2F3" :list="canvasFontColumns" :defaultValue="canvasFontPicker.value" keyLabel="label" keyValue="key" @cancel="canvasFontPickerCancel" @change="canvasFontPickerConfirm"></multi-select>
    </u-popup>
    <!-- picker组件 - 字体样式popup end -->
    <!-- picker组件 - logopopup start -->
    <u-popup ref="popup" mode="bottom" :show="logoPicker.visible" :safeAreaInsetBottom="true">
      <logo-select color="#D7C2F3" :show="logoPicker.visible" :isMultiple="false" :list="markLogo" :defaultValue="logoPicker.value" keyLabel="photo_name" keyValue="photo_keyword" @cancel="logoPickerCancel" @change="logoPickerConfirm"> </logo-select>
    </u-popup>
    <!-- picker组件 - logopopup end -->
    <!-- picker组件end -->
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import tColorPicker from "@/components/t-color-picker/t-color-picker.vue";
import tools from "@/libs/tools/index.js";
import setContentByInputType from "../js/inputConfigSetter.js";
import demo from "./demo.js";
import multiSelect from "@/components/multiSelect/index.vue";
import logoSelect from "@/components/logoSelect/index.vue";
import logoItem from "@/components/logoSelect/components/logoItem.vue";

export default {
  components: {
    tColorPicker,
    multiSelect,
    logoSelect,
    logoItem,
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
      canvasFontColumns: [
        {
          label: "<span style='font-weight:600;'>normal</span>",
          key: "normal",
        },
        {
          label: "<span style='font-weight:600;'>italic</span> <span>(font-style)</span>",
          key: "italic",
        },
        {
          label: "<span style='font-weight:600;'>oblique</span> <span>(font-style)</span>",
          key: "oblique",
        },
        {
          label: "<span style='font-weight:600;'>small-caps</span> <span>(font-variant)</span>",
          key: "small-caps",
        },
        {
          label: "<span style='font-weight:600;'>bold</span> <span>(font-weight)</span>",
          key: "bold",
        },
        {
          label: "<span style='font-weight:600;'>bolder</span> <span>(font-weight)</span>",
          key: "bolder",
        },
        {
          label: "<span style='font-weight:600;'>lighter</span> <span>(font-weight)</span>",
          key: "lighter",
        },
      ],
      tabsList: [
        {
          name: "简易",
          key: "simple",
          showLine: false,
        },
        {
          name: "高级",
          key: "complex",
          showLine: false,
        },
      ],
      fontPickerColumns: [
        [
          {
            label: "默认",
            key: "normal",
          },
        ],
      ],
      borderTypePickerColumns: [
        [
          {
            label: "点线边框(dotted)",
            key: "dotted",
          },
          {
            label: "虚线边框(dashed)",
            key: "dashed",
          },
          {
            label: "实线边框(solid)",
            key: "solid",
          },
        ],
      ],
      borderFormLabel: [
        {
          label: "上边框",
          dataKey: "computedData.border.width.top",
        },
        {
          label: "右边框",
          dataKey: "computedData.border.width.right",
        },
        {
          label: "下边框",
          dataKey: "computedData.border.width.bottom",
        },
        {
          label: "左边框",
          dataKey: "computedData.border.width.left",
        },
      ],
      paddingMarginListFormLabel: [
        {
          title: "内边距",
          key: "computedData.padding",
          list: [
            {
              label: "上内边距",
              dataKey: "computedData.padding.top",
            },
            {
              label: "右内边距",
              dataKey: "computedData.padding.right",
            },
            {
              label: "下内边距",
              dataKey: "computedData.padding.bottom",
            },
            {
              label: "左内边距",
              dataKey: "computedData.padding.left",
            },
          ],
        },
        {
          title: "外边距",
          key: "computedData.margin",
          list: [
            {
              label: "上外边距",
              dataKey: "computedData.margin.top",
            },
            {
              label: "右外边距",
              dataKey: "computedData.margin.right",
            },
            {
              label: "下外边距",
              dataKey: "computedData.margin.bottom",
            },
            {
              label: "左外边距",
              dataKey: "computedData.margin.left",
            },
          ],
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
        visible: false,
        formItem: {},
        index: -1,
        value: [],
      },
      colorPicker: {
        color: "",
        index: -1,
      },
      defaultPicker: {
        visible: false,
        columns: [],
        index: -1,
        key: "",
      },
      canvasFontPicker: {
        visible: false,
        index: -1,
        value: "",
        key: "",
      },
      form: {},
      formList: [],
      isFormChange: false,
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
    getValue(object, key, defaultData = "") {
      return _.get(object, key, defaultData);
    },
    // 滚动事件
    viewScroll(e) {
      if (this.tabsList[this.currentTabs].showLine && e.detail.scrollTop >= 50) {
        return;
      }
      if (e.detail.scrollTop >= 50) {
        this.tabsList[this.currentTabs].showLine = true;
      } else {
        this.tabsList[this.currentTabs].showLine = false;
      }
    },
    // 滚动到顶部事件
    viewScrollToTop(e) {
      this.tabsList[this.currentTabs].showLine = false;
      console.log("到顶部", this.tabsList[this.currentTabs].showLine);
    },
    setValue(list = []) {
      let newValue = _.cloneDeep(list);
      this.value = newValue;
    },
    init(value = {}) {
      let formList = [];
      formList = this.getFormList(value);
      console.log("formList", value, formList);
      this.formList = formList;
      this.isFormChange = false;
    },
    getFormList(list = []) {
      let formList = [];
      for (let index = 0; index < list.length; index++) {
        const item = list[index];
        if (item.customOption.input && item.customOption.input.type) {
          let formItem = {
            key: index,
            baseData: _.cloneDeep(item), // 整体数据
            fieldData: _.cloneDeep(item.customOption.input), // 输入内容
            computedData: _.cloneDeep(item.computedData), // 计算属性
          };
          if (item.customOption.input.type === "icon") {
            let logoImg = this.computedLogoImage(formItem.fieldData.content);
            formItem.componentData = logoImg;
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
    // 时间戳转换可视日期结构 YYYY-MM-DD hh:mm:ss
    timestamp2Str(value) {
      try {
        let cDate = new Date(value);
        let newValue = tools.date2Str(cDate, "YYYY-MM-DD hh:mm:ss");
        return newValue;
      } catch (error) {
        return "";
      }
    },
    // 默认选择器对应的显示label的方法
    defaultPikerItem2Str(columns, value, findKey = "key", defaultName = "默认") {
      let name = defaultName;
      for (let index = 0; index < columns[0].length; index++) {
        const item = columns[0][index];
        if (item[findKey] == value) {
          name = item.label;
          break;
        }
      }
      if (!value || value == "") {
        name = defaultName;
      }
      return name;
    },
    // 颜色#ffffff00 转换为可视化rgb:#ffffff,a:0/255
    background2Str(value) {
      let color = value.substring(0, 7);
      let alpha = value.substring(7, 9);
      function hex2int(hex) {
        var len = hex.length,
          a = new Array(len),
          code;
        for (var i = 0; i < len; i++) {
          code = hex.charCodeAt(i);
          if (48 <= code && code < 58) {
            code -= 48;
          } else {
            code = (code & 0xdf) - 65 + 10;
          }
          a[i] = code;
        }
        return a.reduce(function (acc, c) {
          acc = 16 * acc + c;
          return acc;
        }, 0);
      }
      let alpha10 = hex2int(alpha);
      return "rgb:" + color + "，a:" + alpha10 + "/255";
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
      // console.log("oppositeColor", "#" + b.join("") + "ff");
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
      this.isFormChange = true;
      console.log("setting input:", this.formList[index]);
    },
    inputDefaultChange(value, item, index, key) {
      let newItem = _.cloneDeep(item);
      _.set(newItem, key, value);
      this.formList[index] = newItem;
      this.isFormChange = true;
      console.log("setting input:", this.formList[index]);
    },
    openDefaultPicker(index, columns, setterKey) {
      this.defaultPicker = {
        index,
        columns,
        key: setterKey, // 设置器的指定的值
        visible: true,
      };
    },
    openCanvasFontPicker(index, value, setterKey) {
      let newPickerValue = [];
      let isAllLegal = true;
      if (value && value.length > 0) {
        let list = value.split(" ");
        for (let index = 0; index < list.length; index++) {
          const item = list[index];
          let isFind = false;
          for (let cindex = 0; cindex < this.canvasFontColumns.length; cindex++) {
            const citem = this.canvasFontColumns[cindex];
            if (item === citem.key) {
              newPickerValue.push(item);
              isFind = true;
              break;
            }
          }
          if (!isFind && isAllLegal) {
            isAllLegal = false;
          }
        }
      }
      if (!isAllLegal) {
        this.showToast("非法fontStyle已删除");
      }
      this.canvasFontPicker = {
        visible: true,
        index,
        value: newPickerValue,
        key: setterKey,
      };
      console.log("newPickerValue", newPickerValue);
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
    openLogoPicker(item, index) {
      this.logoPicker = {
        visible: true,
        formItem: item,
        index,
        value: [item.componentData],
      };
      // this.formList[index].componentData.visible = true;
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
    logoPickerConfirm(logoList = {}) {
      let that = this;
      let logoData = logoList[0];
      console.log("logoData", logoData);
      let newItem = this.formList[this.logoPicker.index];
      newItem.componentData = logoData;
      let newValue = logoData.photo_keyword;
      newItem.fieldData.content = newValue;
      that.formList[this.logoPicker.index] = newItem;
      console.log("setting logo:", that.formList[this.logoPicker.index]);

      this.logoPickerCancel();
    },
    timePickerConfirm(date = {}) {
      if (date.value && typeof date.value == "number") {
        let timePicker = this.timePicker;
        let newValue = date.value;
        timePicker.editData.fieldData.content = newValue;
        this.formList[timePicker.index] = timePicker.editData;
        console.log("setting time picker:", this.formList[this.timePicker.index]);
      }
      this.isFormChange = true;
      this.timePickerCancel();
    },
    confirmColorPicker(data) {
      // 获得当前颜色rgba值
      let hex = this.rgbaToHex(data.rgba);
      this.formList[this.colorPicker.index].baseData.background = hex;
      this.isFormChange = true;
      console.log("setting color picker:", this.formList[this.colorPicker.index]);
      this.colorPicker = {
        color: "",
        index: -1,
      };
    },
    confirmDefaultPicker(data) {
      let newValue = data.value[0].key;
      let newItem = this.formList[this.defaultPicker.index];
      _.set(newItem, this.defaultPicker.key, newValue);
      this.formList[this.defaultPicker.index] = newItem;
      this.isFormChange = true;
      console.log("setting default picker:", this.formList[this.defaultPicker.index]);

      this.defaultPickerCancel();
    },
    canvasFontPickerConfirm(data) {
      console.log("canvasFontPickerConfirm", data);
      let newValue = "";
      let fontList = [];
      for (let index = 0; index < data.length; index++) {
        const item = data[index];
        fontList.push(item.key);
      }
      newValue = fontList.join(" ");
      let newItem = this.formList[this.canvasFontPicker.index];
      _.set(newItem, this.canvasFontPicker.key, newValue);
      this.formList[this.canvasFontPicker.index] = newItem;
      console.log("setting canvasfont picker:", this.formList[this.canvasFontPicker.index]);

      this.canvasFontPickerCancel();
    },
    logoPickerCancel() {
      this.logoPicker = {
        visible: false,
        formItem: {},
        index: -1,
        value: [],
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
    defaultPickerCancel() {
      this.defaultPicker = {
        visible: false,
        columns: [],
        index: -1,
        key: "",
      };
    },

    canvasFontPickerCancel() {
      this.canvasFontPicker = {
        visible: false,
        index: -1,
        value: "",
        key: "",
      };
    },
    resetForm() {
      this.init(this.value);
    },
    // TODO
    // TODO padding margin border计算
    // TODO 字体计算
    // TODO 保存当前配置
    // TODO 自订个性化配置，则是吧当前EXIFObject 转换为config，
    // TODO 新增分享config 逻辑
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
    showToast(msg, callback) {
      this.$refs.uToast.show({
        type: "default",
        title: "默认主题",
        message: msg,
        complete() {
          if (callback && typeof callback == "function") {
            callback();
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.editForm {
  background-color: #fff;
  .tabWrapper {
    margin-top: -40px;
  }
  .formItem {
    /deep/.u-line,
    .fieldItemPadding {
      padding: 0px 15px;
    }
    .form-title {
      font-size: 16px;
      font-weight: bolder;
      line-height: 40px;
    }
    .fieldItem {
      height: 50px;
      display: grid;
      align-items: center;

      .pickShowerDefaultWrapper {
        display: flex;
        justify-content: flex-end;
      }
      // border: 1px solid #000;
    }
    .fieldItemLogo,
    .fieldItemTextarea,
    .fieldItemCollapse {
      height: auto;
    }
    .timePicker {
      text-align: right;
      padding: 6px 0px 6px 9px;
    }
    .u-collapse-item-wrapper {
      background-color: rgb(247, 247, 249);
    }
  }
  /deep/.u-input {
    padding-right: 0px;
  }
  .formWrapper {
    max-height: 60vh;
    // overflow-y: auto;
    width: 100%;
    .form-simple {
      padding: 2px 15px;
      .fieldItemPadding {
        padding: 0px;
      }
    }
    .form-complex {
      padding: 0px 15px;
    }
  }
  .logo-wrapper {
    // height: 40px;
    min-height: 40px;
    display: flex;
    align-content: center;
    justify-content: flex-end;
    align-items: center;
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
      line-height: 18px;
      font-size: 12px;
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
  .switchBox-wrapper {
    display: flex;
    align-content: center;
    justify-content: flex-end;
  }
}
</style>
