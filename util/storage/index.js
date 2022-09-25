import {
	getServerTimeStamp
} from '../commonApi/index.js'
/**
 * @param {String} name 存储名称
 * @param {Object} params 存储参数
 * @param {Boolean} sync 是否使用同步
 */
const setStorageFunction = function(storageKey, storageParams, sync = false) {
	new Promise((res, rej) => {
		if (sync) {
			try {
				const value = uni.setStorageSync(storageKey, storageParams);
				res()
			} catch (e) {
				console.error('setStorageSync', e)
				rej({
					msg: '错误'
				})
			}
		} else {
			uni.setStorage({
				key: storageKey,
				data: storageParams,
				success: function({
					data
				}) {
					res()
				},
				fail: (e) => {
					console.error('setStorage', e)
					rej({
						msg: '错误'
					})
				}
			});
		}
	})
}

/**
 * 获得存储方法
 * @param {String} name 存储名称
 * @param {Boolean} sync 是否使用同步
 */
const getStorageFunction = function(storageKey, sync = false) {
	new Promise((res, rej) => {
		let time = getServerTimeStamp();
		if (sync) {
			try {
				const value = uni.getStorageSync(storageKey);
				if (data.expirationTime && (time < data.expirationTime || data.expirationTime ==
						'infinity')) {
					res(data.storageData)
				} else if (time > data.expirationTime) {
					rej({
						msg: '数据超过有效期'
					})
					uni.removeStorage(storageKey);
				} else {
					rej({
						msg: '错误'
					})
				}
			} catch (e) {
				//TODO handle the exception
				console.error('getStorageSync', e)
				rej({
					msg: '错误'
				})
			}
		} else {
			uni.getStorage({
				key: storageKey,
				success: function({
					data
				}) {
					if (data.expirationTime && (time < data.expirationTime || data
							.expirationTime ==
							'infinity')) {
						console.log('data2', data.storageData)
						res(data.storageData)
					} else if (time > data.expirationTime) {
						rej({
							msg: '数据超过有效期'
						})
						uni.removeStorage(storageKey);
					} else {
						rej({
							msg: '错误'
						})
					}
				},
				fail: (e) => {
					console.error('getStorage', e)
					rej({
						msg: '错误'
					})
				}
			});
		}
	})
}

/**
 * @param {String} name 存储信息名称
 * @param {Object} parmas 存储参数
 * @param {Object} option 配置项
 * {expirationTime:string,sync:boolean} 过期毫秒数(默认不过期)，是否使用同步(默认使用异步)
 */
export const saveStorage = function(name, parmas = {}, option = {}) {
	// 存储信息，默认事件是长期的
	let saveParmas = {
		storageData: parmas,
	}
	if (option.expirationTime) {
		saveParmas.expirationTime = getServerTimeStamp() + option.expirationTime // 过期时间毫秒
	} else {
		saveParmas.expirationTime = 'infinity'
	}
	// 默认使用异步
	return setStorageFunction(name, saveParmas, option.sync || false)
}

/**
 * @param {String} name 存储信息名称
 * @param {Object} option 配置项
 * {sync:boolean} 过期毫秒数(默认不过期)，是否使用同步(默认使用异步)
 */
export const queryStorage = function(name, option = {}) {
	// 默认使用异步
	return getStorageFunction(name, option.sync || false)
}
