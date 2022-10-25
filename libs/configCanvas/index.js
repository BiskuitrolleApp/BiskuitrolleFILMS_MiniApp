import { imgEXIFINFO, textEXIFINFO, blockEXIFLIST } from './EXIFINFO';

import { uuid2 } from './utils/uuid'
import { orderBy } from './utils/selfLodash'

/**
 * 用于计算当前节点的uuid
 * @param {*} node 当前节点
 * @param {*} parentNode 父节点
 * @return {String} uuid
 */
const initUUID = function (node, parentNode) {
  let uuid = uuid2(10);
  let sourceId = parentNode.id || '';
  let sourceLevel = parentNode.level * 10 || 0;
  let id = node.id || `${node.type || 'block'}_level_${node.level || 0 + sourceLevel}_uuid_${uuid}`;
  return id
}

/**
 * 初始化节点列表等级
 * @param {*} nodeList 当前节点列表
 */
const initNodeListLevel = function (nodeList = [], level = 0) {
  for (let index = 0; index < nodeList.length; index++) {
    // const item = nodeList[index];
    nodeList[index].level = nodeList.level || level * 10 + index;
    if (nodeList[index].child && nodeList[index].child.length > 0) {
      nodeList[index].child = initNodeListLevel(nodeList[index].child, nodeList[index].level)
    }
  }
  return nodeList
}

const initConfig = function (cxt, configData = [], parentNode = {}) {
  let tempConfig = configData;
  let newConfigObject = [];

  for (let index = 0; index < tempConfig.length; index++) {
    const configItem = tempConfig[index];
    let exifObj = {}
    if (configItem.type == 'image') {
      // 初始化图片信息
      exifObj = initTypeImageObject(cxt, configItem, parentNode)
    } else if (configItem.type == 'text') {
      // 初始化文字信息
      exifObj = initTypeTextObject(cxt, configItem, parentNode, configItem.font)
    } else {
      // 初始化块元素信息
      exifObj = initTypeBlockObject(cxt, configItem, parentNode)
    }
    newConfigObject.push(exifObj)
    // 当前有子项
    if (configItem.child) {
      let list = initConfig(cxt, configItem.child, exifObj)
      newConfigObject = [...newConfigObject, ...list]
    }

  }
  return newConfigObject
}

/**
 * 初始化图片信息为为EXIF对象的信息
 * init image json content to imgEXIFINFO
 * @param {Object} value 需要初始化为EXIF对象的信息
 */
const initTypeImageObject = function (cxt, value = {}, parentNode = {}) {
  let id = initUUID(value, parentNode)
  // setting id type and conntent
  let exifObj = new imgEXIFINFO(id, value, parentNode);
  return exifObj
}


/**
 * 初始化图片信息为为EXIF对象的信息
 * init text json content to textEXIFINFO
 * @param {Object} value 需要初始化为EXIF对象的信息
 */
const initTypeTextObject = function (cxt, value = {}, parentNode = {}, font = {}) {
  let id = initUUID(value, parentNode)
  // setting id type and conntent
  let exifObj = new textEXIFINFO(id, value, parentNode, font);
  // let specifications = exifObj.getSize(value.content)
  // exifObj.width = value.width || specifications.width || 0
  // exifObj.height = value.height || specifications.height || 0
  return exifObj
}

/**
 * 初始化块元素信息为为EXIF对象的信息，用于布局，抽象类o'l类型
 * init block json content to textEXIFINFO
 * @param {Object} cxt canvas 元素
 * @param {Object} value 需要初始化为EXIF对象的信息
 * @param {*} parentNode 父节点
 */
const initTypeBlockObject = function (cxt, value = {}, parentNode = {}) {
  let id = initUUID(value, parentNode)
  // setting id type and conntent
  let exifObj = new blockEXIFLIST(id, value, parentNode);
  return exifObj
}

let initLooptCount = 0;
// 重复校对宽高，从叶子到根进行校验
const initSize = function (nodeList = []) {
  let newList = nodeList;
  let hasAuto = false
  initLooptCount++;
  // 倒序遍历
  for (let index = newList.length - 1; index >= 0; index--) {
    const item = newList[index];
    let specifications = {}
    if (item.type === 'block') {
      let childList = [];

      // 获得当前元素的子元素
      for (let cindex = 0; cindex < newList.length; cindex++) {
        const cItem = newList[cindex];
        if (cItem.parentNode && cItem.parentNode.id && item.id === cItem.parentNode.id) {
          childList.push(cItem)
        }
        specifications = item.getSize(childList)
      }
    } else {
      specifications = item.getSize(item.content)
    }
    if (specifications.width === 'auto' || specifications.height === 'auto' || specifications.contentWidth === 'auto' || specifications.contentHeight === 'auto') {
      hasAuto = true
    }
    item.width = specifications.width || 0
    item.height = specifications.height || 0
    item.contentWidth = specifications.contentWidth || 0
    item.contentHeight = specifications.contentHeight || 0
  }
  // 重置一次再次计算，追多5次
  if (initLooptCount <= 5 && hasAuto) {
    newList = initSize(newList);
  } else if (initLooptCount > 5) {
    throw 'Init the size loop amomum 5 times'
  }
  return nodeList
}

