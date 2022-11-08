import Big from '../bigNumber/big.js';

export default {

  /**
   * 加法
   * @param {*} value1 数字1
   * @param {*} value2 数字2
   * @param {*} fix 小数点后保留位数
   */
  plus: function (value1, value2, fix = 2) {
    const x = new Big(value1);
    return x.plus(value2).toFixed(fix).toString();
  },

  /**
   * 减法
   * @param {*} minuend 被减数
   * @param {*} reduction 减数
   * @param {*} fix 小数点后保留位数
   */
  minus: function (minuend, reduction, fix = 2) {
    const x = new Big(minuend);
    return x.minus(reduction).toFixed(fix).toString();
  },

  /**
   * 乘法
   * @param {*} value1 数字1
   * @param {*} value2 数字2
   * @param {*} fix 小数点后保留位数
   */
  times: function (value1, value2, fix = 2) {
    const x = new Big(value1);
    return x.times(value2).toFixed(fix).toString();
  },

  /**
   * 除法
   * @param {*} dividend 除数
   * @param {*} divisor 被除数
   * @param {*} fix 小数点后保留位数
   */
  div: function (dividend, divisor, fix = 2) {
    const x = new Big(dividend);
    return x.div(divisor).toFixed(fix).toString();
  },

  /**
   * 取余
   * @param {*} dividend 除数
   * @param {*} divisor 被除数
   */
  mod: function (dividend, divisor) {
    const x = new Big(dividend);
    return x.mod(divisor).toString();
  },

  /**
   * 四舍五入
   * @param {*} value 数字
   * @param {*} fix 小数点后保留位数
   */
  round: function (value, fix) {
    const x = new Big(value);
    return x.round().toFixed(fix).toString();
  },

  /**
   * 保留小数位
   * @param {*} value 数字
   * @param {*} fix 小数点后保留位数
   */
  toFixed: function (value, fix) {
    const x = new Big(value);
    return x.toFixed(fix).toString();
  },

  /**
   * 绝对值
   * @param {*} value
   */
  abs: function (value) {
    const x = new Big(value);
    return x.abs().toString();
  },

  /**
   * 比较两个数大小 0: 两数大小一样 1: 第一个大于第二个 -1: 第一个小于第二个
   * @param {*} firstNum
   * @param {*} secondNum
   */
  cmp: function (firstNum, secondNum) {
    const x = new Big(firstNum);
    const y = new Big(secondNum);
    return x.cmp(y);
  },

  /**
   * 十六进制数字转十进制
   * @param {*} value
   */
  hex2Decimal: function (value) {
    return value.toString(16);
  },

  /**
   * 十进制数字转十六进制
   * @param {*} value
   */
  decimal2Hex: function (value) {
    return parseInt(value, 16);
  },
  /**
   * 检查数据是否是非数字值：
   *   原生的isNaN会把参数转换成数字(valueof)，
   *   而null、true、false以及长度小于等于1的数组(元素为非NaN数据)会被转换成数字。
   *   Symbol类型的数据不具有valueof接口，所以isNaN会抛出错误，这里放在后面，可避免错误
   * @param v
   * @returns {boolean}
   */
  isNaN(v){
    return !(typeof v === 'string' || typeof v === 'number') || isNaN(v)
  }
};
