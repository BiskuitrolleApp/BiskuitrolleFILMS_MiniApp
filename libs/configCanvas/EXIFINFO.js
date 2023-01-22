import tools from "../tools/index";
// import { setScaling } from './Core'
import { setCoreValue, getCoreVar, dataDictionary, dataDictionaryNotNeed } from "./var";

import { clearNoNum } from "./utils/number/index";

// 常用固定数值
const $MAX_IMAGE_THUMBNAIL_WIDTH = 300; // 图片显示缩略图显示最大为300
const $MAX_IMAGE_DOWNLOADER_WIDTH = 3000; // 图片下载器最大为下载为3000

/**
 * 设置EXIFINFO的盒子模型信息后可以用这个方法来计算盒子模型信息的具体信息
 * After setting the box model information of exif info, this method can be used to calculate the specific information of the box model information
 * @params {String|Number|Array} boxModelData 传入计算的数值
 * @returns {Object} Returns the new object of padding.
 */
function getBoxModelFillGap(boxModelData = "0") {
  if (!boxModelData || boxModelData.length == 0) {
    throw "setting boxModelData data please!";
  }
  let gap = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };
  try {
    let gapList = [];
    if (typeof boxModelData == "number") {
      gapList = [boxModelData];
    } else if (Array.isArray(boxModelData)) {
      gapList = boxModelData;
    } else {
      gapList = boxModelData.split(" ");
    }
    if (gapList.length == 0) {
      throw "invalid padding or margin data!";
    }
    // 计算不同长度的 padding or margin的数据
    if (gapList.length == 1) {
      [gap.top, gap.right, gap.bottom, gap.left] = [gapList[0] * 1, gapList[0] * 1, gapList[0] * 1, gapList[0] * 1];
    } else if (gapList.length == 2) {
      [gap.top, gap.right, gap.bottom, gap.left] = [gapList[0] * 1, gapList[1] * 1, gapList[0] * 1, gapList[1] * 1];
    } else if (gapList.length == 3) {
      [gap.top, gap.right, gap.bottom, gap.left] = [gapList[0] * 1, gapList[1] * 1, gapList[2] * 1, gapList[1] * 1];
    } else if (gapList.length >= 4) {
      [gap.top, gap.right, gap.bottom, gap.left] = [gapList[0] * 1, gapList[1] * 1, gapList[2] * 1, gapList[3] * 1];
    }
  } catch (error) {
    throw error;
  }
  return gap;
}

/**
 * 输入计算属性计算垂直和水平方向额外的盒子模型需要的数据
 * Input computing properties to calculate the vertical and horizontal directions of the additional box model required data
 * @param {*} computedData EXIFINFO的computedData参数；EXIFINFO's computedData parameter
 */
function getComputedDataVerticalAndHorizontal(computedData = {}) {
  let boxData = {
    vertical: 0,
    horizontal: 0,
  };
  let { padding, margin, border } = computedData;
  boxData.horizontal = padding.left + padding.right + margin.left + margin.right + border.width.left + border.width.right;
  boxData.vertical = padding.top + padding.bottom + margin.top + margin.bottom + border.width.top + border.width.bottom;
  return boxData;
}

/**
 * exif 信息对象
 * exif information object
 */