// 将node 列表转换为树
const listConvertTree = function (data = {}, nodeList = []) {
  let tempRoot = data
  tempRoot.child = [];
  let tempNodeList = []
  for (let lindex = 0; lindex < nodeList.length; lindex++) {
    const item = nodeList[lindex];
    if ((!tempRoot.root || !tempRoot.root.id) && item.root) {
      tempRoot.child.push({
        root: item,
        child: []
      })
      continue;
    }
    if (item.parentNode && tempRoot.root && tempRoot.root.id === item.parentNode.id) {
      tempRoot.child.push({
        root: item,
        child: []
      })
    } else {
      tempNodeList.push(item)
    }
  }
  for (let cindex = 0; cindex < tempRoot.child.length; cindex++) {
    if (tempNodeList.length == 0) {
      break;
    }
    let tempList = listConvertTree(tempRoot.child[cindex], tempNodeList);
    tempRoot.child[cindex] = tempList.root;
    tempNodeList = tempList.nodeList
  }
  return {
    root: tempRoot,
    nodeList: tempNodeList
  }
}

// 将node 树转换为列表
const treeConverList = function (tree = {}) {
  let list = [];
  if (tree.child && tree.child.length > 0) {
    for (let index = 0; index < tree.child.length; index++) {
      const item = tree.child[index];
      list.push(item.root);
      if (item.child && item.child.length > 0) {
        let cList = treeConverList(item)
        list = [...list, ...cList]
      }
    }
  }
  return list
}


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
        maxWidth = width
      }
      if (maxHeight < height) {
        maxHeight = height
      }
    }
  }
  return {
    width: maxWidth,
    height: maxHeight,
  }
}

const initPositionCore = function (tree = {}) {
  let currentPosition = {
    x: 0,
    y: 0,
  }
  if (tree.root) {
    currentPosition.x = tree.root.axisInfo.x
    currentPosition.y = tree.root.axisInfo.y
  }
  if (tree.child && tree.child.length > 0) {
    console.log(tree)
    let rootConfig = {
      display: tree.root?.display || 'block',
      horizontal: tree.roo?.horizontal || 'left',
      vertical: tree.root?.vertical || 'top',
      width: tree.root?.width || 0,
      height: tree.root?.height || 0,
    }

    // 间隔 第一个，中间所有，最后一个
    let gap = [0, 0, 0]
    // flex 布局需要计算间隔
    if (rootConfig.display === 'flex' && tree.child.length > 0) {
      // 计算整个内容宽度
      let entireContentWidth = 0;
      for (let index = 0; index < tree.child.length; index++) {
        const item = tree.child[index];
        // flex 布局
        if (item.width) {
          entireContentWidth += item.width * 1
        }
      }
      // 计算整个间隔
      if (rootConfig.horizontal === 'right') {
        // 居右
        gap[0] = rootConfig.width * 1 - entireContentWidth;
        gap[1] = 0;
        gap[2] = 0;
      } else if (rootConfig.horizontal === 'center') {
        // 居右
        gap[0] = (rootConfig.width * 1 - entireContentWidth) / 2;
        gap[1] = 0;
        gap[2] = (rootConfig.width * 1 - entireContentWidth) / 2;
      } else if (rootConfig.horizontal === 'space-between') {
        // 两端对齐，项目之间的间隔都相等。
        gap[0] = 0;
        gap[2] = 0;
        if (tree.child.length <= 1) {
          gap[1] = (rootConfig.width * 1 - entireContentWidth);
        } else {
          gap[1] = (rootConfig.width * 1 - entireContentWidth) / (tree.child.length - 1)
        }
      } else if (rootConfig.horizontal === 'space-around') {
        let gapItem = (rootConfig.width * 1 - entireContentWidth) / (tree.child.length * 2)
        // 每个项目两侧的间隔相等。
        gap[0] = gapItem;
        gap[1] = 2 * gapItem;
        gap[2] = gapItem;
      } else {
        // 居左
        gap[0] = 0;
        gap[1] = 0;
        gap[2] = rootConfig.width * 1 - entireContentWidth;
      }
    } else {
      // 计算整个内容高度
      let entireContentHeight = 0;
      for (let index = 0; index < tree.child.length; index++) {
        const item = tree.child[index];
        // flex 布局
        if (item.height) {
          entireContentHeight += item.height * 1
        }
      }

      // 垂直对齐
      if (rootConfig.vertical === 'center') {
        gap[0] = (rootConfig.height * 1 - entireContentHeight) / 2
        gap[1] = 0
        gap[2] = (rootConfig.height * 1 - entireContentHeight) / 2
      } else if (rootConfig.vertical === 'bottom') {
        gap[0] = rootConfig.height * 1 - entireContentHeight
        gap[1] = 0
        gap[2] = 0
      } else {
        gap[0] = 0
        gap[1] = 0
        gap[2] = rootConfig.height * 1 - entireContentHeight
      }
    }

    // 利用间隔填充布局
    for (let index = 0; index < tree.child.length; index++) {
      //  布局 - flex布局
      if (rootConfig.display === 'flex') {
        // 水平对齐
        tree.child[index].root.axisInfo.x = currentPosition.x;
        // 偏移width位置
        currentPosition.x += tree.child[index].root.width

        // 垂直对齐
        if (rootConfig.vertical === 'center') {
          tree.child[index].root.axisInfo.y = (rootConfig.height * 1 - tree.child[index].root.height * 1) / 2 + currentPosition.y
        } else if (rootConfig.vertical === 'bottom') {
          tree.child[index].root.axisInfo.y = rootConfig.height * 1 - tree.child[index].root.height * 1 + currentPosition.y
        } else {
          tree.child[index].root.axisInfo.y = currentPosition.y
        }

        // 添加间隔
        if (index == 0) {
          currentPosition.x += gap[0]
        } else if (index == tree.child.length - 1) {
          currentPosition.x += gap[2]
        } else {
          currentPosition.x += gap[1]
        }
      } else if ((tree.root && tree.root.display == 'block') || !tree.root) {
        // 布局 - 普通布局
        // 水平对齐
        if (rootConfig.horizontal === 'center') {
          tree.child[index].root.axisInfo.x = (rootConfig.width * 1 - tree.child[index].root.width * 1) / 2 + currentPosition.x
        } else if (rootConfig.vertical === 'right') {
          tree.child[index].root.axisInfo.x = rootConfig.width * 1 - tree.child[index].root.width * 1 + currentPosition.x
        } else {
          tree.child[index].root.axisInfo.x = currentPosition.x
        }

        tree.child[index].root.axisInfo.y = currentPosition.y;
        currentPosition.y += tree.child[index].root.height

        // 添加间隔
        if (index == 0) {
          currentPosition.y += gap[0]
        } else if (index == tree.child.length - 1) {
          currentPosition.y += gap[2]
        } else {
          currentPosition.y += gap[1]
        }
      }
      if (tree.child[index].child && tree.child[index].child.length > 0) {
        tree.child[index] = initPositionCore(tree.child[index])
      }
    }
  }
  return tree
}

