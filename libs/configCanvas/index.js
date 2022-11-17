import { imgEXIFINFO, textEXIFINFO, blockEXIFLIST } from "./EXIFINFO";

import { uuid2 } from "./utils/uuid";
import { orderBy, has } from "./utils/selfLodash";
import { canvasDrawMain } from "./canvas";
import { setCoreValue, getScaling } from "./var";

/**
 * 用于计算当前节点的uuid
 * @param {*} node 当前节点
 * @param {*} parentNode 父节点
 * @return {String} uuid
 */
const initUUID = function (node, parentNode) {
  let uuid = uuid2(10);
  let sourceId = parentNode.id || "";
  let sourceLevel = parentNode.level * 10 || 0;
  let id = node.id || `${node.type || "block"}_level_${node.level || 0 + sourceLevel}_uuid_${uuid}`;
  return id;
};

/**
 * 初始化节点列表等级
 * @param {*} nodeList 当前节点列表
 */
const initNodeListLevel = function (nodeList = [], level = 0) {
  for (let index = 0; index < nodeList.length; index++) {
    // const item = nodeList[index];
    nodeList[index].level = nodeList.level || level * 10 + index;
    if (nodeList[index].child && nodeList[index].child.length > 0) {
      nodeList[index].child = initNodeListLevel(nodeList[index].child, nodeList[index].level);
    }
  }
  return nodeList;
};

const initConfig = function (ctx, configData = [], parentNode = {}) {
  let tempConfig = configData;
  let newConfigObject = [];

  for (let index = 0; index < tempConfig.length; index++) {
    const configItem = tempConfig[index];
    let exifObj = {};
    if (configItem.type == "image") {
      // 初始化图片信息
      exifObj = initTypeImageObject(ctx, configItem, parentNode);
    } else if (configItem.type == "imageMain") {
      configItem.mainImage = true
      exifObj = initTypeImageObject(ctx, configItem, parentNode);
    } else if (configItem.type == "text") {
      // 初始化文字信息
      exifObj = initTypeTextObject(ctx, configItem, parentNode, configItem.font);
    } else {
      // 初始化块元素信息
      exifObj = initTypeBlockObject(ctx, configItem, parentNode);
    }
    newConfigObject.push(exifObj);
    // 当前有子项
    if (configItem.child) {
      let list = initConfig(ctx, configItem.child, exifObj);
      newConfigObject = [...newConfigObject, ...list];
    }
  }
  return newConfigObject;
};

/**
 * 初始化图片信息为为EXIF对象的信息
 * init image json content to imgEXIFINFO
 * @param {Object} value 需要初始化为EXIF对象的信息
 */
const initTypeImageObject = function (ctx, value = {}, parentNode = {}) {
  let id = initUUID(value, parentNode);
  // setting id type and conntent
  let exifObj = new imgEXIFINFO(id, value, parentNode);
  return exifObj;
};

/**
 * 初始化图片信息为为EXIF对象的信息
 * init text json content to textEXIFINFO
 * @param {Object} value 需要初始化为EXIF对象的信息
 */
const initTypeTextObject = function (ctx, value = {}, parentNode = {}, font = {}) {
  let id = initUUID(value, parentNode);
  // setting id type and conntent
  let exifObj = new textEXIFINFO(id, value, parentNode, font);
  // let specifications = exifObj.getSize(value.content)
  // exifObj.width = value.width || specifications.width || 0
  // exifObj.height = value.height || specifications.height || 0
  return exifObj;
};

/**
 * 初始化块元素信息为为EXIF对象的信息，用于布局，抽象类o'l类型
 * init block json content to textEXIFINFO
 * @param {Object} ctx canvas 元素
 * @param {Object} value 需要初始化为EXIF对象的信息
 * @param {*} parentNode 父节点
 */
const initTypeBlockObject = function (ctx, value = {}, parentNode = {}) {
  let id = initUUID(value, parentNode);
  // setting id type and conntent
  let exifObj = new blockEXIFLIST(id, value, parentNode);
  return exifObj;
};

