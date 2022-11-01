
/**
 * 绘制圆角矩形
 * @param {*} ctx canvas object
 * @param {*} border border object
 * @param {*} x 开始点x轴
 * @param {*} y 开始点y轴
 * @param {*} w 矩形宽
 * @param {*} h 矩形高
 * @param {*} r 矩形圆角矩形的半径
 * @returns 
 */
const roundRect = function (ctx, border, x, y, w, h, r) {
  if (w < 2 * r) { r = w / 2; }
  if (h < 2 * r) { r = h / 2; }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  // cxt.lineWidth = border.style;
  ctx.strokeStyle = border.color;
  if (border.width) {
    if (border.width.right && border.width.right > 0) ctx.arcTo(x + w, y, x + w, y + h, r); // 右
    if (border.width.bottom && border.width.bottom > 0) ctx.arcTo(x + w, y + h, x, y + h, r); // 下
    if (border.width.left && border.width.left > 0) ctx.arcTo(x, y + h, x, y, r); // 左
    if (border.width.top && border.width.top > 0) ctx.arcTo(x, y, x + w, y, r); // 上
    ctx.stroke()
  }
  ctx.closePath();
  return this;
}

// 绘制字体
const drawText = function (ctx, text, font, x, y, maxWidth = 999) {
  let { bold, fontSize = 12, color = '#000000', fontFamily, textAlign } = font
  if (bold) {
    ctx.font = `bold ${fontSize}px ${fontFamily ? fontFamily : 'sans-serif'}`;
  } else {
    ctx.font = `normal ${fontSize}px ${fontFamily ? fontFamily : 'sans-serif'}`;
  }
  if (textAlign) {
    ctx.textAlign = textAlign;
  } else {
    ctx.textAlign = 'left';
  }

  ctx.textBaseline = 'middle';
  ctx.setFontSize(fontSize)
  ctx.setFillStyle(color)
  // const fontHeight = 12;
  if (ctx.measureText(text).width > maxWidth) {
    var count = 1;
    while (ctx.measureText(text.slice(0, text.length - count)).width > 693) {
      count++;
    }
    ctx.fillText(text.slice(0, text.length - (count + 1)) + '...', x, Number(y) + Number(fontSize));
  } else {
    ctx.fillText(text, x, Number(y) + Number(fontSize));
  }
}
/**
 * 绘制EXIFINFO对应的border
 * @param {*} EXIFINFO 
 * @param {*} border 
 */
const drawBorder = function (ctx, EXIFINFO) {
  let border = EXIFINFO.getBorder();
  let padding = [EXIFINFO.computedData.padding.top * 1 || 0, EXIFINFO.computedData.padding.right * 1 || 0, EXIFINFO.computedData.padding.bottom * 1 || 0, EXIFINFO.computedData.padding.left * 1 || 0]
  let margin = [EXIFINFO.computedData.margin.top * 1 || 0, EXIFINFO.computedData.margin.right * 1 || 0, EXIFINFO.computedData.margin.bottom * 1 || 0, EXIFINFO.computedData.margin.left * 1 || 0]
  let x = EXIFINFO.axisInfo.x * 1 - padding[3]
  let y = EXIFINFO.axisInfo.y * 1 - padding[0]
  let w = EXIFINFO.width * 1 - margin[1] - margin[3]
  let h = EXIFINFO.height * 1 - margin[0] - margin[2]
  console.log('padding', padding, x, y, w, h, EXIFINFO)
  roundRect(ctx, border, x, y, w, h, EXIFINFO.round)
}

// canvas image draw方法
const canvasDrawImage = function (ctx, imgEXIFINFO) {
  drawBorder(ctx, imgEXIFINFO) // 绘制border
  ctx.drawImage(imgEXIFINFO.content, imgEXIFINFO.axisInfo.x, imgEXIFINFO.axisInfo.y, imgEXIFINFO.width, imgEXIFINFO.height); // 绘制图案
}

// canvas text draw方法
const canvasDrawText = function (ctx, textEXIFINFO) {
  drawBorder(ctx, textEXIFINFO) // 绘制border
  // 绘制文字
  drawText(
    ctx,
    textEXIFINFO.content,
    textEXIFINFO.font,
    textEXIFINFO.axisInfo.x,
    textEXIFINFO.axisInfo.y,
    5000,
  );
}

export const canvasDrawMain = function (ctx, EXIFINFO) {
  if (EXIFINFO.type == 'image') {
    canvasDrawImage(ctx, EXIFINFO)
  } else if (EXIFINFO.type == 'text') {
    canvasDrawText(ctx, EXIFINFO)
  }
}
