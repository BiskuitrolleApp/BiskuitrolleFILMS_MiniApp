<template>
	<view class="photoBorder-form">
		<!-- <button @click="open">打开颜色选择器</button> -->
		<!-- 需要声明 ref  -->
		<t-color-picker ref="colorPicker" @confirm="confirmColorPicker"></t-color-picker>
		<u-form labelPosition="left" :model="formData" :rules="rules" ref="form1">
			<u-form-item label="高级" labelWidth="80" :borderBottom="!isShowMore">
				<view class="form-switch-wrapper">
					<view class="switch-box"><u-switch activeColor="#67C23A" v-model="isShowMore" @change="moreShowSwitchChange"></u-switch></view>
				</view>
			</u-form-item>
			<u-form-item label="图片质量" labelWidth="80" customStyle="padding:5px 0px">
				<view class="slider-wrapper">
					<view class="tip-wrapper tip-left">10%</view>
					<view class="slider"><u-slider v-model="compress" step="1" min="10" max="100" activeColor="#67C23A"></u-slider></view>
					<view class="tip-wrapper tip-right">100%</view>
					<view class="tip-wrapper tip-right"></view>
					<view class="inputWrapper">{{ compress }}%</view>
				</view>
			</u-form-item>
			<view v-if="isShowMore">
				<u-form-item label="背景颜色" labelWidth="80" customStyle="padding:5px 0px" :key="background">
					<view class="colorBox-wrapper">
						<view class="colorBox" @click="openColorPicker(background, ['background'])" :style="{ color: oppositeColor(background, -1), background: background }">
							{{ background }}
						</view>
					</view>
				</u-form-item>
				<u-form-item label="LOGO" labelWidth="80" customStyle="padding:5px 0px" @click="switchLogo" :key="logoInfo.photo_name_en">
					<hpy-form-select v-if="isLogoPicker" :dataList="logoList" text="photo_name" name="photo_keyword" hideBorder="true" @change="confirmLogo" islot="true">
						<view class="logo-wrapper" @click="switchLogo">
							<view class="name">{{ logoInfo.photo_name }}({{ logoInfo.photo_name_en }})</view>
							<image :src="logoInfo.photo_url" mode="heightFix"></image>
						</view>
					</hpy-form-select>
				</u-form-item>
				<u-form-item label="图片横移" labelWidth="80" customStyle="padding:5px 0px">
					<view class="slider-wrapper">
						<view class="tip-wrapper tip-left">-50</view>
						<view class="slider"><u-slider v-model="xAxis" step="1" min="-50" max="50" activeColor="#67C23A"></u-slider></view>
						<view class="tip-wrapper tip-right">50</view>
						<view class="tip-wrapper tip-right"></view>
						<view class="inputWrapper">{{ xAxis }}</view>
					</view>
				</u-form-item>
				<u-form-item label="图片纵偏" labelWidth="80" customStyle="padding:5px 0px">
					<view class="slider-wrapper">
						<view class="tip-wrapper tip-left">-50</view>
						<view class="slider"><u-slider v-model="yAxis" step="1" min="-50" max="50" activeColor="#67C23A"></u-slider></view>
						<view class="tip-wrapper tip-right">50</view>
						<view class="tip-wrapper tip-right"></view>
						<view class="inputWrapper">{{ yAxis }}</view>
					</view>
				</u-form-item>
				<u-form-item label="图片缩放" labelWidth="80" customStyle="padding:5px 0px">
					<view class="slider-wrapper">
						<view class="tip-wrapper tip-left">50%</view>
						<view class="slider"><u-slider v-model="scale" step="1" min="50" max="100" activeColor="#67C23A"></u-slider></view>
						<view class="tip-wrapper tip-right">100%</view>
						<view class="tip-wrapper tip-right"></view>
						<view class="inputWrapper">{{ scale }}%</view>
					</view>
				</u-form-item>
			</view>
			<view v-if="!isShowMore">
				<u-form-item :label="item.name" labelWidth="80" :prop="item.key" v-for="(item, index) in formModeList">
					<u--input v-model="formData[item.key].content" border="bottom" placeholder="输入信息" inputAlign="right"></u--input>
				</u-form-item>
			</view>
			<view v-else class="more-form-wrapper">
				<view class="more-form-item">
					<u-collapse accordion>
						<u-collapse-item :title="item.name" v-for="(item, index) in formModeList">
							<u-form-item label="内容" labelWidth="80" :prop="item.key">
								<u--input
									:value="formData[item.key].content"
									border="bottom"
									placeholder="输入信息"
									inputAlign="right"
									@input="
										value => {
											formData[item.key].content = value;
										}
									"
								></u--input>
							</u-form-item>
							<u-form-item label="颜色" labelWidth="80" customStyle="padding:5px 0px">
								<view class="colorBox-wrapper">
									<view
										class="colorBox"
										@click="openColorPicker(formData[item.key].fontColor, ['formData.', item.key, '.fontColor'])"
										:style="{ color: oppositeColor(formData[item.key].fontColor, -1), background: formData[item.key].fontColor }"
									>
										{{ formData[item.key].fontColor }}
									</view>
								</view>
							</u-form-item>
							<u-form-item label="字体大小" labelWidth="80" customStyle="padding:5px 0px">
								<u--input
									:value="formData[item.key].fontSize"
									placeholder="输入字体大小"
									inputAlign="right"
									type="number"
									@input="
										value => {
											formData[item.key].fontSize = value;
										}
									"
								></u--input>
							</u-form-item>
							<u-form-item label="横向偏移" labelWidth="80" customStyle="padding:5px 0px">
								<view class="slider-wrapper">
									<view class="tip-wrapper tip-left">-50</view>
									<view class="slider"><u-slider v-model="formData[item.key].xAxis" step="1" min="-50" max="50" activeColor="#67C23A"></u-slider></view>
									<view class="tip-wrapper tip-right">50</view>
									<view class="tip-wrapper tip-right"></view>
									<view class="inputWrapper">{{ formData[item.key].xAxis }}</view>
								</view>
								<!-- <u--input v-model="formData[item.key].xAxis" placeholder="输入右下角信息栏" inputAlign="right"></u--input> -->
							</u-form-item>
							<u-form-item label="纵向偏移" labelWidth="80" customStyle="padding:5px 0px">
								<view class="slider-wrapper">
									<view class="tip-wrapper tip-left">-50</view>
									<view class="slider"><u-slider v-model="formData[item.key].yAxis" step="1" min="-50" max="50" activeColor="#67C23A"></u-slider></view>
									<view class="tip-wrapper tip-right">50</view>
									<view class="tip-wrapper tip-right"></view>
									<view class="inputWrapper">{{ formData[item.key].yAxis }}</view>
								</view>
							</u-form-item>
						</u-collapse-item>
					</u-collapse>
				</view>
			</view>
			<view class="button-wrapper">
				<view class="button-item"><u-button @click="resetForm">重置</u-button></view>
				<view class="button-item"><u-button @click="submit" color="#67C23A">确认</u-button></view>
			</view>
		</u-form>
	</view>