class EXIFINFO {
  constructor(id, type, parentNode, content, value, customDataDictionary = [], customDataDictionaryNotNeed = []) {
    this.level = 0; // 层级
    this.parentNode = parentNode; // 父元素
    if (parentNode.id) {
      this.root = false;
    } else {
      this.root = true;
    }
    // 位置信息
    this.display = "block"; // 显示类型 支持flex和block布局
    // 水平位置
    // left（默认值）：左对齐
    // rigth：右对齐
    // center： 居中
    // space-between：两端对齐，项目之间的间隔都相等。（用于flex有用）
    // space-around：每个项目两侧的间隔相等。（用于flex有用）
    this.horizontal = "left";

    // 垂直位置
    // top（默认值）：顶对齐
    // buttom：底对齐
    // center： 居中
    this.vertical = "top";

    // 整体实际宽高
    this.width = 0;
    this.height = 0;
    // 内容宽高
    this.contentWidth = 0;
    this.contentHeight = 0;
    // 限制整体内容最大宽高（包括width+padding+border+margin）
    this.maxWidth = 0;
    this.maxHeight = 0;

    this.padding = "0";
    this.margin = "0";
    this.border = "0px solid #ffffff00"; // 支持 dotted solid double dashed
    this.round = 0;
    this.background = "#ffffff00"; // 默认无背景

    this.customOption = {}; // 自定义信息
    let originItem = ["width", "height", "maxWidth", "maxHeight"];
    this.originSpecification = {};
    for (const key in originItem) {
      if (Object.hasOwnProperty.call(value, key)) {
        const ObjValue = value[key];
        this.originSpecification[key] = ObjValue;
      }
    }
    // 实际位置x轴和y轴分布
    this.axisInfo = {
      x: 0,
      y: 0,
    };
    this.xAxisOffset = 0; // x偏移 自选偏移
    this.yAxisOffset = 0; // y偏移 自选偏移
    let cDataDictionary = [...customDataDictionary, ...dataDictionary];
    let cDataDictionaryNotNeed = [...customDataDictionaryNotNeed, ...dataDictionaryNotNeed];
    // 赋值默认信息
    for (const key in value) {
      if (Object.hasOwnProperty.call(value, key)) {
        const ObjValue = value[key];
        if (cDataDictionary.indexOf(key) >= 0 && cDataDictionaryNotNeed.indexOf(key) < 0) {
          this[key] = ObjValue;
        } else if (cDataDictionaryNotNeed.indexOf(key) < 0) {
          this.customOption[key] = ObjValue;
        }
      }
    }
    this.id = id;
    this.content = content;
    this.type = type; // text block image

    // 计算属性
    this.computedData = {
      padding: {},
      margin: {},
      border: {},
    };
    // 获得计算属性
    this.computedData = this.getComputedData();

    // 用于计算maxWidth和maxHeight
    let calculationWidth = value.maxWidth || "auto";
    let calculationHeight = value.maxHeight || "auto";
    if (!value.maxWidth || value.maxWidth == "" || value.maxWidth == "auto") {
      calculationWidth = "auto";
    }
    if (!value.maxHeight || value.maxHeight == "" || value.maxHeight == "auto") {
      calculationHeight = "auto";
      if (calculationWidth === "auto" && value.mainImage) {
        calculationWidth = $MAX_IMAGE_THUMBNAIL_WIDTH; // 如果没有设置width，自动设置内容宽度为缩略图$MAX_IMAGE_THUMBNAIL_WIDTH
      }
    }
    // 当前设置的
    this.maxWidth = calculationWidth;
    this.maxHeight = calculationHeight;
  }
  /**
   * 获得border具体样式包括：style，color，width；
   * Get border specific styles included：style, color, width;
   * @returns {padding,margin,border}
   */
  getBorder() {
    let borderList = this.border.split(" ");
    let width = 0;
    let widthList = [];
    let style = "solid";
    let styleList = ["dotted", "solid", "double", "dashed"];
    let color = "#000";
    for (let index = 0; index < borderList.length; index++) {
      const item = borderList[index];
      if (styleList.indexOf(item) >= 0) {
        // 设置 style
        style = item;
      } else if (item.indexOf("rgb") == 0 || item.indexOf("#") == 0) {
        // 设置 color
        color = item;
      } else if (/[0-9]/.test(item)) {
        // 含有数字 设置为width
        widthList.push(clearNoNum(item));
      }
    }
    width = getBoxModelFillGap(widthList);
    return {
      style,
      color,
      width,
    };
  }
  /**
   * 获取计算属性数据，包括padding，margin，border；
   * Gets the computed property data, including the padding, margin, and border
   * @returns {padding,margin,border}
   */
  getComputedData() {
    let paddingInfo = getBoxModelFillGap(this.padding);
    let marginInfo = getBoxModelFillGap(this.margin);
    let boder = this.getBorder();
    // 填充计算属性
    return {
      padding: paddingInfo,
      margin: marginInfo,
      border: boder,
    };
  }
}
/**
 * The image EXIFINFO
 * 图片类型对象
 */
