import { getScaling } from "./var";
import tools from "../tools/index";
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

// 设置透明度
const getAlpha = function (color = "#000000ff") {
  let alpha = "ff";
  alpha = color.substring(7, 9) || "ff";
  if (alpha == "ff") {
    return "1";
  }
  let alpha10 = parseInt(alpha, 16);
  let number = alpha10 / 255;
  var result = parseFloat(number);
  if (isNaN(result)) {
    console.error("透明度错误，color，alpha", color, number);
    return "1";
  }
  result = Math.round(number * 100) / 100;
  return result;
};

const roundRect = function (ctx, border, xAxis, yxAxis, width, height, round, background) {
  let scaling = getScaling();
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
  // ctx.lineWidth = border.style;
  // TODO 线的类型，点或者实线
  let lineColor = border.color.substring(0, 7);
  let lineAlpha = getAlpha(border.color);

  ctx.setGlobalAlpha(lineAlpha); // 透明度
  ctx.strokeStyle = lineColor;

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
      angleX: x,
      angleY: y,
      endX: x + r,
      endY: y,
      r: r,
      moveX: x,
      moveY: y + r,
      lineWidth: 0,
    },
    {
      type: "line",
      name: "top",
      endX: x + w - r,
      endY: y,
      moveX: x + r,
      moveY: y,
      lineWidth: 0,
    },
    {
      type: "angle",
      name: "right-top",
      angleX: x + w,
      angleY: y,
      endX: x + w,
      endY: y + r,
      r: r,
      moveX: x + w - r,
      moveY: y,
      lineWidth: 0,
    },
    {
      type: "line",
      name: "right",
      endX: x + w,
      endY: y + h - r,
      moveX: x + w,
      moveY: y + r,
      lineWidth: 0,
    },
    {
      type: "angle",
      name: "right-bottom",
      angleX: x + w,
      angleY: y + h,
      endX: x + w - r,
      endY: y + h,
      r: r,
      moveX: x + w,
      moveY: y + h - r,
      lineWidth: 0,
    },
    {
      type: "line",
      name: "bottom",
      endX: x + r,
      endY: y + h,
      moveX: x + w - r,
      moveY: y + h,
      lineWidth: 0,
    },
    {
      type: "angle",
      name: "left-bottom",
      angleX: x,
      angleY: y + h,
      endX: x,
      endY: y + h - r,
      r: r,
      moveX: x + r,
      moveY: y + h,
      lineWidth: 0,
    },
    {
      type: "line",
      name: "left",
      endX: x,
      endY: y + r,
      moveX: x,
      moveY: y + h - r,
      lineWidth: 0,
    },
  ];
  if (border.width) {
    if (border.width.top && border.width.top > 0) {
      // 上
      borderInfoList[0].lineWidth = borderInfoList[0].lineWidth > border.width.top ? borderInfoList[0].lineWidth : border.width.top;
      borderInfoList[1].lineWidth = borderInfoList[1].lineWidth > border.width.top ? borderInfoList[1].lineWidth : border.width.top;
      borderInfoList[2].lineWidth = borderInfoList[2].lineWidth > border.width.top ? borderInfoList[2].lineWidth : border.width.top;
      if (borderInfoList[0].r === 0) {
        let borderWidth = border.width.left || 0;
        borderInfoList[1].moveX -= borderWidth / 2;
      }
      if (borderInfoList[2].r === 0) {
        let borderWidth = border.width.right || 0;
        borderInfoList[1].endX += borderWidth / 2;
      }
    }
    if (border.width.right && border.width.right > 0) {
      // 右
      borderInfoList[2].lineWidth = borderInfoList[2].lineWidth > border.width.right ? borderInfoList[0].lineWidth : border.width.right;
      borderInfoList[3].lineWidth = borderInfoList[3].lineWidth > border.width.right ? borderInfoList[1].lineWidth : border.width.right;
      borderInfoList[4].lineWidth = borderInfoList[4].lineWidth > border.width.right ? borderInfoList[2].lineWidth : border.width.right;

      if (borderInfoList[2].r === 0) {
        let borderWidth = border.width.top || 0;
        borderInfoList[3].moveY -= borderWidth / 2;
      }
      if (borderInfoList[4].r === 0) {
        let borderWidth = border.width.bottom || 0;
        borderInfoList[3].endY += borderWidth / 2;
      }
    }
    if (border.width.bottom && border.width.bottom > 0) {
      // 下
      borderInfoList[4].lineWidth = borderInfoList[4].lineWidth > border.width.bottom ? borderInfoList[4].lineWidth : border.width.bottom;
      borderInfoList[5].lineWidth = borderInfoList[5].lineWidth > border.width.bottom ? borderInfoList[5].lineWidth : border.width.bottom;
      borderInfoList[6].lineWidth = borderInfoList[6].lineWidth > border.width.bottom ? borderInfoList[6].lineWidth : border.width.bottom;

      if (borderInfoList[4].r === 0) {
        let borderWidth = border.width.right || 0;
        borderInfoList[5].moveX += borderWidth / 2;
      }
      if (borderInfoList[6].r === 0) {
        let borderWidth = border.width.left || 0;
        borderInfoList[5].endX -= borderWidth / 2;
      }
    }
    if (border.width.left && border.width.left > 0) {
      // 左
      borderInfoList[6].lineWidth = borderInfoList[6].lineWidth > border.width.left ? borderInfoList[6].lineWidth : border.width.left;
      borderInfoList[7].lineWidth = borderInfoList[7].lineWidth > border.width.left ? borderInfoList[7].lineWidth : border.width.left;
      borderInfoList[0].lineWidth = borderInfoList[0].lineWidth > border.width.left ? borderInfoList[0].lineWidth : border.width.left;

      if (borderInfoList[6].r === 0) {
        let borderWidth = border.width.bottom || 0;
        borderInfoList[7].moveY += borderWidth / 2;
      }
      if (borderInfoList[0].r === 0) {
        let borderWidth = border.width.top || 0;
        borderInfoList[7].endY -= borderWidth / 2;
      }
    }
    // console.log('borderList', borderInfoList)
    for (let index = 0; index < borderInfoList.length; index++) {
      const item = borderInfoList[index];
      if (item.lineWidth && item.lineWidth > 0) {
        if (item.type === "line") {
          ctx.beginPath();
          ctx.moveTo(item.moveX * scaling, item.moveY * scaling);
          ctx.lineWidth = item.lineWidth * scaling;
          ctx.lineTo(item.endX * scaling, item.endY * scaling); // 线
          ctx.stroke();
          // ctx.fill();
        } else if (item.type === "angle") {
          ctx.beginPath();
          ctx.moveTo(item.moveX * scaling, item.moveY * scaling);
          ctx.lineWidth = item.lineWidth * scaling;
          ctx.arcTo(item.angleX * scaling, item.angleY * scaling, item.endX * scaling, item.endY * scaling, item.r * scaling); // 角
          ctx.stroke();
          // ctx.fill();
        }
      }
    }
  }
  ctx.setGlobalAlpha("1"); // 透明度恢复
  return this;
};

