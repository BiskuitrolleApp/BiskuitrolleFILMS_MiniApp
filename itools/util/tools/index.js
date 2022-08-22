/**
 * 数据格式化
 * @param {*} num 数据
 * @param {*} decimal 小数点后长度
 * @returns 格式化好的数据
 */
const formatDecimal = function(num, decimal=2) {
	if (!num || num == '' || isNaN(num)) {
		return '';
	}
	num = num.toString();
	let index = num.indexOf('.');
	if (index !== -1) {
		num = num.substring(0, decimal + index + 1);
	} else {
		num = num.substring(0);
	}
	return parseFloat(num).toFixed(decimal);
}
const formatNumber = function(num) {
	if (!num || num == '' || isNaN(num)) {
		return 0;
	}
	return parseFloat(num)
}

module.exports = {
	formatDecimal,
	formatNumber
} 