/**
 * 获得当前服务时间
 */
export const getServerTime = function() {
	return new Date()
}

/**
 * 获得当前服务时间戳
 */
export const getServerTimeStamp = function() {
	return getServerTime().getTime()
}
