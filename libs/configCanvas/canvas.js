import { getScaling } from "./Core";
/**
 * 绘制圆角矩形
 * @param {*} ctx canvas object
 * @param {*} border border object
 * @param {*} xAxis 开始点x轴
 * @param {*} yxAxis 开始点y轴
 * @param {*} width 矩形宽
 * @param {*} height 矩形高
 * @param {*} round 矩形圆角矩形的半径
 * @returns
 */

const roundRect = function (ctx, border, xAxis, yxAxis, width, height, round) {
  let scaling = getScaling()
  let r = Number(round) || 0;
  let w = Number(width) || 0;
  let h = Number(height) || 0;
  let x = Number(xAxis) || 0;
  let y = Number(yxAxis) || 0;
  if (w < 2 * r) {
    r = w / 2;
  }
  if (h < 2 * r) {
    r = h / 2;
  }
  // ctx.moveTo(x + r, y);
  // cxt.lineWidth = border.style;
  // TODO 线的类型，点或者实线
  ctx.strokeStyle = border.color;
  // border 根据线的宽度配置选择是否绘制上下左右
  // 对应角的相对坐标
  //  (x,y)(x+r,y) ----------- (x+w-r,y)(x+w,y)
  //  (x,y+r)                         (x+w,y+r)
  //  |                                       |
  //  |                                       |
  //  |                                       |
  //  |                                       |
  //  (x,y+h-r)                     (x+w,y+h-r)
  //  (x,y+h)(x+r,y+h)-----(x+w-r,y+h)(x+w,y+h)
  let borderInfoList = [
    {
      type: "angle",
      name: "left-top",
      x1: x,
      y1: y,
      x2: x + r,
      y2: y,
      r: r,
      moveX: x,
      moveY: y + r,
      lineWidth: 0,
    },
    {
      type: "line",
      name: "top",
      x1: x + w - r,
      y1: y,
      moveX: x + r,
      moveY: y,
      lineWidth: 0,
    },
    {
      type: "angle",
      name: "right-top",
      x1: x + w,
      y1: y,
      x2: x + w,
      y2: y + r,
      r: r,
      moveX: x + w - r,
      moveY: y,
      lineWidth: 0,
    },
    {
      type: "line",
      name: "right",
      x1: x + w,
      y1: y + h - r,
      moveX: x + w,
      moveY: y + r,
      lineWidth: 0,
    },
    {
      type: "angle",
      name: "right-bottom",
      x1: x + w,
      y1: y + h,
      x2: x + w - r,
      y2: y + h,
      r: r,
      moveX: x + w,
      moveY: y + h - r,
      lineWidth: 0,
    },
    {
      type: "line",
      name: "bottom",
      x1: x + r,
      y1: y + h,
      moveX: x + w - r,
      moveY: y + h,
      lineWidth: 0,
    },
    {
      type: "angle",
      name: "left-bottom",
      x1: x,
      y1: y + h,
      x2: x,
      y2: y + h - r,
      r: r,
      moveX: x + r,
      moveY: y + h,
      lineWidth: 0,
    },
    {
      type: "line",
      name: "left",
      x1: x,
      y1: y + r,
      moveX: x,
      moveY: y + h - r,
      lineWidth: 0,
    },
  ];
  if (border.width) {
    if (border.width.top && border.width.top > 0) {
      // 上
      borderInfoList[0].lineWidth = borderInfoList[0].lineWidth > border.width.top ? borderInfoList[0].lineWidth : border.width.top
      borderInfoList[1].lineWidth = borderInfoList[1].lineWidth > border.width.top ? borderInfoList[1].lineWidth : border.width.top
      borderInfoList[2].lineWidth = borderInfoList[2].lineWidth > border.width.top ? borderInfoList[2].lineWidth : border.width.top
    }
    if (border.width.right && border.width.right > 0) {
      // 右
      borderInfoList[2].lineWidth = borderInfoList[2].lineWidth > border.width.right ? borderInfoList[0].lineWidth : border.width.right
      borderInfoList[3].lineWidth = borderInfoList[3].lineWidth > border.width.right ? borderInfoList[1].lineWidth : border.width.right
      borderInfoList[4].lineWidth = borderInfoList[4].lineWidth > border.width.right ? borderInfoList[2].lineWidth : border.width.right
    }
    if (border.width.bottom && border.width.bottom > 0) {
      // 下
      borderInfoList[4].lineWidth = borderInfoList[4].lineWidth > border.width.bottom ? borderInfoList[4].lineWidth : border.width.bottom
      borderInfoList[5].lineWidth = borderInfoList[5].lineWidth > border.width.bottom ? borderInfoList[5].lineWidth : border.width.bottom
      borderInfoList[6].lineWidth = borderInfoList[6].lineWidth > border.width.bottom ? borderInfoList[6].lineWidth : border.width.bottom
    }
    if (border.width.left && border.width.left > 0) {
      // 左
      borderInfoList[6].lineWidth = borderInfoList[6].lineWidth > border.width.left ? borderInfoList[6].lineWidth : border.width.left
      borderInfoList[7].lineWidth = borderInfoList[7].lineWidth > border.width.left ? borderInfoList[7].lineWidth : border.width.left
      borderInfoList[0].lineWidth = borderInfoList[0].lineWidth > border.width.left ? borderInfoList[0].lineWidth : border.width.left
    }
    // console.log('borderList', borderInfoList)
    for (let index = 0; index < borderInfoList.length; index++) {
      const item = borderInfoList[index];
      if (item.lineWidth && item.lineWidth > 0) {
        if (item.type === "angle") {
          ctx.beginPath();
          ctx.moveTo(item.moveX * scaling, item.moveY * scaling);
          ctx.lineWidth = item.lineWidth * scaling;
          ctx.arcTo(item.x1 * scaling, item.y1 * scaling, item.x2 * scaling, item.y2 * scaling, item.r * scaling); // 角
          ctx.stroke();
        } else if (item.type === "line") {
          ctx.beginPath();
          ctx.moveTo(item.moveX * scaling, item.moveY * scaling);
          ctx.lineWidth = item.lineWidth * scaling;
          ctx.lineTo(item.x1 * scaling, item.y1 * scaling); // 线
          ctx.stroke();
        }
      }
    }
  }
  ctx.closePath();
  return this;
};

