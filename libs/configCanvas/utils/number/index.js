//去除非数字
export const clearNoNum = function (item) {
  if (item != null && item != undefined) {
    //先把非数字的都替换掉，除了数字和.
    item = item.replace(/[^\d.]/g, "");
    //必须保证第一个为数字而不是.
    item = item.replace(/^\./g, "");
    //保证只有出现一个.而没有多个.
    item = item.replace(/\.{2,}/g, "");
    //保证.只出现一次，而不能出现两次以上
    item = item.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".")
    //最多保留小数点后一位
    var arr = item.split(".");
    if (arr.length > 1) item = arr[0] + '.' + (arr[1].length > 1 ? arr[1].substr(0, 1) : arr[1]);
  }
  return item;
} 
