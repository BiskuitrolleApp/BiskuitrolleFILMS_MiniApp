// /** 
//  * [orderBy description]
//  * @param { [type] } source[description]
//  * @param { [type] } orders[description]
//  * @return { [type]}[description]
//  */
/** 
 * order排序
 * @param { Array } source 数据源列表
 * @param { Array } 结果如何排序
 * @param { Array } type { asc, desc } 升降序排序
 * @return { Array} 新列表
 */
export const orderBy = function (source, orders, type) {
  if (source instanceof Array && orders instanceof Array && orders.length > 0) {
    var ordersc = orders.concat([]);
    var sorttype = type || 'asc';
    var results = [];
    var totalSum = {};
    function grouporder(source, orders, totalSum) {
      source.sort(function (a, b) {
        var convertA = a[orders[0]];
        var convertB = b[orders[0]];
        if (typeof convertA == 'string' && typeof convertB == 'string') {
          if (sorttype.toUpperCase() == 'ASC') {
            return convertA.localeCompare(convertB);
          } else {
            return convertB.localeCompare(convertA);
          }
        } else {
          if (sorttype.toUpperCase() == 'ASC') {
            return convertA - convertB;
          } else {
            return convertB - convertA;
          }
        }
      })
      var groupmap = new Map();
      source.forEach((item) => {
        if (groupmap.has(item[orders[0]])) {
          groupmap.get(item[orders[0]]).push(item);
        } else {
          groupmap.set(item[orders[0]], []);
          groupmap.get(item[orders[0]]).push(item);
        }
      })
      orders.shift();
      for (let [key, val] of groupmap) {
        totalSum[key] = {};
        totalSum[key].name = key;
        totalSum[key].value = val.length;
        if (orders.length == 0) {
          results = results.concat(val);
        } else {
          totalSum[key].children = {};
          var orderscopy = orders.concat([]);
          grouporder(val, orderscopy, totalSum[key].children);
        }
      }
    }
    grouporder(source, ordersc, totalSum);
    return {
      results: results,
      totalSum: totalSum
    };

  } else {
    return source;
  }
}

/** 
 * 查询数据源是否存在该数据
 * @param { Object } source 查询的数据源
 * @param { Array | String } key 数据key 
 * @return { Boolean} 是否存在
 */
export const has = function (source, key) {
  let keyList = []
  if (Object.prototype.toString.call(key) === '[object String]') {
    keyList = key.split('.')
  } else if (Object.prototype.toString.call(key) === '[object Array]') {
    keyList = key
  } else {
    console.error('Input parameter key format error')
    return false
  }
  const hasOwnProperty = Object.prototype.hasOwnProperty
  function hasOriginFunction(object, key) {
    return object != null && hasOwnProperty.call(object, key)
  }
  let currentObject = source;
  let hasObject = true;
  for (let index = 0; index < keyList.length; index++) {
    const keyItem = keyList[index];
    if (hasOriginFunction(currentObject, keyItem)) {
      currentObject = currentObject[keyItem]
    } else {
      hasObject = false
      break;
    }
  }
  return hasObject
}