// 绘制字体
const drawText = function (ctx, text, font, x, y, maxWidth = 999) {
  let scaling = getScaling()
  let { bold, fontSize = 12, color = "#000000", fontFamily, textAlign } = font;
  if (bold) {
    ctx.font = `bold ${fontSize * scaling}px ${fontFamily ? fontFamily : "sans-serif"}`;
  } else {
    ctx.font = `normal ${fontSize * scaling}px ${fontFamily ? fontFamily : "sans-serif"}`;
  }
  // if (textAlign) {
  //   ctx.textAlign = textAlign;
  // } else {
  //   ctx.textAlign = "left";
  // }
  ctx.textBaseline = "middle";
  ctx.setFontSize(fontSize * scaling);
  ctx.setFillStyle(color);
  // const fontHeight = 12;
  if (ctx.measureText(text).width > maxWidth * scaling) {
    var count = 1;
    while (ctx.measureText(text.slice(0, text.length - count)).width > 693 * scaling) {
      count++;
    }
    ctx.fillText(text.slice(0, text.length - (count + 1)) + "...", x * scaling, (Number(y) + Number(fontSize)) * scaling);
  } else {
    ctx.fillText(text, x * scaling, (Number(y) + Number(fontSize)) * scaling);
  }
};
/**
 * 绘制EXIFINFO对应的border
 * @param {*} EXIFINFO
 * @param {*} border
 */
const drawBorder = function (ctx, EXIFINFO) {
  let border = EXIFINFO.getBorder();
  let padding = [EXIFINFO.computedData.padding.top * 1 || 0, EXIFINFO.computedData.padding.right * 1 || 0, EXIFINFO.computedData.padding.bottom * 1 || 0, EXIFINFO.computedData.padding.left * 1 || 0];
  let margin = [EXIFINFO.computedData.margin.top * 1 || 0, EXIFINFO.computedData.margin.right * 1 || 0, EXIFINFO.computedData.margin.bottom * 1 || 0, EXIFINFO.computedData.margin.left * 1 || 0];
  let x = EXIFINFO.axisInfo.x * 1 - padding[3];
  let y = EXIFINFO.axisInfo.y * 1 - padding[0];
  let w = EXIFINFO.width * 1 - margin[1] - margin[3];
  let h = EXIFINFO.height * 1 - margin[0] - margin[2];
  roundRect(ctx, border, x, y, w, h, EXIFINFO.round);
};


// canvas image draw方法
const canvasDrawImage = function (ctx, domcomentVue, imgEXIFINFO) {
  let scaling = getScaling()
  drawBorder(ctx, imgEXIFINFO); // 绘制border
  // ctx.drawImage(img, 0, 0, width, height, 0, 0, canvasWidth, canvasHeight)
  if (!imgEXIFINFO.mainImage)
    ctx.drawImage(imgEXIFINFO.content, imgEXIFINFO.axisInfo.x * scaling, imgEXIFINFO.axisInfo.y * scaling, imgEXIFINFO.contentWidth * scaling, imgEXIFINFO.contentHeight * scaling); // 绘制图案
};

// canvas text draw方法
const canvasDrawText = function (ctx, textEXIFINFO) {
  let scaling = getScaling()
  drawBorder(ctx, textEXIFINFO); // 绘制border
  // 绘制文字
  drawText(ctx, textEXIFINFO.content, textEXIFINFO.font, textEXIFINFO.axisInfo.x * scaling, textEXIFINFO.axisInfo.y * scaling, 320 * scaling);
};

// canvas block draw方法
const canvasDrawBlock = function (ctx, blockEXIFINFO) {
  drawBorder(ctx, blockEXIFINFO); // 绘制border
}

export const canvasDrawMain = function (ctx, domcomentVue, EXIFINFO) {
  if (EXIFINFO.type == "image") {
    canvasDrawImage(ctx, domcomentVue, EXIFINFO);
  } else if (EXIFINFO.type == "text") {
    canvasDrawText(ctx, EXIFINFO);
  } else if (EXIFINFO.type == "block") {
    canvasDrawBlock(ctx, EXIFINFO);
  }
};
