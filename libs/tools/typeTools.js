export default {
  /**
   * 判断是否为数组(判断值)
   * @param {any} obj 对象
   * @returns {Boolean} 结果
   */
  isArray(obj) {
    return (Object.prototype.toString.call(obj) === '[object Array]');
  },

  /**
   * 判断是否为字符串(判断值)
   * @param {any} obj 对象
   * @returns {Boolean} 结果
   */
  isString(obj) {
    return (Object.prototype.toString.call(obj) === '[object String]');
  },

  /**
   * 判断是否为数字(判断值)
   * @param {any} obj 对象
   * @returns {Boolean} 结果
   */
  isNumber(obj) {
    return (Object.prototype.toString.call(obj) === '[object Number]');
  },

  /**
   * 判断是否为布尔值(判断值)
   * @param {any} obj 对象
   * @returns {Boolean} 结果
   */
  isBoolean(obj) {
    return (Object.prototype.toString.call(obj) === '[object Boolean]');
  },

  /**
   * 判断是否为Date对象(判断值)
   * @param {any} obj 对象
   * @returns {Boolean} 结果
   */
  isDate(obj) {
    return (Object.prototype.toString.call(obj) === '[object Date]');
  },

  /**
   * 判断是否为Null(判断值)
   * @param {any} obj 对象
   * @returns {Boolean} 结果
   */
  isNull(obj) {
    return (Object.prototype.toString.call(obj) === '[object Null]');
  },
  /**
   * 判断数据是不是引用类型的数据 (例如： arrays, functions, objects, regexes, new Number(0),以及 new String(''))
   * @param value
   * @returns {boolean|boolean}
   */
  isObject(value) {
    let type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  },
  /**
   * 判断数据是不是Object类型的数据
   * @param obj
   * @returns {boolean}
   */
  isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  },
  /**
   * 判断数据是不是正则对象
   * @param value
   * @returns {boolean}
   */
  isRegExp(value) {
    return Object.prototype.toString.call(value) === '[object RegExp]'
  },
  /**
   * 检查 value 是不是函数
   * @param value
   * @returns {boolean}
   */
  isFunction(value) {
    return Object.prototype.toString.call(value) === '[object Function]'
  }
};
