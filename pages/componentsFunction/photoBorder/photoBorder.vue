<template>
	<view class="photoBorder-page">
		<view class="systemPlatform" v-show="systemPlatform == 'ios'"><u-notice-bar :text="systemPlatformText" mode="closable"></u-notice-bar></view>
		<view class="canvas-wrapper">
			<view
				class="canvas-box"
				v-show="!tempImageBase64"
				:style="{ width: photoDrawInfo.width + 'px', height: photoDrawInfo.height + 'px', zoom: canvasConfig.scale }"
				@click="onUpdatedFile"
			>
				<canvas
					:height="photoDrawInfo.height"
					:width="photoDrawInfo.width"
					:style="{ width: photoDrawInfo.width + 'px', height: photoDrawInfo.height + 'px' }"
					id="canvas"
					canvas-id="canvas"
				></canvas>
			</view>
			<view
				class="canvas-box"
				v-show="tempImageBase64"
				:style="{ width: photoDrawInfo.width * canvasConfig.scale + 'px', height: photoDrawInfo.height * canvasConfig.scale + 'px' }"
				@click="onUpdatedFile"
			>
				<image :src="tempImageBase64" mode="widthFix" :style="{ width: photoDrawInfo.width * canvasConfig.scale + 'px' }" />
			</view>
		</view>
		<view class="downLoadBtn">
			<u-button text="高级" size="normal" type="info" @click="openPopup"></u-button>
			<u-button text="下载" size="normal" color="#67C23A" @click="saveImage"></u-button>
		</view>
		<view class="popup-wrapper">
			<u-popup mode="bottom" closeable="true" :round="10" :show="showForm" @close="closePopup" safeAreaInsetTop="true" safeAreaInsetBottom="true">
				<info-form :data="photoDrawInfo" :visible="showForm" @close="closePopup" @change="resetPhotoInfo" :logoList="photoConfigData"></info-form>
			</u-popup>
		</view>
	</view>
</template>