let initLooptCount = 0;
// 重复校对宽高，从叶子到根进行校验
const initSize = async function (ctx, domcomentVue, nodeList = []) {
  let newList = nodeList;
  let hasAuto = false;
  initLooptCount++;
  // 倒序遍历
  for (let index = newList.length - 1; index >= 0; index--) {
    const item = newList[index];
    let specifications = {};
    if (item.type === "block") {
      let childList = [];

      // 获得当前元素的子元素
      for (let cindex = 0; cindex < newList.length; cindex++) {
        const cItem = newList[cindex];
        if (cItem.parentNode && cItem.parentNode.id && item.id === cItem.parentNode.id) {
          childList.push(cItem);
        }
        specifications = await item.getSize(childList, ctx, domcomentVue);
      }
    } else {
      specifications = await item.getSize(item.content, ctx, domcomentVue);
    }
    if (specifications.width === "auto" ||
      specifications.height === "auto" ||
      specifications.contentWidth === "auto" ||
      specifications.contentHeight === "auto") {
      hasAuto = true;
    }
    item.width = specifications.width || 0;
    item.height = specifications.height || 0;
    item.contentWidth = specifications.contentWidth || 0;
    item.contentHeight = specifications.contentHeight || 0;
    if (item.originContentWidth) item.originContentWidth = specifications.originContentWidth || 0;
    if (item.originContentHeight) item.originContentHeight = specifications.originContentHeight || 0;
  }
  // 重置一次再次计算，追多5次
  if (initLooptCount <= 5 && hasAuto) {
    newList = await initSize(newList);
  } else if (initLooptCount > 5) {
    throw "Init the size loop amomum 5 times";
  }
  return nodeList;
};

// 将node 列表转换为树
const listConvertTree = function (data = {}, nodeList = []) {
  let tempRoot = data;
  tempRoot.child = [];
  let tempNodeList = [];
  for (let lindex = 0; lindex < nodeList.length; lindex++) {
    const item = nodeList[lindex];
    if ((!tempRoot.root || !tempRoot.root.id) && item.root) {
      tempRoot.child.push({
        root: item,
        child: [],
      });
      continue;
    }
    if (item.parentNode && tempRoot.root && tempRoot.root.id === item.parentNode.id) {
      tempRoot.child.push({
        root: item,
        child: [],
      });
    } else {
      tempNodeList.push(item);
    }
  }
  for (let cindex = 0; cindex < tempRoot.child.length; cindex++) {
    if (tempNodeList.length == 0) {
      break;
    }
    let tempList = listConvertTree(tempRoot.child[cindex], tempNodeList);
    tempRoot.child[cindex] = tempList.root;
    tempNodeList = tempList.nodeList;
  }
  return {
    root: tempRoot,
    nodeList: tempNodeList,
  };
};

// 将node 树转换为列表
const treeConverList = function (tree = {}) {
  let list = [];
  if (tree.child && tree.child.length > 0) {
    for (let index = 0; index < tree.child.length; index++) {
      const item = tree.child[index];
      list.push(item.root);
      if (item.child && item.child.length > 0) {
        let cList = treeConverList(item);
        list = [...list, ...cList];
      }
    }
  }
  return list;
};

// 将node 树转换为列表
const getCanvasSize = function (tree = {}) {
  let maxWidth = 0;
  let maxHeight = 0;
  if (tree.child && tree.child.length) {
    for (let index = 0; index < tree.child.length; index++) {
      const item = tree.child[index];
      let width = item.root.axisInfo.x * 1 + item.root.width * 1;
      let height = item.root.axisInfo.y * 1 + item.root.height * 1;
      if (maxWidth < width) {
        maxWidth = width;
      }
      if (maxHeight < height) {
        maxHeight = height;
      }
    }
  }
  return {
    width: maxWidth,
    height: maxHeight,
  };
};