// 重复校对位置信息，从根到叶子进行校验
const initPosition = function (nodeList = []) {
  let newList = nodeList;
  let hasAuto = false
  initLooptCount++;
  // 构建树
  let nodeListTree = listConvertTree({}, nodeList).root
  console.log('nodeListTree', nodeListTree)
  // 获得position信息的核心方法
  nodeListTree = initPositionCore(nodeListTree)
  // 获得canvas 宽高
  // let canvasSize = getCanvasSize(nodeListTree)
  // 转换树列表
  newList = treeConverList(nodeListTree)
  // 排序
  newList = orderBy(newList, ['level'], 'asc').results
  console.log('nodeListTree end ', newList)
  return newList
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



// 重新按照该页面数据进行重新计算间隔
const EXIFReload = function (canvasConfig = []) {
  // 按照level重新从小到大排序
  canvasConfig = orderBy(canvasConfig, ['level'], 'asc').results
  // 校对宽高度 逆level进行
  initLooptCount = 0; // 嵌套初始化宽高次数
  canvasConfig = initSize(canvasConfig);
  // 校对组件处于的位置信息 position 顺level进行 ，对元素占位和居中等定位进行计算
  initLooptCount = 0; // 嵌套初始化次数
  canvasConfig = initPosition(canvasConfig);
  console.log('canvasConfig', canvasConfig)
  // 返回 输出整理好的位置的和具体逻辑的信息
  return canvasConfig
}

// 提供EXIF列表到渲染到canvas
// 不同的页面进行不同的渲染操作
//
const EXIFRedraw = function (cxt, canvasConfig = []) {
  for (let index = 0; index < array.length; index++) {
    const item = array[index];

  }
}

/**
 * The export method of json drawing canvas
 * Json绘制canvas的出口方法
 * @param {*} cxt canvas object
 * @param {*} nodeList output config 
 */
const EXIFDrawJSON = function (cxt, nodeList = [], parentNode = {}) {
  // 初始化等级
  let configData = initNodeListLevel(nodeList, 0);
  // 初始化为EXIFINFO对象数据
  let canvasConfig = initConfig(cxt, configData, parentNode)
  // 计算间隔该元素的数据的间隔和位置
  canvasConfig = EXIFReload(canvasConfig);
  // 渲染列表操作
  EXIFRedraw(cxt, canvasConfig)
}




export default EXIFDrawJSON