function drawRoundRectPath(ctx, width, height, radius) {
  ctx.beginPath(0);
  //从右下角顺时针绘制，弧度从0到1/2PI
  ctx.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
  //矩形下边线
  ctx.lineTo(radius, height);
  //左下角圆弧，弧度从1/2PI到PI
  ctx.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);
  //矩形左边线
  ctx.lineTo(0, radius);
  //左上角圆弧，弧度从PI到3/2PI
  ctx.arc(radius, radius, radius, Math.PI, (Math.PI * 3) / 2);
  //上边线
  ctx.lineTo(width - radius, 0);
  //右上角圆弧
  ctx.arc(width - radius, radius, radius, (Math.PI * 3) / 2, Math.PI * 2);
  //右边线
  ctx.lineTo(width, height - radius);
  ctx.closePath();
}

/**该方法用来绘制一个有填充色的圆角矩形
 *@param ctx:canvas的上下文环境
 *@param x:左上角x轴坐标
 *@param y:左上角y轴坐标
 *@param width 矩形的宽度
 *@param height:矩形的高度
 *@param radius:圆的半径
 *@param fillColor:填充颜色
 **/
function fillRoundRect(ctx, x, y, width, height, radius, /*optional*/ fillColor) {
  //圆的直径必然要小于矩形的宽高
  if (2 * radius > width || 2 * radius > height) {
    return false;
  }

  ctx.save();
  ctx.translate(x, y);
  //绘制圆角矩形的各个边
  drawRoundRectPath(ctx, width, height, radius);

  let fColor = fillColor.substring(0, 7);
  let fAlpha = getAlpha(fillColor);

  ctx.setGlobalAlpha(fAlpha); // 透明度
  ctx.fillStyle = fColor || "#ffffff"; //若是给定了值就用给定的值否则给予默认值
  ctx.fill();
  ctx.restore();
  ctx.setGlobalAlpha("1"); // 透明度恢复
}

/**该方法用来绘制圆角矩形
 *@param ctx:canvas的上下文环境
 *@param x:左上角x轴坐标
 *@param y:左上角y轴坐标
 *@param width 矩形的宽度
 *@param height:矩形的高度
 *@param radius:圆的半径
 *@param lineWidth:线条粗细
 *@param strokeColor:线条颜色
 **/
function strokeRoundRect(ctx, x, y, width, height, radius, /*optional*/ lineWidth, /*optional*/ strokeColor) {
  //圆的直径必然要小于矩形的宽高
  if (2 * radius > width || 2 * radius > height) {
    return false;
  }
  ctx.save();
  ctx.translate(x, y);
  //绘制圆角矩形的各个边
  drawRoundRectPath(ctx, width, height, radius);
  ctx.lineWidth = lineWidth || 2; //若是给定了值就用给定的值否则给予默认值2
  ctx.strokeStyle = strokeColor || "#000";
  ctx.stroke();
  ctx.restore();
}

