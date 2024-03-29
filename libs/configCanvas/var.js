// 固定存在和使用的的变量信息
let varValue = {
  scaling: 1, // 当前缩放比例
  downloader: false, // 当前使用的是否为下载器
};

// 获得缩放比例方法
export const getCoreVar = function (key = "") {
  if (Object.hasOwnProperty.call(varValue, key)) {
    return varValue[key];
  } else {
    console.error("getCoreVarError:can not find key: [" + key + "] value");
    return "";
  }
};

// 设置缩放比例方法
export const setCoreValue = function (key, value = 1) {
  if (Object.hasOwnProperty.call(varValue, key)) {
    varValue[key] = value;
  } else {
    console.error("setCoreValueError:can not find key: [" + key + "] value");
  }
};

// 获得缩放比例
export const getScaling = function () {
  let isDownloader = getCoreVar("downloader");
  if (isDownloader) {
    let scaling = getCoreVar("scaling") || 1;
    return scaling * 1;
  } else {
    return 1;
  }
};

// config 中支持直接设置的数据
export const dataDictionary = ["background", "padding", "border", "round", "margin", "xAxisOffset", "yAxisOffset", "level", "horizontal", "vertical", "width", "height", "maxHeight", "maxWidth", "customOption", "display"];
// 生成的数据 需要排斥外部自己定义
export const dataDictionaryNotNeed = ["content", "type", "child", "id", "computedData", "mainImage", "originSpecification"];
