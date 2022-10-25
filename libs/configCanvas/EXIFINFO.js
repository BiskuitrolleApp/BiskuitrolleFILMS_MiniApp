// config 中支持直接设置的数据
const dataDictionary = ['padding', 'border', 'margin', 'xAxisOffset', 'yAxisOffset', 'level', 'horizontal', 'vertical', 'width', 'height', 'customOption']
// 生成的数据 需要排斥外部自己定义
const dataDictionaryNotNeed = ['content', 'type', 'child', 'id', 'computedData']
import { clearNoNum } from './utils/number/index'

// exif 信息对象
class EXIFINFO {
  constructor(id, type, parentNode, content, value) {
    this.level = 0; // 层级
    this.parentNode = parentNode; // 父元素
    if (parentNode.id) {
      this.root = false;
    } else {
      this.root = true;
    }

    // 位置信息
    this.display = 'block'; // 显示类型 支持flex和block布局

    // 水平位置
    // left（默认值）：左对齐
    // rigth：右对齐
    // center： 居中
    // space-between：两端对齐，项目之间的间隔都相等。（用于flex有用）
    // space-around：每个项目两侧的间隔相等。（用于flex有用）
    this.horizontal = 'left';

    // 垂直位置
    // top（默认值）：顶对齐
    // buttom：底对齐
    // center： 居中
    this.vertical = 'top';

    // 实际宽高
    this.width = 0;
    this.height = 0;
    // 内容宽高
    this.contentWidth = 0;
    this.contentHeight = 0;

    this.padding = '0';
    this.margin = '0';
    this.border = '0px solid #000' // 支持 dotted solid double dashed

    // 计算属性
    this.computedData = {
      padding: {},
      margin: {},
      border: {},
    }

    this.customOption = {}; // 自定义信息

    // 实际位置x轴和y轴分布
    this.axisInfo = {
      x: 0,
      y: 0,
    }
    this.xAxisOffset = 0; // x偏移
    this.yAxisOffset = 0; // y偏移

    // 赋值默认信息
    for (const key in value) {
      if (Object.hasOwnProperty.call(value, key)) {
        const ObjValue = value[key];
        if (dataDictionary.indexOf(key) >= 0 && dataDictionaryNotNeed.indexOf(key) < 0) {
          this[key] = ObjValue
        } else if (dataDictionaryNotNeed.indexOf(key) < 0) {
          this.customOption[key] = ObjValue
        }
      }
    }
    this.id = id;
    this.content = content;
    this.type = type;
  }
  /**
   * 设置EXIFINFO的盒子模型信息后可以用这个方法来计算盒子模型信息的具体信息
   * After setting the box model information of exif info, this method can be used to calculate the specific information of the box model information
   * @params {String|Number|Array} boxModelData 传入计算的数值
   * @returns {Object} Returns the new object of padding.
   */
  getBoxModelFillGap(boxModelData = '0') {
    if (!boxModelData || boxModelData.length == 0) {
      throw "setting padding or margin data please!";
    }
    let gap = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
    try {
      let gapList = []
      if (typeof boxModelData == 'number') {
        gapList = [boxModelData]
      } else if (Array.isArray(boxModelData)) {
        gapList = boxModelData
      } else {
        gapList = boxModelData.split("");
      }
      if (gapList.length == 0) {
        throw "invalid padding or margin data!";
      }
      // 计算不同长度的 padding or margin的数据
      if (gapList.length == 1) {
        [gap.top, gap.right, gap.bottom, gap.left] = [gapList[0] * 1,
        gapList[0] * 1, gapList[0] * 1, gapList[0] * 1
        ];
      } else if (gapList.length == 2) {
        [gap.top, gap.right, gap.bottom, gap.left] = [gapList[0] * 1,
        gapList[1] * 1, gapList[0] * 1, gapList[1] * 1
        ];
      } else if (gapList.length == 3) {
        [gap.top, gap.right, gap.bottom, gap.left] = [gapList[0] * 1,
        gapList[1] * 1, gapList[3] * 1, gapList[1] * 1
        ];
      } else if (gapList.length >= 4) {
        [gap.top, gap.right, gap.bottom, gap.left] = [gapList[0] * 1,
        gapList[1] * 1, gapList[3] * 1, gapList[4] * 1
        ];
      }
    } catch (error) {
      throw error;
    }
    return gap;
  }
  // 获得border具体样式
  getBorder() {
    let borderList = this.border.split(' ');
    let width = 0;
    let widthList = []
    let style = 'solid'
    let styleList = ['dotted', 'solid', 'double', 'dashed']
    let color = '#000';
    for (let index = 0; index < borderList.length; index++) {
      const item = borderList[index];
      if (styleList.indexOf(item) >= 0) {
        // 设置 style
        style = item;
      } else if (item.indexOf('rgb') == 0 || item.indexOf('#') == 0) {
        // 设置 color
        color = item;
      } else if (/[0-9]/.test(item)) {
        // 含有数字 设置为width
        widthList.push(clearNoNum(item))
      }
    }
    width = this.getBoxModelFillGap(widthList)
    return {
      style,
      color,
      width
    }
  }
  /**
   * 获取EXIFINFO于x轴和y轴的位置信息
   * Get the position information of EXIFINFO on the x-axis and y-axis
   * @returns {Object} Returns the new object of position.
   */
  getPosition() {
    if (!this.xAxisOffset && this.xAxisOffset != 0) {
      throw "invalid xAxisOffset data!";
    }
    if (!this.yAxisOffset && this.yAxisOffset != 0) {
      throw "invalid yAxisOffset data!";
    }
    let axisInfo = {
      x: 0,
      y: 0,
    };
    // 保存父组件的位置
    if (this.parentNode && typeof this.parentNode.getPosition == 'function') {
      let sPositionX = this.root ? 0 : (this.parentNode.getPosition().x || 0) * 1
      let sPositionY = this.root ? 0 : (this.parentNode.getPosition().y || 0) * 1
      axisInfo.x += sPositionX;
      axisInfo.y += sPositionY
    }
    let paddingInfo = this.getBoxModelFillGap(this.padding)
    let marginInfo = this.getBoxModelFillGap(this.margin)
    // 加上自己偏移xAxisOffset,yAxisOffset和padding位置
    axisInfo.x += (this.xAxisOffset || 0) * 1 + (paddingInfo.left) * 1;
    axisInfo.y += (this.yAxisOffset || 0) * 1 + (paddingInfo.top) * 1;

    let parentNode_Width = this.root ? 0 : (this.parentNode.width || 0) * 1
    let parentNode_Height = this.root ? 0 : (this.parentNode.height || 0) * 1

    if (this.horizontal == 'center') {
      axisInfo.x += (parentNode_Width - this.width) / 2;
    } else if (this.horizontal == 'right') {
      axisInfo.x += (parentNode_Width - this.width);
    } else {
      axisInfo.x += 0;
    }
    if (this.vertical == 'center') {
      axisInfo.y += (parentNode_Height - this.height) / 2;
    } else if (this.vertical == 'bottom') {
      axisInfo.y += (parentNode_Height - this.height);
    } else {
      axisInfo.y += 0;
    }
    return axisInfo
  }
}
/**
 * The image EXIFINFO
 * 图片类型对象
 */