const initPositionCore = function (tree = {}) {
  let currentPosition = {
    x: 0,
    y: 0,
  };
  if (tree.root) {
    currentPosition.x = tree.root.axisInfo.x;
    currentPosition.y = tree.root.axisInfo.y;
  }
  if (tree.child && tree.child.length > 0) {
    // console.log(tree)
    let rootConfig = {
      display: tree.root?.display || "block",
      horizontal: tree.root?.horizontal || "left",
      vertical: tree.root?.vertical || "top",
      width: tree.root?.width || 0,
      height: tree.root?.height || 0,
      contentWidth: tree.root?.contentWidth || 0,
      contentHeight: tree.root?.contentHeight || 0,
    };

    // 间隔 第一个，中间所有，最后一个
    let gap = [0, 0, 0];
    // flex 布局需要计算间隔
    if (rootConfig.display === "flex" && tree.child.length > 0) {
      // 计算整个内容宽度
      let entireContentWidth = 0;
      for (let index = 0; index < tree.child.length; index++) {
        const item = tree.child[index];
        // flex 布局
        if (item.root && item.root.width) {
          entireContentWidth += item.root.width * 1;
        }
      }
      // 计算整个间隔
      if (rootConfig.horizontal === "right") {
        // 居右
        gap[0] = rootConfig.contentWidth * 1 - entireContentWidth;
        gap[1] = 0;
        gap[2] = 0;
      } else if (rootConfig.horizontal === "center") {
        // 中间
        gap[0] = (rootConfig.contentWidth * 1 - entireContentWidth) / 2;
        gap[1] = 0;
        gap[2] = (rootConfig.contentWidth * 1 - entireContentWidth) / 2;
      } else if (rootConfig.horizontal === "space-between") {
        // 两端对齐，项目之间的间隔都相等。
        gap[0] = 0;
        gap[2] = 0;
        if (tree.child.length <= 1) {
          gap[1] = rootConfig.contentWidth * 1 - entireContentWidth;
        } else {
          gap[1] = (rootConfig.contentWidth * 1 - entireContentWidth) / (tree.child.length - 1);
        }
      } else if (rootConfig.horizontal === "space-around") {
        let gapItem = (rootConfig.contentWidth * 1 - entireContentWidth) / (tree.child.length * 2);
        // 每个项目两侧的间隔相等。
        gap[0] = gapItem;
        gap[1] = 2 * gapItem;
        gap[2] = gapItem;
      } else {
        // 居左
        gap[0] = 0;
        gap[1] = 0;
        gap[2] = rootConfig.contentWidth * 1 - entireContentWidth;
      }
    } else {
      // 计算整个内容高度
      let entireContentHeight = 0;
      for (let index = 0; index < tree.child.length; index++) {
        const item = tree.child[index];
        // flex 布局
        if (item.height) {
          entireContentHeight += item.height * 1;
        }
      }

      // 垂直对齐
      if (rootConfig.vertical === "center") {
        gap[0] = (rootConfig.contentHeight * 1 - entireContentHeight) / 2;
        gap[1] = 0;
        gap[2] = (rootConfig.contentHeight * 1 - entireContentHeight) / 2;
      } else if (rootConfig.vertical === "bottom") {
        gap[0] = rootConfig.contentHeight * 1 - entireContentHeight;
        gap[1] = 0;
        gap[2] = 0;
      } else {
        gap[0] = 0;
        gap[1] = 0;
        gap[2] = rootConfig.contentHeight * 1 - entireContentHeight;
      }
    }
    // 解决相减少于 0
    for (let index = 0; index < gap.length; index++) {
      const item = gap[index];
      if (item <= 0) {
        gap[index] = 0
      }
    }
    // 利用间隔填充布局
    for (let index = 0; index < tree.child.length; index++) {
      //  布局 - flex布局
      if (rootConfig.display === "flex") {
        if (index == 0) {
          currentPosition.x += gap[0];
        } else {
          currentPosition.x += gap[1];
        }
        // 水平对齐
        tree.child[index].root.axisInfo.x = currentPosition.x;
        // 偏移width位置
        currentPosition.x += tree.child[index].root.width;

        // 添加间隔
        // if (index == 0) {
        //   currentPosition.x += gap[0]
        // } else if (index == tree.child.length - 1) {
        //   currentPosition.x += gap[2]
        // } else {
        //   currentPosition.x += gap[1]
        // }
        // 垂直对齐
        if (rootConfig.vertical === "center") {
          tree.child[index].root.axisInfo.y = (rootConfig.height * 1 - tree.child[index].root.height * 1) / 2 + currentPosition.y;
        } else if (rootConfig.vertical === "bottom") {
          tree.child[index].root.axisInfo.y = rootConfig.height * 1 - tree.child[index].root.height * 1 + currentPosition.y;
        } else {
          tree.child[index].root.axisInfo.y = currentPosition.y;
        }
        // text exif textalign is right
        // if (has(tree.child[index], 'root.type') &&
        //   has(tree.child[index], 'root.font.textAlign') &&
        //   tree.child[index].root.type === 'text' &&
        //   tree.child[index].root.font.textAlign == 'right') {
        //   tree.child[index].root.font.textAlign = 'left'
        // }
      } else if ((tree.root && tree.root.display == "block") || !tree.root) {
        // 布局 - 普通布局
        // 水平对齐
        if (rootConfig.horizontal === "center") {
          tree.child[index].root.axisInfo.x = (rootConfig.width * 1 - tree.child[index].root.width * 1) / 2 + currentPosition.x;
        } else if (rootConfig.vertical === "right") {
          tree.child[index].root.axisInfo.x = rootConfig.width * 1 - tree.child[index].root.width * 1 + currentPosition.x;
        } else {
          tree.child[index].root.axisInfo.x = currentPosition.x;
        }

        tree.child[index].root.axisInfo.y = currentPosition.y;
        currentPosition.y += tree.child[index].root.height;

        // 添加间隔
        // if (index == 0) {
        //   currentPosition.y += gap[0]
        // }else if (index == tree.child.length - 1) {
        //   currentPosition.y += gap[2]
        // } else {
        //   currentPosition.y += gap[1]
        // }
        if (index == 0) {
          currentPosition.y += gap[0];
        } else {
          currentPosition.y += gap[1];
        }

        // text exif textalign is right
        if (has(tree.child[index], 'root.type') &&
          has(tree.child[index], 'root.font.textAlign') &&
          tree.child[index].root.type === 'text' &&
          tree.child[index].root.font.textAlign == 'right') {
          tree.child[index].root.axisInfo.x =
            tree.root.axisInfo.x + tree.root.contentWidth -
            tree.child[index].root.width +
            tree.child[index].root.computedData.padding.left + tree.child[index].root.computedData.margin.left
        }
      }

      // 加上padding和margin
      tree.child[index].root.axisInfo.x +=
        tree.child[index].root.computedData.padding.left +
        tree.child[index].root.computedData.margin.left +
        tree.child[index].root.computedData.border.width.left;
      tree.child[index].root.axisInfo.y +=
        tree.child[index].root.computedData.padding.top +
        tree.child[index].root.computedData.margin.top +
        tree.child[index].root.computedData.border.width.top;

      if (tree.child[index].child && tree.child[index].child.length > 0) {
        tree.child[index] = initPositionCore(tree.child[index]);
      }
    }
  }
  return tree;
};

