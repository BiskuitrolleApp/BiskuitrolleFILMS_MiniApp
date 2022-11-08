const moneyTools = {

  /**
   * 数字金额格式化，常用场景在过滤器中
   * @param {String|Number} 金额数字，字符串或者数字类型
   * @param {String}        货币符号，默认¥
   * @param {Number}        小数点后精确的位数，默认2
   * @return {String}       加上了,逗号分隔符和小数点.后的字符串
   */
  currencyFormat (value = '', currencySign = '¥', decimals = 2) {
    value = parseFloat(value);
    if (!isFinite(value) || (!value && value !== 0)) return '';
    const stringified = Math.abs(value).toFixed(decimals);
    const _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
    const i = _int.length % 3;
    const head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';
    const _float = decimals ? stringified.slice(-1 - decimals) : '';
    const sign = value < 0 ? '-' : '';
    const digitsRE = /(\d{3})(?=\d)/g;
    return (
      sign +
      currencySign +
      head +
      _int.slice(i).replace(digitsRE, '$1,') +
      _float
    );
  },

  /**
   * @desc 金额转换成大写
   * @param {Number} n 需要转换成大写的金额
   * @return {String} 转换后的大写中文金额
   * @example changeAmt('123') =>'壹百贰拾叁元整'
   */
  toChinese (n) {
    const fraction = ['角', '分'];
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];

    n = Math.abs(n);

    let s = '';

    for (let i = 0; i < fraction.length; i++) {
      s += (
        digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
      ).replace(/零./, '');
    }

    s = s || '整';

    n = Math.floor(n);

    for (let i = 0; i < unit[0].length && n > 0; i++) {
      let p = '';
      for (let j = 0; j < unit[1].length && n > 0; j++) {
        p = digit[n % 10] + unit[1][j] + p;
        n = Math.floor(n / 10);
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return s
      .replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整');
  }
};

export default moneyTools;