</template>

<script>
import tColorPicker from '@/components/t-color-picker/t-color-picker.vue';
import _ from 'lodash';
import tools from '@/util/tools/index.js';
export default {
	components: {
		tColorPicker
	},
	data() {
		return {
			isShowMore: false,
			isLogoPicker: true,
			formModeList: [],
			rules: {},

			currentSettingColorKey: '',
			// form start
			compress: 24, // 图片压缩
			formData: {}, // 表单数据
			scale: 100,
			xAxis: 0,
			yAxis: 0,
			logoInfo: {},
			background: '#ffffff'
			// form end
		};
	},
	props: {
		data: {
			default: {},
			type: Object
		},
		visible: {
			default: false,
			type: Boolean
		},
		logoList: {
			default: [],
			type: Array
		}
	},
	watch: {
		visible(val) {
			if (val) {
				this.initFormData();
			}
		},
		logoList(val) {
			this.computedLogoImage(val);
		}
	},
	mounted() {
		this.initFormData();
	},
	methods: {
		computedLogoImage(val) {
			let that = this;
			let logoImg = {};
			let listImgDefault = {};
			for (let i = 0; i < val.length; i++) {
				if (val[i].photo_keyword == 'default') {
					listImgDefault = val;
				}
				if (
					this.brandLogo &&
					(this.brandLogo.toLowerCase().indexOf(val[i].photo_keyword.toLowerCase()) >= 0 || val[i].photo_keyword.toLowerCase().indexOf(this.brandLogo.toLowerCase()) >= 0)
				) {
					console.log('setLogo');
					logoImg = val[i];
					break;
				}
			}
			// 设置logo 的url
			if (!logoImg.photo_keyword) {
				logoImg = listImgDefault;
			} else if (!logoImg.photo_keyword && !listImgDefault.photo_keyword) {
				logoImg = {
					_id: { $oid: '6304807cb4a67e4013cd2b10' },
					photo_name: '默认',
					photo_name_en: 'default',
					photo_keyword: 'default',
					photo_url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-915d01a8-6118-4e1e-840f-697d960cbba2/47e9cb99-42e4-4b8b-8447-c8597ea8b5b2.png',
					photo_original_name: '卷蛋糕.png'
				};
			}
			this.logoInfo = logoImg;
			that.isLogoPicker = false;
			that.$nextTick(() => {
				that.isLogoPicker = true;
			});
		},
		/**
		 * 计算反色,
		 * @param {*} a 色值
		 * @param {*} ilighten 减弱对比度(-1 ~ -15)
		 * @returns
		 * 示例: oppositeColor("#000000", -4); 返回: #bbbbbb
		 */
		oppositeColor(a, ilighten) {
			if (!a) {
				return a;
			}
			let tempA = a.substring(1, 7);
			//var max16 = 15;
			var max16 = Math.floor(15 + (ilighten || 0));
			if (max16 < 0 || max16 > 15) max16 = 15;

			var c16,
				c10,
				b = [];

			for (var i = 0; i < tempA.length; i++) {
				c16 = parseInt(tempA.charAt(i), 16); // to 16进制
				c10 = parseInt(max16 - c16, 10); // 10进制计算
				if (c10 < 0) c10 = Math.abs(c10);
				b.push(c10.toString(16)); // to 16进制
			}
			return '#' + b.join('');
		},
		// 页面出现初始化表单
		initFormData() {
			let that = this;
			let tempData = _.cloneDeep(this.data);
			let tempForm = tempData.EXIFInfo;

			console.log('initFormData');
			this.formData = {
				imgInfo: tempForm.imgInfo,
				machineName: tempForm.machineName,
				time: tempForm.time,
				authorName: tempForm.authorName
			};
			this.compress = tempData.compress;
			this.scale = tempData.mainImage.scale * 100;
			this.xAxis = tempData.mainImage.xAxis;
			this.yAxis = tempData.mainImage.yAxis;
			this.background = tempData.background;
			this.brandLogo = tempForm.brandLogo.content || 'default';
			this.formModeList = [
				{
					key: 'machineName',
					name: '机型(左上)'
				},
				{
					key: 'imgInfo',
					name: '参数(右上)'
				},
				{
					key: 'authorName',
					name: '作者(左下)'
				},
				{
					key: 'time',
					name: '时间(右下)'
				}
			];
			this.computedLogoImage(this.logoList);
		},
		resetForm() {
			this.initFormData();
			this.isShowMore = true;
			this.isShowMore = false;
		},
		submit() {
			console.log('formData', this.formData);
			let tempData = _.cloneDeep(this.data);
			let tempForm = tempData.EXIFInfo;
			tempData.EXIFInfo.imgInfo = this.formData.imgInfo;
			tempData.EXIFInfo.machineName = this.formData.machineName;
			tempData.EXIFInfo.time = this.formData.time;
			tempData.EXIFInfo.authorName = this.formData.authorName;
			tempData.compress = this.compress;
			tempData.mainImage.scale = tools.formatNumber(tools.formatDecimal(this.scale / 100, 2));
			tempData.mainImage.xAxis = this.xAxis;
			tempData.mainImage.yAxis = this.yAxis;
			tempData.background = this.background;
			tempData.EXIFInfo.brandLogo.content = this.brandLogo;

			this.$emit('change', tempData);
		},
		openColorPicker(data, keyList) {
			this.color = data;
			let key = keyList.join('');
			this.currentSettingColorKey = key;
			// 打开颜色选择器
			this.$refs.colorPicker.open(data);
		},
		confirmColorPicker(data) {
			_.set(this, this.currentSettingColorKey, data.hex);
		},
		// 打开高级选项
		moreShowSwitchChange(val) {
			this.initFormData();
			this.isShowMore = val;
		},
		switchLogo() {
			this.isLogoPicker = true;
		},
		confirmLogo(val) {
			let that = this;
			console.log('confirmLogo', val);
			this.logoInfo = val.data;
			this.brandLogo = val.value;

			that.isLogoPicker = false;
			that.$nextTick(() => {
				that.isLogoPicker = true;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.photoBorder-form {
	padding: 6px 24px;
	max-height: 80vh;
	overflow-y: auto;
	.form-switch-wrapper {
		display: flex;
		justify-content: flex-end;
		.switch-box {
			display: inline-block;
		}
	}
	.inputWrapper {
		/deep/.u-input__content__field-wrapper__field {
			text-align: right !important;
		}
	}
	.button-wrapper {
		.button-item {
			margin-top: 8px;
			margin-bottom: 8px;
		}
	}
	.colorBox-wrapper {
		display: flex;
		justify-content: flex-end;
		.colorBox {
			display: inline-block;
			height: 18px;
			font-size: 14px;
			padding: 4px 8px;
			border-radius: 2px;
			border: 1px solid rgb(214, 215, 217);
			// -webkit-text-stroke: 1px  #000;
			// text-stroke: 1px #000;
			font-weight: 600;
		}
	}
	.slider-wrapper {
		width: 100%;
		display: flex;
		align-content: center;
		justify-content: center;
		.tip-wrapper {
			flex: 1;
			line-height: 38px;
		}
		.slider {
			flex: 5;
		}
		.inputWrapper {
			text-align: right;
			flex: 1;
			line-height: 38px;
		}
	}
	.logo-wrapper {
		height: 40px;
		display: flex;
		align-content: center;
		justify-content: flex-end;
		align-items: center;
		.name {
			font-size: 14px;
			line-height: 40px;
			margin: 0px 10px;
		}
		image {
			height: 16px;
		}
	}
	.more-form-wrapper {
		.more-form-item {
			background-color: #fff;
			.u-line {
				margin: 0px;
				border-bottom: 1px solid rgb(214, 215, 217);
				width: 100%;
				transform: scaleY(0.5);
				border-top-color: rgb(214, 215, 217);
				border-right-color: rgb(214, 215, 217);
				border-left-color: rgb(214, 215, 217);
			}
		}
		.title {
			font-size: 18px;
			line-height: 28px;
			color: #8f9ca2;
			margin-top: 8px;
			display: flex;
			flex-direction: row;
		}
	}
}
</style>
