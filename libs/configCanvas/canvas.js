
// 绘制字体
function drawText(ctx, text, font, x, y, maxWidth = 999) {
  let { bold, fontSize = 12, color = '#000', fontFamily, textAlign } = font
  if (bold) {
    ctx.font = `bold ${fontSize}px ${fontFamily ? fontFamily : 'normal'}`;
  } else {
    ctx.font = `normal ${fontSize}px  ${fontFamily ? fontFamily : 'normal'}`;
  }
  if (textAlign) {
    ctx.textAlign = textAlign;
  } else {
    ctx.textAlign = 'left';
  }
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  // const fontHeight = 12;
  console.log('drawText', fontSize, Number(y) + Number(fontSize));
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
 * 绘制圆角矩形
 * @param {*} ctx canvas object
 * @param {*} x 开始点x轴
 * @param {*} y 开始点y轴
 * @param {*} w 矩形宽
 * @param {*} h 矩形高
 * @param {*} r 矩形圆角矩形的半径
 * @returns 
 */
const roundRect = function (ctx, x, y, w, h, r) {
  if (w < 2 * r) { r = w / 2; }
  if (h < 2 * r) { r = h / 2; }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  return this;
}

// canvas image draw方法
export const canvasDrawImage = function (ctx, imgEXIFINFO) {
  ctx.drawImage(imgEXIFINFO.content, imgEXIFINFO.axisInfo.x, imgEXIFINFO.axisInfo.y, imgEXIFINFO.width, imgEXIFINFO.height);
}

// canvas text draw方法
export const canvasDrawText = function (ctx, textEXIFINFO) {
  drawText(
    ctx,
    textEXIFINFO.content,
    textEXIFINFO.font,
    textEXIFINFO.axisInfo.x,
    textEXIFINFO.axisInfo.y,
    5000,
  );
}