// 重复校对位置信息，从根到叶子进行校验
const initPosition = function (nodeList = []) {
  let newList = nodeList;
  let hasAuto = false;
  initLooptCount++;
  // 构建树
  let nodeListTree = listConvertTree({}, nodeList).root;
  // console.log('nodeListTree', nodeListTree)
  // 获得position信息的核心方法
  nodeListTree = initPositionCore(nodeListTree);
  // 获得canvas 宽高
  // let canvasSize = getCanvasSize(nodeListTree)
  // 转换树列表
  newList = treeConverList(nodeListTree);
  // 排序
  newList = orderBy(newList, ["level"], "asc").results;
  // console.log('nodeListTree end ', newList)
  return newList;
};

// 初始化页面需要设置的option
const setOptions = function (options = {}) {
  if (options.downloader) {
    setCoreValue('downloader', true) // 设置当前渲染是下载器渲染 
  }
}

// 渲染canvas时候需要设置的option
const setOptionsBeforeDraw = function (options = {}) {
  // if (options.downloader) {
  //   setCoreValue('downloader', true) // 设置当前渲染是下载器渲染 
  // }
}

// TODO 使用config 预加载一个格式
// TODO 添加元素到ObjectList中，使用默认排序
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
  // 校对宽高度 逆level进行
  initLooptCount = 0; // 嵌套初始化宽高次数
  canvasConfig = await initSize(ctx, domcomentVue, canvasConfig);
  // 校对组件处于的位置信息 position 顺level进行 ，对元素占位和居中等定位进行计算
  initLooptCount = 0; // 嵌套初始化次数
  canvasConfig = initPosition(canvasConfig);
  // 返回 输出整理好的位置的和具体逻辑的信息
  return canvasConfig;
};

// 提供EXIF列表到渲染到canvas
// 不同的页面进行不同的渲染操作
// 重新绘制 
export const EXIFRedraw = function (ctx, domcomentVue, canvasConfig = [], option = {}, callback) {
  setOptionsBeforeDraw(option);
  console.log("drawInfo", canvasConfig);
  for (let index = 0; index < canvasConfig.length; index++) {
    const item = canvasConfig[index];
    if (item.root) {
      let scaling = getScaling();
      console.log('scaling', scaling)
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
  setOptions(option);
  // 初始化等级
  let configData = initNodeListLevel(nodeList, 0);
  // 初始化为EXIFINFO对象数据
  let canvasConfig = initConfig(ctx, configData, {});
  // 计算间隔该元素的数据的间隔和位置
  canvasConfig = await EXIFReload(ctx, domcomentVue, canvasConfig);
  domcomentVue.setCanvasConfigList(canvasConfig)
  // 渲染列表操作
  EXIFRedraw(ctx, domcomentVue, canvasConfig, option = {}, callback);
};