// 绘制字体
const drawText = function (ctx, text, font, x, y, maxWidth = 999) {
  let scaling = getScaling();
  let { bold, fontSize = 12, color = "#000000ff", fontFamily, textAlign, style } = font;
  let currentFontSize = tools.times(fontSize, scaling, 0);
  // let currentFontSize = 30
  // if (bold) {
  //   let font = `bold ${currentFontSize}px ${fontFamily ? fontFamily : "sans-serif"} ${style}`
  //   ctx.font = font.replace(/(^\s*)|(\s*$)/g,"");
  // } else {
  //   ctx.font = `normal ${currentFontSize}px ${fontFamily ? fontFamily : "sans-serif"}  ${style}`;
  // }
  // let canvasFont = `${bold ? "bold" : "normal"} ${style}`;
  ctx.font = "normal 400 15px Arial, sans-serif"; // 重置
  let canvasFont = `normal ${bold ? "bold" : "normal"} ${currentFontSize}px ${fontFamily ? fontFamily : "sans-serif"} ${style}`;
  ctx.font = canvasFont.replace(/(^\s*)|(\s*$)/g, "");
  console.log("ctx font:", ctx.font);
  // if (textAlign) {
  //   ctx.textAlign = textAlign;
  // } else {
  //   ctx.textAlign = "left";
  // }
  // ctx.textBaseline = "middle";
  ctx.textBaseline = "Top";
  ctx.setFontSize(currentFontSize);

  let textColor = color.substring(0, 7);
  let textAlpha = getAlpha(color);

  ctx.setFillStyle(textColor);
  ctx.setGlobalAlpha(textAlpha); // 透明度

  // const fontHeight = 12;
  if (ctx.measureText(text).width > maxWidth * scaling) {
    var count = 1;
    while (ctx.measureText(text.slice(0, text.length - count)).width > maxWidth * scaling) {
      count++;
    }
    ctx.fillText(text.slice(0, text.length - (count + 1)) + "...", x, Number(y) + Number(fontSize));
  } else {
    ctx.fillText(text, x, Number(y) + Number(currentFontSize));
  }
  ctx.setGlobalAlpha("1"); // 透明度恢复
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
  let borderDate = [border.width.top * 1 || 0, border.width.right * 1 || 0, border.width.bottom * 1 || 0, border.width.left * 1 || 0];
  let x = EXIFINFO.axisInfo.x * 1 - padding[3] - borderDate[3] / 2;
  let y = EXIFINFO.axisInfo.y * 1 - padding[0] - borderDate[0] / 2;
  let w = EXIFINFO.width * 1 - margin[1] - margin[3] - borderDate[3] / 2 - borderDate[1] / 2;
  let h = EXIFINFO.height * 1 - margin[0] - margin[2] - borderDate[2] / 2 - borderDate[2] / 2;
  // let w = EXIFINFO.width * 1 - margin[1] - margin[3];
  // let h = EXIFINFO.height * 1 - margin[0] - margin[2];
  roundRect(ctx, border, x, y, w, h, EXIFINFO.round, EXIFINFO.background);
  fillRoundRect(ctx, x, y, w, h, EXIFINFO.round, EXIFINFO.background);
};

// canvas image draw方法
const canvasDrawImage = function (ctx, domcomentVue, imgEXIFINFO) {
  let scaling = getScaling();
  drawBorder(ctx, imgEXIFINFO); // 绘制border
  // ctx.drawImage(img, 0, 0, width, height, 0, 0, canvasWidth, canvasHeight)
  // if (!imgEXIFINFO.mainImage)
  ctx.drawImage(imgEXIFINFO.content, imgEXIFINFO.axisInfo.x * scaling, imgEXIFINFO.axisInfo.y * scaling, imgEXIFINFO.contentWidth * scaling, imgEXIFINFO.contentHeight * scaling); // 绘制图案
};

// canvas text draw方法
const canvasDrawText = function (ctx, textEXIFINFO) {
  let scaling = getScaling();
  drawBorder(ctx, textEXIFINFO); // 绘制border
  // 绘制文字
  drawText(ctx, textEXIFINFO.content, textEXIFINFO.font, textEXIFINFO.axisInfo.x * scaling, textEXIFINFO.axisInfo.y * scaling, textEXIFINFO.maxWidth || 320);
};

// canvas block draw方法
const canvasDrawBlock = function (ctx, blockEXIFINFO) {
  drawBorder(ctx, blockEXIFINFO); // 绘制border
};

export const canvasDrawMain = function (ctx, domcomentVue, EXIFINFO) {
  if (EXIFINFO.type == "image") {
    canvasDrawImage(ctx, domcomentVue, EXIFINFO);
  } else if (EXIFINFO.type == "text") {
    canvasDrawText(ctx, EXIFINFO);
  } else if (EXIFINFO.type == "block") {
    canvasDrawBlock(ctx, EXIFINFO);
  }
};