export class imgEXIFINFO extends EXIFINFO {
  constructor(id, value, parentNode) {
    super(id, "image", parentNode, value.content, value);
  }
  getSize(content = '') {
    // 创建对象
    let img = new Image();
    // 改变图片的src
    img.src = content || this.content;
    let result = {
      width: 0,
      height: 0,
      contentWidth: 0,
      contentHeight: 0
    };
    let paddingInfo = this.getBoxModelFillGap(this.padding)
    let marginInfo = this.getBoxModelFillGap(this.margin)
    let boder = this.getBorder();
    // 填充计算属性
    this.computedData = {
      padding: paddingInfo,
      margin: marginInfo,
      border: boder,
    }
    result.width = img.width + paddingInfo.left + paddingInfo.right + marginInfo.left + marginInfo.right + boder.width.left + boder.width.right
    result.height = img.height + paddingInfo.top + paddingInfo.bottom + marginInfo.top + marginInfo.bottom + boder.width.top + boder.width.bottom;
    result.contentWidth = img.width
    result.contentHeight = img.height
    return result
  }
};

/**
 * The text EXIFINFO
 * 文字类型对象
 */
export class textEXIFINFO extends EXIFINFO {
  constructor(id, value, parentNode, LIST_fontInfo) {
    // super(id, value.content, parentNode, "text");
    super(id, "text", parentNode, value.content, value);
    this.font = {
      fontSize: 12,
      color: '#ffffff',
      style: null,
      fontFamily: "normal",
      bold: false,
      textAlign: 'left'
    };
    if (LIST_fontInfo) {
      const textDataDictionary = ['fontSize', 'color', 'style', 'fontFamily', 'bold', 'textAlign']
      for (const key in LIST_fontInfo) {
        if (Object.hasOwnProperty.call(LIST_fontInfo, key)) {
          const ObjValue = LIST_fontInfo[key];
          if (textDataDictionary.indexOf(key) >= 0) {
            this.font[key] = ObjValue
          } else {
            this.customOption[key].font = ObjValue
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
  getSize(text) {
    var span = document.createElement("span");
    var result = {
      width: 0,
      height: 0,
      contentWidth: 0,
      contentHeight: 0
    };
    span.style.visibility = "hidden";
    span.style.display = "inline-block";

    let fontSize = (this.font.fontSize || 12) + 'px';
    let fontFamily = this.font.fontFamily || "normal";
    span.style.fontSize = fontSize;//文字大小
    span.style.fontFamily = fontFamily;//字体

    document.body.appendChild(span);
    if (typeof span.textContent != "undefined") {
      span.textContent = text;
    } else {
      span.innerText = text;
    }
    let paddingInfo = this.getBoxModelFillGap(this.padding)
    let marginInfo = this.getBoxModelFillGap(this.margin)
    let width = window.getComputedStyle(span).width.replace(/[^\d.-]/g, '') * 1
    let height = window.getComputedStyle(span).height.replace(/[^\d.-]/g, '') * 1
    //使用window.getComputedStyle方法获取
    let boder = this.getBorder();
    // 填充计算属性
    this.computedData = {
      padding: paddingInfo,
      margin: marginInfo,
      border: boder,
    }
    result.width = width + paddingInfo.left + paddingInfo.right + marginInfo.left + marginInfo.right + boder.width.left + boder.width.right
    result.height = height + paddingInfo.top + paddingInfo.bottom + marginInfo.top + marginInfo.bottom + boder.width.top + boder.width.bottom;
    result.contentWidth = width
    result.contentHeight = height
    return result;
  }
};

/**
 * The block EXIFINFO
 * 默认类型对象
 */
export class blockEXIFLIST extends EXIFINFO {
  constructor(id, value, parentNode) {
    // super(id, value.content, parentNode, "default");
    super(id, "block", parentNode, value.content, value);
    // setEXIFINFO(value)
    this.width = value.width || 'auto';
    this.height = value.height || 'auto';
  }
  /**
   * 计算元素宽高
   * @param {*} childList 获得元素子元素列表
   * @returns 
   */
  getSize(childList = []) {
    let paddingInfo = this.getBoxModelFillGap(this.padding)
    let marginInfo = this.getBoxModelFillGap(this.margin)
    var result = {
      width: 'auto',
      height: 'auto',
      contentWidth: 'auto',
      contentHeight: 'auto',
    };

    let maxHeight = 0
    let maxWidth = 0
    if (this.display === 'flex') {
      // flex 布局 高度由子元素最高决定，宽度是所有子元素宽度累
      for (let index = 0; index < childList.length; index++) {
        const item = childList[index];
        // 打断
        if (maxHeight == 'auto' && maxWidth == 'auto') {
          break;
        }
        // 设置 width
        if (item.width == 'auto') {
          maxWidth = 'auto'
        } else if (maxWidth != 'auto') {
          maxWidth += item.width * 1
        }
        // 设置 heihgt
        if (item.height > maxHeight && maxHeight != 'auto') {
          maxHeight = item.height * 1
        }
      }
    } else {
      // block 布局 宽度由子元素最高决定，高度是所有子元素宽度累加
      for (let index = 0; index < childList.length; index++) {
        const item = childList[index];
        // 打断
        if (maxHeight == 'auto' && maxWidth == 'auto') {
          break;
        }
        // 设置 height
        if (item.height == 'auto') {
          maxHeight = 'auto'
        } else if (maxHeight != 'auto') {
          maxHeight += item.height * 1
        }
        // 设置 width
        if (item.width > maxWidth && maxWidth != 'auto') {
          maxWidth = item.width * 1
        }
      }
    }
    let boder = this.getBorder();
    // 填充计算属性
    this.computedData = {
      padding: paddingInfo,
      margin: marginInfo,
      border: boder,
    }
    // 设置内容高度
    result.width = maxWidth === 'auto' ? 'auto' : maxWidth + paddingInfo.left + paddingInfo.right + marginInfo.left + marginInfo.right + boder.width.left + boder.width.right
    result.height = maxHeight === 'auto' ? 'auto' : maxHeight + paddingInfo.top + paddingInfo.bottom + marginInfo.top + marginInfo.bottom + boder.width.top + boder.width.bottom;
    result.contentWidth = maxWidth
    result.contentHeight = maxHeight
    return result
  }
}

