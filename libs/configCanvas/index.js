import { orderBy } from "./utils/selfLodash";
import core from './Core'
import { canvasDrawMain } from "./canvas";
import { getScaling, dataDictionary } from "./var";

// TODO 实现redraw方法 只重新渲染页面图片 无视页面间隔和排序
// TODO 实现reLoad方法，重新按照该页面数据进行重新计算间隔
// TODO 提供一键优化调用实现reLoad方法进行页面重排序

// 生命周期
// 进入页面 - 调用reLoad渲染默认结构
// 修改页面信息 - 调用redraw渲染页面信息 无需重计算结构
// 优化 - 调用reLoad渲染页面信息，重排结构
// 调整元素x轴和y轴 - 调用redraw渲染页面信息 无需重计算结构
// 下载 下载元素

// 重新加载和重新计算 重新按照该页面数据进行重新计算间隔
export const EXIFReload = async function (ctx, domcomentVue, canvasConfig = []) {
  // 按照level重新从小到大排序
  canvasConfig = orderBy(canvasConfig, ["level"], "asc").results;
  // 计算各个信息的size大小
  canvasConfig = await core.initSize(ctx, domcomentVue, canvasConfig);
  canvasConfig = core.initPosition(canvasConfig);
  // 返回 输出整理好的位置的和具体逻辑的信息
  return canvasConfig;
};

// 提供EXIF列表到渲染到canvas
// 不同的页面进行不同的渲染操作
// 重新绘制 
export const EXIFRedraw = function (ctx, domcomentVue, canvasConfig = [], option = {}, callback) {
  core.setOptionsBeforeDraw(option);
  console.log("drawInfo", canvasConfig);
  for (let index = 0; index < canvasConfig.length; index++) {
    const item = canvasConfig[index];
    if (item.root) {
      let scaling = getScaling();
      ctx.width = item.width * scaling;
      ctx.height = item.height * scaling
      ctx.clearRect(0, 0, item.width * scaling, item.width * scaling);
    }
    canvasDrawMain(ctx, domcomentVue, item);
  }
  console.log('EXIFRedraw for end', ctx)
  ctx.draw(false, callback);
};

/**
 * The export method of json drawing canvas
 * Json绘制canvas的出口方法
 * @param {*} ctx canvas object
 * @param {*} domcomentVue vue object
 * @param {*} nodeList output config
 * @param {*} callback callback function
 */
export const EXIFDrawJSON = async function (ctx, domcomentVue, nodeList = [], option = {}, callback) {
  console.log('=============初始化配置信息=============')
  core.setOptions(option);
  // 初始化等级
  let configData = core.initNodeListLevel(nodeList, 0);
  // 初始化为EXIFINFO对象数据
  let canvasConfig = core.initConfig(ctx, configData, {});
  // 计算间隔该元素的数据的间隔和位置
  canvasConfig = await EXIFReload(ctx, domcomentVue, canvasConfig);
  domcomentVue.setCanvasConfigList(canvasConfig)
  console.log('=============开始绘制=============')
  // 渲染列表操作
  EXIFRedraw(ctx, domcomentVue, canvasConfig, option = {}, callback);
};

// 获得基础信息
const getConfigBaseInfo = function (baseInfo = {}) {
  let basicInformation = {
    content: '',
  };
  // 批量设置数据，去掉配置项不需要的
  let notNeet = ['customOption'];
  let cDataDictionary = dataDictionary.filter((item) => notNeet.indexOf(item) < 0)
  // 赋值默认信息
  for (const key in baseInfo) {
    if (Object.hasOwnProperty.call(baseInfo, key)) {
      const ObjValue = baseInfo[key];
      if (cDataDictionary.indexOf(key) >= 0) {
        basicInformation[key] = ObjValue
      }
    }
  }
  // 设置配置自定义的数据
  basicInformation = Object.assign(basicInformation, baseInfo.customOption);

  console.log('basicInformation', basicInformation)
  return basicInformation
}

// 加工每一个配置成为一项config
const getConfigList = function (baseInfo = {}, childList = []) {
  let itemConfig = {};
  let info = getConfigBaseInfo(baseInfo);
  // 获得基础信息
  itemConfig = { ...itemConfig, ...info }
  if (childList.length > 0) {
    let currentList = [];
    for (let index = 0; index < childList.length; index++) {
      const item = childList[index];
      let configItem = getConfigList(item.root, item.child);
      currentList.push(configItem);
    }
    if (currentList.length > 0)
      itemConfig.child = currentList;
  }
  return itemConfig;
}


// TODO 逆向生成config
// 使用EXIFINFO 逆向生成config
export const generateConfiguration = function (EXIFINFO = []) {
  let configuration = [];
  let nodeListTreeList = core.listConvertTree({}, EXIFINFO).root;
  let generatelist = getConfigList({}, nodeListTreeList.child)
  configuration = generatelist.child;
  console.log('configuration', configuration)
  return configuration
}
