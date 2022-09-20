<template>
	<!-- <view class="photoBorder-page">
		<view class="unshow-page">
			<canvas
				:height="photoDrawInfo.originHeight"
				:width="photoDrawInfo.originWidth"
				:style="{ width: photoDrawInfo.originWidth + 'px', height: photoDrawInfo.originHeight + 'px' }"
				id="downloadCanvas"
				canvas-id="downloadCanvas"
			></canvas>
		</view>
		<view class="main-page">
			<view class="systemPlatform" v-show="systemPlatform == 'ios'"><u-notice-bar :text="systemPlatformText" mode="closable"></u-notice-bar></view>
			<view class="canvas-wrapper">
				<view
					class="canvas-box"
					v-show="!tempImageBase64"
					:style="{ width: photoDrawInfo.width + 'px', height: photoDrawInfo.height + 'px', zoom: canvasConfig.scale }"
					@click="onUpdatedFile"
				>
					<view class="iconTipBox_wrapper">
						<view class="icon_wrapper"><u-icon name="photo"></u-icon></view>
						<view class="tip">点击上传图片</view>
					</view>
					<canvas
						class="canvas"
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
				<u-popup mode="bottom" :closeable="true" :round="10" :show="showForm" @close="closePopup" :safeAreaInsetTop="true" :safeAreaInsetBottom="true">
					<info-form :data="photoDrawInfo" :visible="showForm" @close="closePopup" @change="resetPhotoInfo" :logoList="photoConfigData"></info-form>
				</u-popup>
			</view>
		</view>
	</view> -->
</template>

<script>
export default {
	data() {
		return {
			//ui start
			systemPlatform: 'devtools', // 系统类型
			systemPlatformText: 'ios由于安全会擦除图片信息，无法正常识别图片的参数', // 提示文字
			// ui end
			// 用于显示的渲染数据
			showRenderData: {},
			// 用于下载的渲染数据
			downloadRenderData: {},
			// origindata
			photoDrawInfo: {
				height: '320',
				width: '240',
				compress: '100',
				background: '#ffffff', // 背景颜色
				// 内容列表
				list: [
					{
						type: 'row',
						list: [
							{
								type: 'image',
								id: 'mainImage',
								zindex: '1',
								width: '0',
								height: '0',
								scale: '1',
								position: 'center',
								background: '',
								content: '',
								padding: '',
								xAxis: '0',
								yAxis: '0',
								angle: '0'
							}
						]
					},
					{
						type: 'row',
						list: [
							{
								type: 'col',
								padding: '',
								xAxis: '0',
								yAxis: '0',
								list: [
									{
										type: 'row',
										list: [
											{
												type: 'text',
												id: 'imageParameters',
												zindex: '2',
												width: '0',
												height: '0',
												scale: '1',
												background: '',
												content: 'focal, fnumber, exposure, ISO',
												padding: '',
												xAxis: '0',
												yAxis: '0',
												angle: '0',
												fontStyle: '', // 优先级为120
												fontColor: '#000000', // 颜色 优先级为110
												fontSize: 8 // 字体颜色 优先级为110
											},
											{
												type: 'text',
												id: 'authorName',
												zindex: '5',
												width: '0',
												height: '0',
												scale: '1',
												background: '',
												content: 'PHOTO BY @ ？',
												padding: '',
												xAxis: '0',
												yAxis: '0',
												angle: '0',
												fontStyle: '', // 优先级为120
												fontColor: '#9f9f9f', // 颜色 优先级为110
												fontSize: 6 // 字体颜色 优先级为110
											}
										]
									}
								]
							},
							{
								type: 'col',
								list: [
									{
										type: 'image',
										id: 'brandLogo',
										zindex: '6',
										width: '0',
										height: '0',
										scale: '1',
										position: 'center',
										border: '0 1 0 0',
										background: '',
										content: '',
										padding: '',
										xAxis: '0',
										yAxis: '0',
										angle: '0'
									}
								]
							},
							{
								type: 'col',
								list: [
									{
										type: 'row',
										list: [
											{
												type: 'text',
												id: 'machineName',
												zindex: '3',
												width: '0',
												height: '0',
												scale: '1',
												background: '',
												content: 'machine name',
												padding: '',
												xAxis: '0',
												yAxis: '0',
												angle: '0',
												fontStyle: '', // 优先级为120
												fontColor: '#000000', // 颜色 优先级为110
												fontSize: 8 // 字体颜色 优先级为110
											},
											{
												type: 'text',
												id: 'time',
												zindex: '4',
												width: '0',
												height: '0',
												scale: '1',
												background: '',
												content: '时间',
												padding: '',
												xAxis: '0',
												yAxis: '0',
												angle: '0',
												fontStyle: '', // 优先级为120
												fontColor: '#9f9f9f', // 颜色 优先级为110
												fontSize: 6 // 字体颜色 优先级为110
											}
										]
									}
								]
							}
						]
					}
				]
			}
		};
	}
};
</script>

<style lang="scss" scoped>
.canvas-page {
	position: relative;
	overflow: hidden;
	.unshow-page {
		position: absolute;
		left: 1000px;
	}
	.canvas-wrapper {
		position: relative;
		overflow: auto;
		margin: 24px auto;
		padding-bottom: 50px;
		position: relative;
		.canvas-box {
			margin: 0px auto;
			border: 1px dashed #ccc;
			width: 320px;
			height: 240px;
			.canvas {
				opacity: 0;
			}
			/deep/.uni-canvas {
				width: 100%;
				height: 100%;
			}
		}
		.iconTipBox_wrapper {
			opacity: 0.3;
			position: absolute;
			left: 50%;
			top: 40%;
			transform: translate(-50%, -50%);
			.icon_wrapper {
				width: 50px;
				height: 50px;
				margin: 0px auto;
				/deep/.u-icon__icon {
					font-size: 50px !important;
					line-height: 50px !important;
				}
			}
			.tip {
				text-align: center;
				font-size: 12px !important;
				line-height: 24px !important;
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