export class imgEXIFINFO extends EXIFINFO {
  constructor(id, value, parentNode) {
    super(id, "image", parentNode, value.content, value);
    if (value.mainImage) this.mainImage = true;
  }
  getSize(content = "", ctx, domcomentVue) {
    let that = this;
    return new Promise((res, req) => {
      // 创建对象
      uni.getImageInfo({
        src: content || that.content,
        success(img) {
          that.content = img.path;
          // that.tempContent = img.path
          console.log("getImageInfo,img", img);
          // 改变图片的src
          // img.src = content || this.content;
          let result = {
            width: 0,
            height: 0,
            contentWidth: 0,
            contentHeight: 0,
            originContentWidth: 0,
            originContentHeight: 0,
          };
          if (that.computedData.padding == {} || that.computedData.margin == {} || that.computedData.border == {}) {
            // 重新计算获得计算属性
            that.computedData = that.getComputedData();
          }
          // 获得盒子模型边缘额外宽度
          let boxHAndV = getComputedDataVerticalAndHorizontal(that.computedData);
          // 图片源数据宽高
          let imageWidth = img.width;
          let imageHeight = img.height;
          // 图片内容宽高
          let contentWidth = imageWidth;
          let contentHeight = imageHeight;
          // 该对象宽高
          let tempWidth = imageWidth;
          let tempHeight = imageHeight;

          // 设置为图片侧方向逻辑
          if (img.orientation === "left" || img.orientation === "right") {
            imageWidth = img.height;
            imageHeight = img.width;
            contentWidth = imageHeight;
            contentHeight = imageWidth;
            tempWidth = imageHeight;
            tempHeight = imageWidth;
          }
          // 以缩放
          let scaling;
          if (that.maxWidth !== "auto" && that.maxHeight === "auto") {
            tempWidth = that.maxWidth;
            contentWidth = tempWidth - boxHAndV.horizontal;
            scaling = Number(tools.div(imageWidth, contentWidth, 5));
            contentHeight = Number(tools.div(imageHeight, scaling, 5));
            tempHeight = contentHeight + boxHAndV.vertical;
          } else if (that.maxHeight !== "auto" && that.maxWidth === "auto") {
            tempHeight = that.maxHeight;
            contentHeight = tempHeight - boxHAndV.vertical;
            scaling = Number(tools.div(imageHeight, contentHeight, 5));
            contentWidth = Number(tools.div(imageWidth, scaling, 5));
            tempWidth = contentWidth + boxHAndV.horizontal;
          } else if (that.maxHeight !== "auto" && that.maxWidth !== "auto") {
            let hscaling = Number(tools.div(imageHeight, that.maxHeight, 5));
            let wscaling = Number(tools.div(imageWidth, that.maxWidth, 5));

            scaling = hscaling >= wscaling ? hscaling : wscaling;

            contentHeight = Number(tools.div(imageHeight, scaling, 5));
            contentWidth = Number(tools.div(imageWidth, scaling, 5));
            tempWidth = contentWidth + boxHAndV.horizontal;
            tempHeight = contentHeight + boxHAndV.vertical;
          }
          let isDownloader = getCoreVar("downloader");
          // 是主要图片
          if (that.mainImage && !isDownloader) {
            // 设置当前缩放比例
            setCoreValue("scaling", scaling);
          }
          // result.width = tempWidth + paddingInfo.left + paddingInfo.right + marginInfo.left + marginInfo.right + boder.width.left + boder.width.right
          // result.height = tempHeight + paddingInfo.top + paddingInfo.bottom + marginInfo.top + marginInfo.bottom + boder.width.top + boder.width.bottom;
          // result.contentWidth = tempWidth
          // result.contentHeight = tempHeight
          // 宽度为最大宽度
          result.width = tempWidth;
          result.height = tempHeight;
          result.contentWidth = contentWidth;
          result.contentHeight = contentHeight;
          result.originContentWidth = imageWidth;
          result.originContentHeight = imageHeight;
          // console.log("result", result);
          res(result);
        },
      });
    });
  }
}

