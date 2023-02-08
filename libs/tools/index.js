/**
 * 以下文件全局引入，无需在页面内引入
 */
import dateTools from './dateTools';
import stringTools from './stringTools';
import typeTools from './typeTools';
import moneyTools from './moneyTools';
import mathTools from './mathTools';
export default {
  ...dateTools,
  ...stringTools,
  ...typeTools,
  ...moneyTools,
  ...mathTools
};
