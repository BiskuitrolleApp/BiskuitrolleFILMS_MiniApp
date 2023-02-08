// import MD5 from "crypto-js/md5";

export default {
  /**
   * 值过滤器，以“--”展示，格式化空值、假值、空串、null字符串值、零值
   * @param {any|string|number} val 需要格式化的值
   * @param {boolean} containsZero 是否包含零值，默认false
   */
  valueFormat(val, containsZero = false) {
    // 格式化空值、假值、空串、null字符串值
    if (val === undefined || val === null || val === false || val === "" || val === "null") {
      return "--";
    }
    // 格式化零值
    if(containsZero && !isNaN(val) && Number(val)===0) {
      return "--";
    }
    // 原样返回
    return val;
  },
  /**
   * 去掉空格
   * @param {any} str 需要格式化的字符串
   * @param {boolean} [isGlobal=true] 是否全部格式化，默认是
   * @returns 字符串
   */
  trim(str, isGlobal = true) {
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g, "");
    if (isGlobal) {
      result = result.replace(/\s/g, "");
    }
    return result;
  },

  /**
   * html反转义
   * @param {any} htmlText 转义后的html文本
   * @returns html
   */
  toHtml(htmlText) {
    try {
      htmlText = htmlText.replace(/&lt;/g, "<");
      htmlText = htmlText.replace(/&gt;/g, ">");
      htmlText = htmlText.replace(/&amp;/g, "&");
      htmlText = htmlText.replace(/&quot;/g, '\"');
      htmlText = htmlText.replace(/&#39;/g, "'");
    } catch (error) {
    }
    return htmlText;
  },
};