/**
 * The text EXIFINFO
 * 文字类型对象
 */
export class textEXIFINFO extends EXIFINFO {
  constructor(id, value, parentNode, LIST_fontInfo) {
    // super(id, value.content, parentNode, "text");
    super(id, "text", parentNode, value.content, value, [], ["font"]);
    this.font = {
      fontSize: 12,
      color: "#000000ff",
      style: "",
      fontFamily: "normal",
      bold: false,
      textAlign: "left",
    };
    if (LIST_fontInfo) {
      const textDataDictionary = ["fontSize", "color", "style", "fontFamily", "bold", "textAlign"];
      for (const key in LIST_fontInfo) {
        if (Object.hasOwnProperty.call(LIST_fontInfo, key)) {
          const ObjValue = LIST_fontInfo[key];
          if (textDataDictionary.indexOf(key) >= 0) {
            this.font[key] = ObjValue;
          } else {
            this.customOption[key].font = ObjValue;
          }
        }
      }
    }
  }
  /**
   * 这个方法适用于获得在canvas中的文本规格。
   * This function is suitable for getting the text specification in canvas.
   * @params {String} text The text content
   * @params {Object} option The text style, Contains：Bold，fontSize，fontFamily
   * @returns {Object} Returns the new length of text width.
   */
  getSize(text, ctx, domcomentVue) {
    // let bold = this.font.bold;
    // let fontSize = this.font.fontSize || 12;
    // let fontFamily = this.font.fontFamily || "normal";
    let { bold, fontSize = 12, fontFamily = "normal", style } = this.font;

    if (this.computedData.padding == {} || this.computedData.margin == {} || this.computedData.border == {}) {
      // 重新计算获得计算属性
      this.computedData = this.getComputedData();
    }
    // 获得盒子模型边缘额外宽度
    let boxHAndV = getComputedDataVerticalAndHorizontal(this.computedData);

    var result = {
      width: 0,
      height: 0,
      contentWidth: 0,
      contentHeight: 0,
    };
    let width = 0;
    let height = 0;
    if (document) {
      var span = document.createElement("span");
      span.style.visibility = "hidden";
      span.style.display = "inline-block";
      span.style.fontSize = fontSize + "px"; //文字大小
      span.style.fontFamily = fontFamily; //字体

      document.body.appendChild(span);
      if (typeof span.textContent != "undefined") {
        span.textContent = text;
      } else {
        span.innerText = text;
      }
      width = window.getComputedStyle(span).width.replace(/[^\d.-]/g, "") * 1;
      height = window.getComputedStyle(span).height.replace(/[^\d.-]/g, "") * 1;
    } else {
      if (bold) {
        ctx.font = `bold ${fontSize}px ${fontFamily ? fontFamily : "sans-serif"} ${style}`;
      } else {
        ctx.font = `normal ${fontSize}px ${fontFamily ? fontFamily : "sans-serif"}  ${style}`;
      }
      width = ctx.measureText(text).width;
      height = (fontSize * 7) / 5; // 默认是行高为7/5的fontsize
    }
    result.width = width + boxHAndV.horizontal;
    result.height = height + boxHAndV.vertical;
    result.contentWidth = width;
    result.contentHeight = height;
    return result;
  }
}

/**
 * The block EXIFINFO
 * 默认类型对象
 */