<script>
import { getImageData, getFloatLocationByExif } from '@/util/js_sdk/izExif/izExif.js';
import tools from '@/util/tools/index.js';
import { mapGetters, mapMutations } from 'vuex';
import { EXIFLIST, textEXIFINFO, imgEXIFINFO } from './api/dataStructure.js';
import infoForm from './components/form.vue';
import _ from 'lodash';
uni.loadFontFace({
	global: true,
	family: 'gilmerRegular',
	source: 'url("https://vkceyugu.cdn.bspapp.com/VKCEYUGU-915d01a8-6118-4e1e-840f-697d960cbba2/fb5d1790-57b8-4ae5-a1ab-f6bf975ea055.otf")',
	scopes: ['webview', 'native'],
	success: function(res) {
		console.log('字体加载完成');
	},
	fail: function(error) {
		console.log('字体加载失败', error);
	}
});
export default {
	components: {
		infoForm
	},
	data() {
		return {
			systemPlatform: 'devtools',
			systemPlatformText: 'ios由于安全会擦除图片信息，无法正常识别图片的参数',
			showQuality: 0.01,
			showForm: false,
			saveImgUrl: '', // 保存图片的临时地址
			photoConfigData: [], // 图片基础logo信息
			defaultLogo: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-915d01a8-6118-4e1e-840f-697d960cbba2/47e9cb99-42e4-4b8b-8447-c8597ea8b5b2.png',
			photoExifInfo: {}, // 图片EXIF信息
			userInfo: {}, // 用户信息
			photoDrawList: [], // 用于图片绘制的历史列表
			tempImage: '', // 临时文件
			tempImageBase64: '', // 临时文件base64
			loading: false,
			// canvas标签配置
			canvasConfig: {
				maxCanvasSize: 320,
				maxCanvasInfoWrapperSize: 30,
				scale: 1
			},
			// 用于图片绘制的信息
			photoDrawInfo: {
				width: 320,
				height: 240,
				compress: 100,
				background: '#ffffff', // 背景颜色
				mainImage: {
					scale: 1, // 缩放比例 1-0.5也就是整个wrapper的100%和50%
					customAngle: 0, // 自定义旋转角度
					// customXAxis: null, // 自定义x轴偏移
					// customYAxis: null, // 自定义y轴偏移
					position: 'center', // 位置 优先级低于customXAxis，customYAxis

					content: '', // 图片数据
					originWidth: 100,
					originHeight: 100,
					width: 100,
					height: 100,
					xAxis: 0, // x轴偏移：由position和customXAxis决定
					yAxis: 0, // x轴偏移：由position和customYAxis决定
					angle: 0 // 旋转角度
				},
				EXIFInfo: {
					InfoWrapperHeight: 30,
					fontStyle: '', // 优先级为20
					fontColor: '#000000', // 颜色 优先级为10
					color: '#9f9f9f', // 颜色 优先级为10
					fontSize: 10, // 字体颜色 优先级为10
					secondFontSize: 8, // 字体颜色 优先级为9
					imgInfo: {
						xAxis: 0, // x轴偏移
						yAxis: 0, // y轴偏
						content: 'focal, fnumber, exposure, ISO', // 图片焦段 光圈 快门 iso信息
						fontStyle: '', // 优先级为120
						fontColor: '#000000', // 颜色 优先级为110
						fontSize: 8 // 字体颜色 优先级为110
					},
					machineName: {
						xAxis: 0, // x轴偏移
						yAxis: 0, // y轴偏移
						content: 'machine name', // 机器名称
						fontStyle: '', // 优先级为120
						fontColor: '#000000', // 颜色 优先级为110
						fontSize: 8 // 字体颜色 优先级为110
					},
					time: {
						xAxis: 0, // x轴偏移
						yAxis: 0, // y轴偏移
						content: '时间', // 时间
						fontStyle: '', // 优先级为120
						fontColor: '#9f9f9f', // 颜色 优先级为110
						fontSize: 6 // 字体颜色 优先级为110
					},
					authorName: {
						xAxis: 0, // x轴偏移
						yAxis: 0, // y轴偏移
						content: 'PHOTO BY @ ？',
						fontStyle: '', // 优先级为120
						fontColor: '#9f9f9f', // 颜色 优先级为110
						fontSize: 6 // 字体颜色 优先级为110
					},
					brandLogo: {
						xAxis: 0, // x轴偏移
						yAxis: 0, // y轴偏移
						content: 'default', // 图片映射
						xPosition: 'center',
						yPosition: 'center'
					}
				}
			}
		};
	},
	mounted() {
		this.getPlatform();
		this.getPhotoConfigList();
		// setTimeout(() => {
		// 	this.showForm = true;
		// }, 50);
	},
	methods: {
		...mapMutations(['setUserInfo']),
		getPlatform() {
			let that = this;
			uni.getSystemInfo({
				success: function(res) {
					console.log('getSystemInfo', res);
					that.systemPlatform = res.platform;
				}
			});
		},
		// 获取用户信息
		getUserInfo(callback) {
			let that = this;
			console.log(that.userInfo);
			if (that.userInfo.nickName) {
				console.log(that.userInfo);
				if (callback && typeof callback == 'function') {
					callback();
				}
			}
			uni.showLoading({
				title: '获取用户信息',
				duration: 15000,
				mask: true
			});
			uni.getStorage({
				key: 'userInfo',
				success: function({ data }) {
					let time = new Date().getTime();
					if (data.expirationTime && time < data.expirationTime) {
						that.userInfo = data.userInfo;
						if (callback && typeof callback == 'function') {
							callback();
						}
					} else {
						that.getUserProfile(callback);
					}
					uni.hideLoading();
				},
				fail: () => {
					that.getUserProfile(callback);
					uni.hideLoading();
				}
			});
		},
		getUserProfile(callback) {
			let that = this;
			uni.getUserProfile({
				desc: '用于您的页面展示用户头像与昵称',
				lang: 'zh_CN',
				success: resData => {
					(that.userInfo = resData.userInfo),
						uni.setStorageSync('userInfo', {
							userInfo: resData.userInfo,
							expirationTime: new Date().getTime() + 1 * 60 * 60 * 1000 // 过期时间为1小时
						});
					if (callback && typeof callback == 'function') {
						callback();
					}
				},
				fail: () => {
					uni.setStorageSync('userInfo', {});
					uni.showToast({
						title: '获取用户失败',
						icon: 'none'
					});
					if (callback && typeof callback == 'function') {
						callback();
					}
				}
			});
		},
		// 获得配置信息
		getPhotoConfigList() {
			let that = this;
			uni.getStorage({
				key: 'photoConfigData',
				success: function({ data }) {
					let time = new Date().getTime();
					if (data.expirationTime && time < data.expirationTime) {
						that.photoConfigData = data.data;
					} else {
						// #ifdef MP-WEIXIN
						that.getPhotoConfigListByWXDB();
						// #endif
						// #ifdef MP-ALIPAY
						that.getPhotoConfigListByDB();
						// #endif
					}
				},
				fail: () => {
					// #ifdef MP-WEIXIN
					that.getPhotoConfigListByWXDB();
					// #endif
					// #ifdef MP-ALIPAY
					that.getPhotoConfigListByDB();
					// #endif
				}
			});
		},
		// 获得配置信息，从数据库中请求
		getPhotoConfigListByDB() {
			let that = this;
			const db = uniCloud.database();
			console.log('数据库中获取');
			db.collection('photo_broder_logo_list')
				.get()
				.then(({ result }) => {
					// res 为数据库查询结果
					console.log('配置加载完成');
					let list = result.data;
					list = _.sortBy(list, function(o) {
						return o.sort_key;
					});
					that.photoConfigData = list;
					uni.setStorageSync('photoConfigData', {
						data: list,
						expirationTime: new Date().getTime() + 24 * 60 * 60 * 1000 // 过期时间为1小时
					});
				})
				.catch(e => {
					that.photoConfigData = [];
					uni.showToast({
						icon: 'error',
						duration: 1000,
						title: '配置加载失败'
					});
				});
		},
		async getPhotoConfigListByWXDB() {
			let that = this;
			wx.cloud.init({ traceUser: true });
			const db = wx.cloud.database();
			// 1，获取数据的总个数
			let countObj = await db.collection('photo_broder_logo_list').count();
			console.log('countObj', countObj);
			let count = countObj.total || 20;
			let all = [];
			for (let i = 0; i < count; i += 20) {
				let list = await db
					.collection('photo_broder_logo_list')
					.skip(i)
					.orderBy('sort_key', 'asc')
					.get();
				console.log('list', list);
				all = all.concat(list.data);
			}
			that.photoConfigData = all;
			console.log('getPhotoConfigListByWXDB list', all);
			uni.setStorageSync('photoConfigData', {
				data: all,
				expirationTime: new Date().getTime() + 24 * 60 * 60 * 1000 // 过期时间为1小时
			});
		},
		// 点击重新上传图片
		async onUpdatedFile() {
			let that = this;
			try {
				that.getUserInfo(that.chooseImage);
				uni.hideLoading();
			} catch (e) {
				console.log('getUserInfo', e);
				uni.showToast({
					icon: 'error',
					duration: 1000,
					title: '需要用户信息'
				});
				uni.hideLoading();
			}
		},
		chooseImage() {
			let that = this;
			console.log('chooseImage');
			if (that.loading) {
				return;
			}
			uni.chooseImage({
				sizeType: ['original'],
				sourceType: ['album'],
				count: 1,
				success: async e => {
					uni.showLoading({
						title: '开始绘制',
						duration: 15000,
						mask: true
					});
					that.loading = true;
					setTimeout(() => {
						this.loading = false;
					}, 10000);
					let src = e.tempFilePaths[0];
					that.photoDrawInfo.mainImage.content = src;
					that.tempImage = '';
					that.tempImageBase64 = '';
					that.initPhotoInfo(src);
				},
				fail() {
					uni.showToast({
						title: '获取图片失败',
						icon: 'none'
					});
				}
			});
		},
		/**
		 * 初始化图片信息，重刷调用
		 */
		async initPhotoInfo(src) {
			let that = this;
			await that.getCanvasSize(src);
			setTimeout(function() {
				getImageData(src)
					.then(res => {
						console.log('getImageData', JSON.stringify(res.exif));
						that.photoExifInfo = res.exif;
						that.initExifCanvasInfo(res.exif);
						that.startDraw();
					})
					.catch(e => {
						console.log('getImageData error', e);
						that.initExifCanvasInfo();
						that.startDraw();
					});
				// var array = uni.getFileSystemManager().readFileSync(src);
				// var r = handleBinaryFile(array);
			}, 1000);
		},
		// 初始化exif的info信息到
		initExifCanvasInfo(info = {}) {
			let that = this;
			console.log('initExifCanvasInfo', info);
			if (!info.FNumber || !info.ExposureTime || !info.FocalLength || !info.Make || !info.Model) {
				uni.showToast({
					icon: 'error',
					duration: 1000,
					title: '识别失败'
				});
			}
			this.photoDrawInfo.EXIFInfo.brandLogo.content = info.Make || 'default';
			this.photoDrawInfo.EXIFInfo.machineName.content = info.Model || 'machine name';
			let time = info.DateTimeOriginal;
			if (time && time.indexOf(':') >= 4) {
				time = time.replace(':', '-');
				time = time.replace(':', '-');
			}
			let currentTime = tools.formatTime(new Date(), 'yyyy-MM-dd hh:mm:ss');
			this.photoDrawInfo.EXIFInfo.time.content = time || currentTime;
			this.photoDrawInfo.EXIFInfo.authorName.content = 'PHOTO BY @' + that.userInfo.nickName || 'User';
			// 图片焦段 光圈 快门 iso信息
			// 结构: 28mm f/8 1/500 ISO100
			// 焦段
			let FocalLength = '?mm ';
			let FNumber = 'f/? ';
			let ExposureTime = '?/?';
			let ISOSpeedRatings = ' ISO ?';
			if (info.FocalLength) {
				FocalLength = info.FocalLength + 'mm ';
			}
			if (info.FNumber && info.FNumber.numerator && info.FNumber.denominator) {
				FNumber = 'f/' + info.FNumber.numerator / info.FNumber.denominator + ' ';
			}
			if (info.ExposureTime && info.ExposureTime.numerator && info.ExposureTime.denominator) {
				ExposureTime = info.ExposureTime.numerator + '/' + info.ExposureTime.denominator;
			}
			if (info.ISOSpeedRatings) {
				ISOSpeedRatings = ISOSpeedRatings = ' ISO' + (info.ISOSpeedRatings || ' ?');
			}
			this.photoDrawInfo.EXIFInfo.imgInfo.content = FocalLength + FNumber + ExposureTime + ISOSpeedRatings;
		},
		// 重绘图片
		async resetPhotoInfo(newPhotoInfo) {
			this.tempImage = '';
			this.tempImageBase64 = '';
			this.loading = true;
			setTimeout(() => {
				this.loading = false;
			}, 10000);
			this.closePopup();
			this.photoDrawInfo = newPhotoInfo;
			uni.showLoading({
				title: '绘制中...',
				duration: 60000
			});
			await this.getCanvasSize(this.photoDrawInfo.mainImage.content);
			setTimeout(() => {
				this.startDraw();
			}, 1000);
		},
		// 开始绘制
		async startDraw() {
			let that = this;
			console.log('开始绘制');
			uni.showLoading({
				title: '绘制中...',
				duration: 60000
			});
			let { photoDrawInfo, canvasConfig } = this;
			let { mainImage, EXIFInfo } = photoDrawInfo;
			console.log('this.photoDrawInfo', JSON.stringify(this.photoDrawInfo));
			const ctx = uni.createCanvasContext('canvas');
			// 设置宽高
			console.log('cavans宽高：', photoDrawInfo.width, photoDrawInfo.height);
			// ctx.scale(canvasConfig.scale, canvasConfig.scale);
			ctx.width = photoDrawInfo.width;
			ctx.height = photoDrawInfo.height;
			ctx.clearRect(0, 0, photoDrawInfo.width, photoDrawInfo.height);
			// 设置背景颜色
			ctx.setFillStyle(photoDrawInfo.background);
			ctx.fillRect(0, 0, photoDrawInfo.width, photoDrawInfo.height);
			// 绘制图片
			// ctx.drawImage(mainImage.content, mainImage.xAxis, mainImage.yAxis, mainImage.width, mainImage.height);
			ctx.drawImage(mainImage.content, mainImage.xAxis, mainImage.yAxis, mainImage.width, mainImage.height);
			// 绘制底部字体
			let paddingX = that.calculationScaleSize(8);
			let paddingY = that.calculationScaleSize(0);
			let fontHeight = that.calculationScaleSize(15);
			let fontTopClose = that.calculationScaleSize(3);
			let fontFamily = 'gilmerRegular';
			let dividingLinePadding = that.calculationScaleSize(5);
			// let fontFamily = '';

			let machineNameX = paddingX + that.calculationScaleSize(EXIFInfo.machineName.xAxis);
			let machineNameY = paddingY + mainImage.originHeight + fontTopClose;
			this.drawText(
				ctx,
				EXIFInfo.machineName.content,
				that.calculationScaleSize(EXIFInfo.machineName.fontSize),
				EXIFInfo.machineName.fontColor,
				machineNameX,
				machineNameY,
				5000,
				true,
				'',
				fontFamily
			);
			let authorNameX = paddingX + that.calculationScaleSize(EXIFInfo.authorName.xAxis);
			let authorNameY = paddingY + that.calculationScaleSize(EXIFInfo.authorName.yAxis) + mainImage.originHeight + fontHeight;
			this.drawText(
				ctx,
				EXIFInfo.authorName.content,
				that.calculationScaleSize(EXIFInfo.authorName.fontSize),
				EXIFInfo.authorName.fontColor,
				authorNameX,
				authorNameY,
				5000,
				false,
				'',
				fontFamily
			);

			let timeWidth = await this.getTextWidth(ctx, EXIFInfo.time.content, true, that.calculationScaleSize(EXIFInfo.time.fontSize), fontFamily);
			let imgInfoWidth = await this.getTextWidth(ctx, EXIFInfo.imgInfo.content, false, that.calculationScaleSize(EXIFInfo.imgInfo.fontSize), fontFamily);
			let rightWidth = timeWidth >= imgInfoWidth ? timeWidth : imgInfoWidth;
			console.log('rightWidth', rightWidth, mainImage.width);

			let imgInfoX = mainImage.originWidth - paddingX - rightWidth + that.calculationScaleSize(EXIFInfo.imgInfo.xAxis);
			let imgInfoY = paddingY + that.calculationScaleSize(EXIFInfo.imgInfo.yAxis) + mainImage.originHeight + fontTopClose;
			this.drawText(
				ctx,
				EXIFInfo.imgInfo.content,
				that.calculationScaleSize(EXIFInfo.imgInfo.fontSize),
				EXIFInfo.imgInfo.fontColor,
				imgInfoX,
				imgInfoY,
				5000,
				true,
				'',
				fontFamily
			);
			let timeX = mainImage.originWidth - paddingX - rightWidth + that.calculationScaleSize(EXIFInfo.time.xAxis);
			let timeY = paddingY + that.calculationScaleSize(EXIFInfo.time.yAxis) + mainImage.originHeight + fontHeight;
			this.drawText(ctx, EXIFInfo.time.content, that.calculationScaleSize(EXIFInfo.time.fontSize), EXIFInfo.time.fontColor, timeX, timeY, 5000, false, '', fontFamily);
			// 绘制 logo 分割线
			let dividingLineHeight = (EXIFInfo.InfoWrapperHeight + that.calculationScaleSize(EXIFInfo.time.fontSize) + that.calculationScaleSize(EXIFInfo.imgInfo.fontSize)) / 2;
			let dividingLineX = mainImage.originWidth - paddingX - rightWidth - dividingLinePadding;
			let dividingLineY = mainImage.originHeight + (EXIFInfo.InfoWrapperHeight - dividingLineHeight) / 2;

			//绘制竖线
			ctx.moveTo(dividingLineX, dividingLineY); //设置画笔开始点
			ctx.lineTo(dividingLineX, dividingLineHeight + dividingLineY); //设置画笔结束点
			ctx.strokeStyle = EXIFInfo.color; //设置画笔的颜色
			// ctx.lineJoin = 'round';
			ctx.lineWidth = that.calculationScaleSize(0.3); //设置画笔的大小
			ctx.stroke();

			// 绘制 logo
			let logoImg = ''; // 最终使用的logo 的url
			let listImgDefault = '';
			for (let i = 0; i < this.photoConfigData.length; i++) {
				if (this.photoConfigData[i].photo_keyword == 'default') {
					listImgDefault = this.photoConfigData[i].photo_url;
				}
				if (
					this.photoDrawInfo.EXIFInfo.brandLogo.content &&
					(this.photoDrawInfo.EXIFInfo.brandLogo.content.toLowerCase().indexOf(this.photoConfigData[i].photo_keyword.toLowerCase()) >= 0 ||
						this.photoConfigData[i].photo_keyword.toLowerCase().indexOf(this.photoDrawInfo.EXIFInfo.brandLogo.content.toLowerCase()) >= 0)
				) {
					console.log('setLogo');
					logoImg = this.photoConfigData[i].photo_url;
					break;
				}
			}
			// 设置logo 的url
			if (!logoImg || logoImg == '') {
				logoImg = listImgDefault;
			} else if ((!logoImg || logoImg == '') && (!listImgDefault || listImgDefault == '')) {
				logoImg = this.defaultLogo;
			}
			console.log('logoImg', logoImg, dividingLineHeight);
			uni.getImageInfo({
				src: logoImg, //logo 图片
				success(logoRes) {
					console.log('logo width', logoRes.width);
					console.log('logo height', logoRes.height);
					let logoMaxHeight = dividingLineHeight / 2;
					if (logoRes.width / 2.3 > logoRes.height) {
						logoMaxHeight = dividingLineHeight / 3;
					}
					let newSize = that.calculationImageScaleSize({ width: logoRes.width, height: logoRes.height }, logoMaxHeight, 'height');
					let logoImgX = mainImage.originWidth - paddingX - rightWidth - 2 * dividingLinePadding - newSize.width;
					let logoImgY = mainImage.originHeight + (EXIFInfo.InfoWrapperHeight - logoMaxHeight) / 2;
					ctx.drawImage(logoRes.path, logoImgX, logoImgY, newSize.width, newSize.height);
					// 绘制方法
					ctx.draw(false, function() {
						that.saveTempImage();
					});
					console.log('结束绘制');
					uni.hideLoading();
				},
				fail() {
					// 绘制方法
					ctx.draw(false, function() {
						that.saveTempImage();
					});
					console.log('结束绘制');
					uni.hideLoading();
				}
			});
		},
		// 绘制字体
		drawText(ctx, text, fontSize = 12, color = '#000', x, y, maxWidth = 999, bold, align, fontFamily) {
			if (bold) {
				ctx.font = `bold ${fontSize}px ${fontFamily ? fontFamily : 'normal'}`;
			} else {
				ctx.font = `normal ${fontSize}px  ${fontFamily ? fontFamily : 'normal'}`;
			}
			if (align) {
				ctx.textAlign = align;
			} else {
				ctx.textAlign = 'left';
			}
			ctx.fillStyle = color;
			ctx.textBaseline = 'middle';
			// const fontHeight = 12;
			console.log('drawText', fontSize, Number(y) + Number(fontSize));
			if (ctx.measureText(text).width > maxWidth) {
				var count = 1;
				while (ctx.measureText(text.slice(0, text.length - count)).width > 693) {
					count++;
				}
				ctx.fillText(text.slice(0, text.length - (count + 1)) + '...', x, Number(y) + Number(fontSize));
			} else {
				ctx.fillText(text, x, Number(y) + Number(fontSize));
			}
		},

		// 获取canvas和图片宽高格式
		async getCanvasSize(imgSource = '') {
			let that = this;
			if (imgSource == '') {
				throw '文件格式错误';
			}
			try {
				await uni.getImageInfo({
					src: imgSource,
					success: function(image) {
						console.log('width', image.width);
						console.log('height', image.height);
						let tempWidth = image.width;
						let tempHeight = image.height;
						if (image.width > 3000) {
							tempWidth = 3000;
							tempHeight = tools.formatNumber(tools.formatDecimal((image.height / image.width) * 3000, 2));
						} else if (image.height > 3000) {
							tempHeight = 3000;
							tempWidth = tools.formatNumber(tools.formatDecimal((image.width / image.height) * 3000, 2));
						}
						// if (image.width >= image.height) {
						// canvas 信息
						that.photoDrawInfo.width = tempWidth;
						let scale = tools.formatNumber(tools.formatDecimal(320 / tempWidth, 5));
						that.canvasConfig.scale = scale;
						that.showQuality = scale;
						let maxCanvasInfoWrapperSize = that.calculationScaleSize(that.canvasConfig.maxCanvasInfoWrapperSize, that.canvasConfig.scale);
						that.photoDrawInfo.EXIFInfo.InfoWrapperHeight = maxCanvasInfoWrapperSize;
						that.photoDrawInfo.height = tempHeight + maxCanvasInfoWrapperSize;
						that.getImageSize(tempWidth, tempHeight);
					}
				});
			} catch (e) {
				//TODO handle the exception
				console.log('error', e);
			}
		},
		// 重新计算缩放后的图片px比例
		// 用于计算logo 和 主图片
		calculationImageScaleSize(option = {}, maxLength, maxType = 'width') {
			let newWidth = option.width;
			let newHeight = option.height;
			if (maxType == 'width') {
				// 图片信息
				newWidth = maxLength;
				newHeight = tools.formatNumber(tools.formatDecimal((option.height / option.width) * maxLength, 2));
			} else {
				// 图片信息
				newHeight = maxLength;
				newWidth = tools.formatNumber(tools.formatDecimal((option.width / option.height) * maxLength, 2));
			}
			return { width: newWidth, height: newHeight };
		},
		// 重新计算缩放后的px大小
		calculationScaleSize(size, scale) {
			let tempScale = scale;
			if (!tempScale || tempScale == '') {
				tempScale = this.canvasConfig.scale;
			}
			return tools.formatNumber(tools.formatDecimal(size / tempScale, 0));
		},
		// 加载图片宽高
		getImageSize(width = null, height = null) {
			let photoDrawInfo = _.cloneDeep(this.photoDrawInfo);
			if (width && height) {
				photoDrawInfo.mainImage.originWidth = width;
				photoDrawInfo.mainImage.originHeight = height;
			}
			// 初始化原图比例
			let originWidth = photoDrawInfo.mainImage.originWidth;
			let originHeight = photoDrawInfo.mainImage.originHeight;
			photoDrawInfo.mainImage.width = photoDrawInfo.mainImage.scale * photoDrawInfo.mainImage.originWidth;
			photoDrawInfo.mainImage.height = photoDrawInfo.mainImage.scale * photoDrawInfo.mainImage.originHeight;
			// 初始化坐标偏移
			photoDrawInfo.mainImage.xAxis = 0;
			photoDrawInfo.mainImage.yAxis = 0;
			if (!photoDrawInfo.mainImage.customXAxis && !photoDrawInfo.mainImage.customXAxis) {
				let tempX = (originWidth - photoDrawInfo.mainImage.width) / 2;
				let tempY = (originHeight - photoDrawInfo.mainImage.height) / 2;
				let padding = tempX >= tempY ? tempX : tempY;

				if (photoDrawInfo.mainImage.position == 'left') {
					photoDrawInfo.mainImage.yAxis = padding;
					photoDrawInfo.mainImage.xAxis = 0;
				} else if (photoDrawInfo.mainImage.position == 'right') {
					photoDrawInfo.mainImage.yAxis = padding;
					photoDrawInfo.mainImage.xAxis = padding * 2;
				} else if (photoDrawInfo.mainImage.position == 'top') {
					photoDrawInfo.mainImage.yAxis = 0;
					photoDrawInfo.mainImage.xAxis = padding;
				} else if (photoDrawInfo.mainImage.position == 'bottom') {
					photoDrawInfo.mainImage.yAxis = padding * 2;
					photoDrawInfo.mainImage.xAxis = padding;
				} else {
					photoDrawInfo.mainImage.yAxis = padding;
					photoDrawInfo.mainImage.xAxis = padding;
				}

				let interpolation = Math.abs(tempX - tempY); // 补充差值
				if (tempX > tempY) {
					photoDrawInfo.height += interpolation * 2;
					photoDrawInfo.mainImage.originHeight += interpolation * 2;
				} else {
					photoDrawInfo.width += interpolation * 2;
					photoDrawInfo.mainImage.originWidth += interpolation * 2;
				}
			}
			// if (photoDrawInfo.mainImage.customXAxis) {
			// 	photoDrawInfo.mainImage.xAxis = photoDrawInfo.mainImage.customXAxis;
			// }
			// if (photoDrawInfo.mainImage.customYAxis) {
			// 	photoDrawInfo.mainImage.yAxis = photoDrawInfo.mainImage.customYAxis;
			// }
			// 初始化旋转
			photoDrawInfo.mainImage.angle = photoDrawInfo.mainImage.customAngle;
			this.photoDrawInfo = photoDrawInfo;

			console.log('photoDrawInfo', JSON.stringify(photoDrawInfo));
		},
		getTextWidth(ctx, text, bold, fontSize = 12, fontFamily) {
			if (bold) {
				ctx.font = `bold ${fontSize}px ${fontFamily ? fontFamily : 'normal'}`;
			} else {
				ctx.font = `normal ${fontSize}px  ${fontFamily ? fontFamily : 'normal'}`;
			}
			return ctx.measureText(text).width;
		},
		saveImage() {
			let that = this;
			if (!that.photoDrawInfo.mainImage.content || that.photoDrawInfo.mainImage.content == '') {
				uni.showModal({
					title: '提示',
					content: '需要先上传图片',
					success: function(res) {
						if (res.confirm) {
							that.onUpdatedFile();
						}
					}
				});
			} else {
				that.downloadImage();
			}
		},
		//点击保存到相册
		saveTempImage() {
			console.log('saveTempImage');
			var that = this;
			let { photoDrawInfo } = this;
			uni.showLoading({
				title: '生成中...',
				duration: 6000,
				mask: true
			});
			let compressTime = tools.formatNumber(tools.formatDecimal(photoDrawInfo.compress / 100, 2));
			console.log(' photoDrawInfo.width * compressTime * this.showQuality', photoDrawInfo.width * compressTime * this.showQuality);
			uni.canvasToTempFilePath(
				{
					//将canvas生成图片
					x: 0,
					y: 0,
					width: photoDrawInfo.width,
					height: photoDrawInfo.height,
					destWidth: photoDrawInfo.width * compressTime, //截取canvas的宽度
					destHeight: photoDrawInfo.height * compressTime, //截取canvas的高度
					canvasId: 'canvas',
					success: res => {
						that.tempImage = res.tempFilePath;
						uni.canvasToTempFilePath(
							{
								//将canvas生成图片
								x: 0,
								y: 0,
								width: photoDrawInfo.width,
								height: photoDrawInfo.height,
								destWidth: photoDrawInfo.width * compressTime, //截取canvas的宽度
								destHeight: photoDrawInfo.height * compressTime, //截取canvas的高度
								canvasId: 'canvas',
								fileType: 'jpg',
								quality: this.showQuality,
								success: res2 => {
									// console.log('res.tempFilePath', res.tempFilePath);
									try {
										uni.getFileSystemManager().readFile({
											filePath: res2.tempFilePath,
											encoding: 'base64',
											success: res3 => {
												let base64 = 'data:image/jpeg;base64,' + res3.data; //不加上这串字符，在页面无法显示
												that.tempImageBase64 = base64;
											}
										});
									} catch (e) {
										//TODO handle the exception
										console.log('urlTobase64', e);
									}
								},
								fail: err => {
									console.log(err);
									that.loading = false;
									uni.hideLoading();
								}
							},
							that
						);
					},
					fail: err => {
						console.log(err);
						that.loading = false;
						uni.hideLoading();
					}
				},
				that
			);
		},
		//点击保存到相册
		// downloadImage() {
		// 	var that = this;
		// 	let { photoDrawInfo } = this;
		// 	let compressTime = tools.formatNumber(tools.formatDecimal(photoDrawInfo.compress / 100, 2));
		// 	if (photoDrawInfo.width * compressTime > 3000 || photoDrawInfo.height * compressTime > 3000) {
		// 		uni.showLoading({
		// 			title: '文件较大，下载中...',
		// 			duration: 60000,
		// 			mask: true
		// 		});
		// 	} else {
		// 		uni.showLoading({
		// 			title: '下载中...',
		// 			duration: 15000,
		// 			mask: true
		// 		});
		// 	}
		// 	uni.canvasToTempFilePath(
		// 		{
		// 			//将canvas生成图片
		// 			x: 0,
		// 			y: 0,
		// 			width: photoDrawInfo.width,
		// 			height: photoDrawInfo.height,
		// 			destWidth: photoDrawInfo.width * compressTime, //截取canvas的宽度
		// 			destHeight: photoDrawInfo.height * compressTime, //截取canvas的高度
		// 			canvasId: 'canvas',
		// 			success: res => {
		// 				uni.saveImageToPhotosAlbum({
		// 					filePath: res.tempFilePath,
		// 					success() {
		// 						uni.hideLoading();
		// 						uni.showToast({
		// 							title: '图片已保存图片到相册',
		// 							icon: 'none',
		// 							duration: 2000
		// 						});
		// 					},
		// 					fail() {
		// 						uni.hideLoading();
		// 						uni.showToast({
		// 							title: '保存失败，请打权限功能重试',
		// 							icon: 'none'
		// 						});
		// 					}
		// 				});
		// 				that.loading = false;
		// 				uni.hideLoading();
		// 			},
		// 			fail: err => {
		// 				console.log(err);
		// 				that.loading = false;
		// 				uni.hideLoading();
		// 			}
		// 		},
		// 		that
		// 	);
		// },
		//点击保存到相册
		downloadImage() {
			var that = this;
			let { photoDrawInfo } = this;
			let compressTime = tools.formatNumber(tools.formatDecimal(photoDrawInfo.compress / 100, 2));
			if (photoDrawInfo.width * compressTime > 3000 || photoDrawInfo.height * compressTime > 3000) {
				uni.showLoading({
					title: '文件较大，下载中...',
					duration: 60000,
					mask: true
				});
			} else {
				uni.showLoading({
					title: '下载中...',
					duration: 15000,
					mask: true
				});
			}
			uni.saveImageToPhotosAlbum({
				filePath: that.tempImage,
				success() {
					uni.hideLoading();
					uni.showToast({
						title: '图片已保存图片到相册',
						icon: 'none',
						duration: 2000
					});
				},
				fail() {
					uni.hideLoading();
					uni.showToast({
						title: '保存失败，请打权限功能重试',
						icon: 'none'
					});
				}
			});
			that.loading = false;
			uni.hideLoading();
		},

		closePopup() {
			this.showForm = false;
		},
		openPopup() {
			let that = this;
			if (!that.photoDrawInfo.mainImage.content || that.photoDrawInfo.mainImage.content == '') {
				uni.showModal({
					title: '提示',
					content: '需要先上传图片',
					success: function(res) {
						if (res.confirm) {
							that.onUpdatedFile();
						}
					}
				});
			} else {
				that.showForm = true;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.photoBorder-page {
	.canvas-wrapper {
		margin: 24px auto;
		padding-bottom: 50px;
		.canvas-box {
			margin: 0px auto;
			border: 1px dashed #ccc;
			#canvas {
				opacity: 0;
			}
			/deep/.uni-canvas {
				width: 100%;
				height: 100%;
			}
		}
	}
	.downLoadBtn {
		position: fixed;
		bottom: 0px;
		width: calc(100vw - 24px);
		padding: 12px;
		background-color: #fff;
		border-top: 1px #ebedf0 solid;
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-column-gap: 10px;
		margin-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS<11.2 */
		margin-bottom: env(safe-area-inset-bottom); /* 兼容iOS>= 11.2 */
	}
	.popup-wrapper {
		.form-wrapper {
			background-color: #fff;
			max-height: 60vh;
			height: 60vh;
			overflow-y: auto;
		}
	}
}
</style>
