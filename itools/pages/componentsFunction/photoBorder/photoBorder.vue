<template>
	<view class="photoBorder-page">
		<view class="canvas-wrapper" :style="{ width: photoDrawInfo.width + 'px', height: photoDrawInfo.height + 'px' }">
			<canvas
				:height="photoDrawInfo.height"
				:width="photoDrawInfo.width"
				:style="{ width: photoDrawInfo.width + 'px', height: photoDrawInfo.height + 'px' }"
				id="canvas"
				canvas-id="canvas"
				@click="onUpdatedFile"
			></canvas>
		</view>
		<view class="downLoadBtn"><u-button text="下载图片" size="normal" type="info" @click="saveImage"></u-button></view>
	</view>
</template>

<script>
import { getImageData, getFloatLocationByExif } from '@/util/js_sdk/izExif/izExif.js';
import tools from '@/util/tools/index.js';
import { mapGetters, mapMutations } from 'vuex';
import { EXIFLIST, textEXIFINFO, imgEXIFINFO } from './dataStructure.js';
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
	data() {
		return {
			saveImgUrl: '', // 保存图片的临时地址
			photoConfigData: [], // 图片基础logo信息
			defaultLogo: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-915d01a8-6118-4e1e-840f-697d960cbba2/707e5b40-8353-401d-8b20-f20679182fa4.png',
			photoExifInfo: {}, // 图片EXIF信息
			userInfo: {}, // 用户信息
			photoDrawList: [], // 用于图片绘制的历史列表
			// canvas标签配置
			canvasConfig: {
				maxCanvasSize: 320,
				maxCanvasInfoWrapperSize: 50,
				scale: 1
			},
			// 用于图片绘制的信息
			photoDrawInfo: {
				width: 320,
				height: 240,
				background: '#fff', // 背景颜色
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
						content: '', // 图片焦段 光圈 快门 iso信息
						fontStyle: '', // 优先级为120
						fontColor: '#000000', // 颜色 优先级为110
						fontSize: 10 // 字体颜色 优先级为110
					},
					machineName: {
						xAxis: 0, // x轴偏移
						yAxis: 0, // y轴偏移
						content: '', // 机器名称
						fontStyle: '', // 优先级为120
						fontColor: '#000000', // 颜色 优先级为110
						fontSize: 10 // 字体颜色 优先级为110
					},
					time: {
						xAxis: 0, // x轴偏移
						yAxis: 0, // y轴偏移
						content: '', // 时间
						fontStyle: '', // 优先级为120
						fontColor: '#9f9f9f', // 颜色 优先级为110
						fontSize: 8 // 字体颜色 优先级为110
					},
					authorName: {
						xAxis: 0, // x轴偏移
						yAxis: 0, // y轴偏移
						content: '',
						fontStyle: '', // 优先级为120
						fontColor: '#9f9f9f', // 颜色 优先级为110
						fontSize: 8 // 字体颜色 优先级为110
					},
					brandLogo: {
						xAxis: 320, // x轴偏移
						yAxis: 320, // y轴偏移
						content: '', // 图片映射
						xPosition: 'center',
						yPosition: 'center'
					}
				}
			}
		};
	},
	mounted() {
		this.getPhotoConfigList();
	},
	methods: {
		...mapMutations(['setUserInfo']),
		getPhotoConfigList() {
			let that = this;
			const db = uniCloud.database();
			db.collection('photoBorder-config-list')
				.get()
				.then(({ result }) => {
					// res 为数据库查询结果
					console.log('配置加载完成');
					that.photoConfigData = result.data;
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
		// 点击重新上传图片
		async onUpdatedFile() {
			let that = this;
			try {
				await that.getUserInfo();
				await uni.chooseImage({
					sizeType: ['original'],
					success: async e => {
						uni.showLoading({
							title: '开始绘制'
						});
						let src = e.tempFilePaths[0];
						that.photoDrawInfo.mainImage.content = src;
						await that.getCanvasSize(src);
						setTimeout(function() {
							getImageData(src)
								.then(res => {
									// console.log('getImageData', JSON.stringify(res.exif));
									that.photoExifInfo = res.exif;
									that.initExifCanvasInfo(res.exif);
									that.startDraw();
								})
								.catch(e => {
									console.log('getImageData error', e);
									that.startDraw();
								});
						}, 1000);
					}
				});
				uni.hideLoading();
			} catch (e) {
				//TODO handle the exception
				uni.showToast({
					duration: 1000,
					title: '需要使用用户信息'
				});
				uni.hideLoading();
			}
		},
		// 初始化exif的info信息到
		initExifCanvasInfo(info) {
			let that = this;
			console.log('initExifCanvasInfo');
			if (!info.FNumber || !info.ExposureTime || !info.FocalLength || !info.Make || !info.Model) {
				uni.showToast({
					icon: 'error',
					duration: 1000,
					title: '识别失败'
				});
			}
			this.photoDrawInfo.EXIFInfo.brandLogo.content = info.Make || '';
			this.photoDrawInfo.EXIFInfo.machineName.content = info.Model || '';
			this.photoDrawInfo.EXIFInfo.time.content = info.DateTimeOriginal || '';
			// this.photoDrawInfo.EXIFInfo.authorName.content = 'Photo by @' + that.userInfo.nickName;
			this.photoDrawInfo.EXIFInfo.authorName.content = 'PHOTO BY @' + that.userInfo.nickName;
			// 图片焦段 光圈 快门 iso信息
			// 结构: 28mm f/8 1/500 ISO100
			// 焦段
			let FocalLength = (info.FocalLength.numerator / info.FocalLength.denominator || '?') + 'mm ';
			// 光圈
			let FNumber = 'f/' + (info.FNumber.numerator / info.FNumber.denominator || '?') + ' ';
			// 快门
			let ExposureTime = (info.ExposureTime.numerator + '/' + info.ExposureTime.denominator || '?') + ' ';
			// iso
			let ISOSpeedRatings = 'ISO' + (info.ISOSpeedRatings || '?') + ' ';
			this.photoDrawInfo.EXIFInfo.imgInfo.content = FocalLength + FNumber + ExposureTime + ISOSpeedRatings;
		},
		// 开始绘制
		async startDraw() {
			let that = this;
			console.log('开始绘制');
			let { photoDrawInfo } = this;
			let { mainImage, EXIFInfo } = photoDrawInfo;
			console.log('this.photoDrawInfo', JSON.stringify(this.photoDrawInfo));
			const ctx = uni.createCanvasContext('canvas');
			// 设置宽高
			console.log('cavans宽高：', photoDrawInfo.width, photoDrawInfo.height);
			ctx.width = photoDrawInfo.width;
			ctx.height = photoDrawInfo.height;
			ctx.clearRect(0, 0, 1000, 1000);
			// 设置背景颜色
			ctx.setFillStyle(photoDrawInfo.background);
			ctx.fillRect(0, 0, 1000, 1000);
			// 绘制图片
			ctx.drawImage(mainImage.content, mainImage.xAxis, mainImage.yAxis, mainImage.width, mainImage.height);
			// 绘制底部字体
			let paddingX = 8;
			let paddingY = 0;
			let fontHeight = 15;
			let fontFamily = 'gilmerRegular';
			let dividingLinePadding = 5;
			// let fontFamily = '';

			let machineNameX = paddingX + EXIFInfo.machineName.xAxis;
			let machineNameY = paddingY + mainImage.height;
			this.drawText(ctx, EXIFInfo.machineName.content, EXIFInfo.machineName.fontSize, EXIFInfo.machineName.fontColor, machineNameX, machineNameY, 200, true, '', fontFamily);

			let authorNameX = paddingX + EXIFInfo.authorName.xAxis;
			let authorNameY = paddingY + EXIFInfo.authorName.yAxis + mainImage.height + fontHeight;
			this.drawText(ctx, EXIFInfo.authorName.content, EXIFInfo.authorName.fontSize, EXIFInfo.authorName.fontColor, authorNameX, authorNameY, 200, false, '', fontFamily);

			let timeWidth = await this.getTextWidth(ctx, EXIFInfo.time.content, true, EXIFInfo.time.fontSize, fontFamily);
			let imgInfoWidth = await this.getTextWidth(ctx, EXIFInfo.imgInfo.content, false, EXIFInfo.imgInfo.fontSize, fontFamily);
			let rightWidth = timeWidth >= imgInfoWidth ? timeWidth : imgInfoWidth;
			console.log('rightWidth', rightWidth, mainImage.width);

			let imgInfoX = mainImage.width - paddingX - rightWidth + EXIFInfo.imgInfo.xAxis;
			let imgInfoY = paddingY + EXIFInfo.imgInfo.yAxis + mainImage.height;
			this.drawText(ctx, EXIFInfo.imgInfo.content, EXIFInfo.imgInfo.fontSize, EXIFInfo.imgInfo.fontColor, imgInfoX, imgInfoY, 200, true, '', fontFamily);

			let timeX = mainImage.width - paddingX - rightWidth + EXIFInfo.time.xAxis;
			let timeY = paddingY + EXIFInfo.time.yAxis + mainImage.height + fontHeight;
			this.drawText(ctx, EXIFInfo.time.content, EXIFInfo.time.fontSize, EXIFInfo.time.fontColor, timeX, timeY, 200, false, '', fontFamily);
			// 绘制 logo 分割线
			let dividingLineHeight = (EXIFInfo.InfoWrapperHeight + EXIFInfo.time.fontSize + EXIFInfo.imgInfo.fontSize) / 2;
			let dividingLineX = mainImage.width - paddingX - rightWidth - dividingLinePadding;
			let dividingLineY = mainImage.height + (EXIFInfo.InfoWrapperHeight - dividingLineHeight) / 2;

			//绘制竖线
			ctx.moveTo(dividingLineX, dividingLineY); //设置画笔开始点
			ctx.lineTo(dividingLineX, dividingLineHeight + dividingLineY); //设置画笔结束点
			ctx.strokeStyle = EXIFInfo.color; //设置画笔的颜色
			ctx.lineJoin = 'round';
			ctx.lineWidth = 0.5; //设置画笔的大小
			ctx.stroke();

			// 绘制 logo
			let logoImg = ''; // 最终使用的logo 的url
			let listImgDefault = '';
			for (let i = 0; i < this.photoConfigData.length; i++) {
				if (this.photoConfigData[i].photo_name == 'default') {
					listImgDefault = this.photoConfigData[i].photo_url;
				}
				if (
					!this.photoDrawInfo.EXIFInfo.brandLogo.content &&
					this.photoDrawInfo.EXIFInfo.brandLogo.content.toLowerCase().indexOf(this.photoConfigData[i].photo_name) >= 0
				) {
					logoImg = this.photoConfigData[i].photo_url;
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
					let newSize = that.calculationImageScaleSize({ width: logoRes.width, height: logoRes.height }, dividingLineHeight, 'height');
					let logoImgX = mainImage.width - paddingX - rightWidth - 2 * dividingLinePadding - newSize.width;
					let logoImgY = mainImage.height + (EXIFInfo.InfoWrapperHeight - dividingLineHeight) / 2;
					ctx.drawImage(logoRes.path, logoImgX, logoImgY, newSize.width, newSize.height);
					// 绘制方法
					ctx.draw();
					console.log('结束绘制');
					uni.hideLoading();
				}
			});
		},
		// 获取用户信息
		getUserInfo() {
			let that = this;
			let userInfo = {
				avatarUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIpibGEFzIzodVfuJib3BOlRIvMRHFGCTia69TFvZBB69msSJcp45dvtmv6qYibdiahcs2bDTIg5MoBWNA/132',
				city: '',
				country: '',
				gender: 0,
				language: 'zh_CN',
				nickName: 'KaiJie Tee',
				province: ''
			};
			that.userInfo = userInfo;
			this.setUserInfo(userInfo);

			// return new Promise((res,rej)=>{
			// uni.getUserProfile({
			// 	desc: '用于您的页面展示用户头像与昵称',
			// 	lang: 'zh_CN',
			// 	success: res => {
			// that.userInfo = res.userInfo;
			// this.setUserInfo(res.userInfo)
			// 		res();
			// 	},
			// 	fail: err => {
			// 		rej();
			// 	}
			// });
			// })
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
			console.log('getCanvasSize');
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
						// if (image.width >= image.height) {
						// canvas 信息
						that.photoDrawInfo.width = 320;
						that.photoDrawInfo.height = tools.formatNumber(tools.formatDecimal((image.height / image.width) * 320, 2)) + that.photoDrawInfo.EXIFInfo.InfoWrapperHeight;
						that.getImageSize(image.width, image.height);
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
		// 加载图片宽高
		getImageSize(width = null, height = null) {
			let photoDrawInfo = _.cloneDeep(this.photoDrawInfo);
			if (width && height) {
				let newSize = this.calculationImageScaleSize(
					{
						width,
						height
					},
					320
				);
				photoDrawInfo.mainImage.originWidth = newSize.width;
				photoDrawInfo.mainImage.originHeight = newSize.height;
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
				} else {
					photoDrawInfo.width += interpolation * 2;
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
		//点击保存到相册
		saveImage() {
			var _this = this;
			let { photoDrawInfo } = this;
			uni.canvasToTempFilePath({
				//将canvas生成图片
				x: 0,
				y: 0,
				width: photoDrawInfo.width,
				height: photoDrawInfo.height,
				destWidth: photoDrawInfo.width, //截取canvas的宽度
				destHeight: photoDrawInfo.height, //截取canvas的高度
				canvasId: 'canvas',
				success: res => {
					uni.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success() {
							uni.showToast({
								title: '图片已保存图片到相册',
								icon: 'none',
								duration: 2000
							});
						},
						fail() {
							uni.hideLoading();
							uni.showModal({
								content: '检测到您没打开获取信息功能权限，是否去设置打开？',
								confirmText: '确认',
								cancelText: '取消',
								success: res => {
									if (res.confirm) {
										uni.openSetting({
											success: res => {
												console.log(res);
												uni.showToast({
													title: '请重新点击分享保存图片～',
													icon: 'none'
												});
											}
										});
									} else {
										uni.showToast({
											title: '保存失败，请打开权限功能重试',
											icon: 'none'
										});
									}
								}
							});
						}
					});
				},
				fail: err => {
					console.log(err);
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.canvas-wrapper {
	margin: 24px auto;
	border: 1px dashed #ccc;
	/deep/.uni-canvas {
		width: 100%;
		height: 100%;
	}
	.stringLengthCalculation {
		position: absolute;
		opacity: 0;
		z-index: -1000;
		display: inline;
	}
}
</style>