export class blockEXIFLIST extends EXIFINFO {
  constructor(id, value, parentNode) {
    // super(id, value.content, parentNode, "default");
    super(id, "block", parentNode, value.content, value);
    // setEXIFINFO(value)
  }
  /**
   * 计算元素宽高
   * @param {*} childList 获得元素子元素列表
   * @returns
   */
  getSize(childList = [], ctx, domcomentVue) {
    if (this.computedData.padding == {} || this.computedData.margin == {} || this.computedData.border == {}) {
      // 重新计算获得计算属性
      this.computedData = this.getComputedData();
    }
    // 获得盒子模型边缘额外宽度
    let boxHAndV = getComputedDataVerticalAndHorizontal(this.computedData);
    // let paddingInfo = getBoxModelFillGap(this.padding);
    // let marginInfo = getBoxModelFillGap(this.margin);
    // 容量超出max-以真实容量计算
    var result = {
      width: "auto",
      height: "auto",
      contentWidth: "auto",
      contentHeight: "auto",
    };
    let calculationHeight = 0;
    let calculationWidth = 0;

    if (this.maxWidth !== "auto") {
      calculationWidth = this.maxWidth;
    }
    if (this.maxHeight !== "auto") {
      calculationHeight = this.maxHeight;
    }
    if (this.maxWidth == "auto" || this.maxHeight == "auto") {
      // 打断
      // if (calculationHeight == "auto" && calculationWidth == "auto") {
      //   // break;
      // }
      if (this.display === "flex") {
        // flex 布局 高度由子元素最高决定，宽度是所有子元素宽度累
        for (let index = 0; index < childList.length; index++) {
          const item = childList[index];
          // 打断
          if (calculationHeight == "auto" && calculationWidth == "auto") {
            break;
          }
          // 设置 width 宽度是所有子元素宽度累
          if (item.width === "auto") {
            calculationWidth = "auto";
          } else if (calculationWidth != "auto" && this.maxWidth === "auto") {
            calculationWidth += item.width * 1;
          }
          // 设置 heihgt 高度由子元素最高决定
          if (item.height > calculationHeight && calculationHeight != "auto" && this.maxHeight === "auto") {
            if (item.height === "auto") {
              calculationHeight = "auto";
              break;
            }
            calculationHeight = item.height * 1;
          }
        }
      } else {
        // block 布局 宽度由子元素最高决定，高度是所有子元素宽度累加
        for (let index = 0; index < childList.length; index++) {
          const item = childList[index];
          // 打断
          if (calculationHeight == "auto" && calculationWidth == "auto") {
            break;
          }
          if (item.level > 1110) console.log("child height", item.level, item.height, item.width, calculationWidth, calculationHeight);
          // 设置 height
          if (item.height == "auto") {
            calculationHeight = "auto";
          } else if (calculationHeight != "auto" && this.maxHeight === "auto") {
            calculationHeight += item.height * 1;
          }
          // 设置 width
          if (item.width > calculationWidth && calculationWidth != "auto" && this.maxHeight === "auto") {
            if (item.width === "auto") {
              calculationWidth = "auto";
              break;
            }
            calculationWidth = item.width * 1;
          }
          if (item.level > 1110) console.log("child height2", item.level, item.height, item.width, calculationWidth, calculationHeight);
        }
      }
    }
    let rsWidth = this.maxWidth !== "auto" ? this.maxWidth : calculationWidth;
    let rsHeight = this.maxHeight !== "auto" ? this.maxHeight : calculationHeight;
    // 设置内容高度
    result.width = rsWidth == "auto" ? "auto" : rsWidth;
    result.height = rsHeight == "auto" ? "auto" : rsHeight;
    result.contentWidth = calculationWidth - boxHAndV.horizontal;
    result.contentHeight = calculationHeight - boxHAndV.vertical;
    // console.log("block result");
    // console.log(result);
    return result;
  }
}
