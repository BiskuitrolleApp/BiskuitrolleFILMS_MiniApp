<template>
	<view class="page-content">
		<view class="cu-form-group justify-between">
			<view class="" @tap="cancal()">取消</view>
			<view class="text-title">{{title}}</view>
			<view :style="{color: themeColor}" @tap="submit()">确认</view>
		</view> 
		<scroll-view scroll-y style="max-height: 600rpx;">
			<template v-if="checkedList.length">
				<block v-for="(item, index) in checkedList" :key="index">
					<view class="cu-form-group justify-between" @tap="changeCheck(item)">
						<view class="my-items-title">{{item[showParam]}}</view>
						<template v-if="item.isCheck">
							<!-- <view class="iconfont icon-duihao" :style="{color: themeColor}"></view> -->
							<u-icon name="checkmark" :color="themeColor" size="20"></u-icon>
						</template>
					</view>
				</block>
			</template>
			<template v-else>
				<view class="text-center">暂无数据～</view>
			</template>
		</scroll-view>
		<slot></slot>
	</view>
</template>

<script>
	Object.clone = (obj, func = false) => {
		if (!obj || !(obj instanceof Object) || (typeof obj == "function")) {
			if (typeof obj == "function" && func) {
				return null;
			}
			return obj;
		}
		var constructor = obj.constructor;
		var result = new constructor();
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				result[key] = Object.clone(obj[key]);
			}
		}
		return result;
	};
	/**********
	 * @author fjj
	 * @list 需要选择的列表数据，如果没有传空数组
	 * @showParam 显示字段
	 * @defaultValue 默认选中数据，数据对象格式
	 * @title 标题名称
	 * @isMultiple 是否多选，默认多选
	 * @cancel 方法 点击取消时触发
	 * @change 方法 点击确定时触发 返回selectedList数据
	 * ********/
	export default {
		props: {
			list: {
				require: true,
				type: Array,
				default () {
					return [];
				},
			},
			isMultiple: {
				require: false,
				type: Boolean,
				default: true,
			},
			showParam: {
				require: true,
				type: String,
				default: 'name',
			},
			defaultValue: {
				require: true,
				type: Array,
				default () {
					return [];
				},
			},
			title: {
				require: true,
				type: String,
			},
			color: {
				require: true,
				type: String,
				default: 'name',
			},
		},
		watch: {
			list(arr) {
				this.checkedList = Object.clone(arr);
				this.resetDefaultValueFun();
			},
		},
		computed: {

		},
		data() {
			return {
				checkedList: [],
				themeColor: this.color || '#1890FF',
			};
		},
		mounted() {
			this.checkedList = Object.clone(this.list);
			this.resetDefaultValueFun();
		},
		methods: {
			resetDefaultValueFun() {
				if (this.defaultValue.length) {
					this.defaultValue.map(arrParam => {
						for (let i = 0; i < this.checkedList.length; i++) {
							if (arrParam === this.checkedList[i][this.showParam]) {
								this.checkedList[i].isCheck = true;
								return;
							}
						}
					});
				}
			},
			resetCheckedList() {
				this.checkedList = Object.clone(this.list);
				this.resetDefaultValueFun();
			},
			cancal() {
				this.resetCheckedList();
				this.$emit("cancel");
			},
			submit() {
				this.$emit("change", {
					selectedList: this.checkedList.filter((item) => {
						return item.isCheck === true;
					}),
				})
			},
			changeCheck(item) {
				if (!this.isMultiple) {
					this.checkedList.map((item) => {
						return item.isCheck = false;
					})
				}
				item.isCheck = item.isCheck ? false : true;
				this.$forceUpdate();
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-content {
		background: #FFFFFF;
		padding: 0;
		.text-title {
			color: $uni-text-color;
		}

		.text-theme {
			//设定自己的主题色
			color:#D7C2F3
		}

		.cu-form-group {
			font-size: 30rpx;
			color: $uni-text-color;
			background-color: #ffffff;
			padding: 1rpx 30rpx;
			display: flex;
			-webkit-box-align: center;
			align-items: center;
			min-height: 100rpx;
		}

		.justify-between {
			-webkit-box-pack: justify;
			justify-content: space-between;
		}

		.text-center {
			text-align: center;
		}
	}

	//勾选符号
	// @font-face {
	// 	font-family: "iconfont";
	// 	src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAKMAAsAAAAABjQAAAJCAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCcApAXAE2AiQDCAsGAAQgBYRtBzAbggXIHpIkRaoQRWE8BAUAhAg+9vv9nmuIa1TNKpEhUQKVBCVQOoRK8vy1hHc1bfdP6w7cjv8uKbWo1L2kX+ayoTeP0Yzv40HyjuJQSNJSa9Mn7p3+CfRBRj2g3PaksSZN6gLq4kAKcC+MukhKKOOGsQtcwn0ClXplpHZGp5dZrYy1LBB3jqWx2lxYJmO5cqGo2ZuJJ7ny5CF5wzyG34//SlFLIk9ZDfu3Iybr/1VlF6T3pWPXPiFCQIdzpJjGZMRxbXpXhWBchcp0pUFsX7XBr6pSyXeJvdoF++us6mrQDRX3pHSXCpDAbY1Vi45RbyVqr+4+Vv41lNf8mPUeld/ee48O4td8LZrlbRstDQ91t8/t+uHP0te0gaUQLDR1zCstK//lVRn4WRjsDm2Zfl6mfA+e4E8oe/ZkutpyJpmqrB1M1J6hqVIlSrC/0ddYS8tp86FcywhvmZ4UqXLDZMZOI1dlBoVy66g0ZexwlSZShcgqMOkCINS7l+/T9AKRqvdOZuwncq3+UKiPClQ6jaYzq4yGU78tUSM0Qd8BxxAhd9xUH9UuopX4msyqQ34VZezEoJgrFHNjGKKcY0O8aZWIOHApAhgFj6HvC4ikcNGgnE0UdebzvO5FOUMErN42CWkIMgHdDuAwCCHuDyf1pc8vQpaETyNbumqyq5AUcyYHRTmFHuSYIezVdS/PxDZZSgjhACcJATAKZiGfTwBR/SwXMpAce0Qy0ilv9+N9Dbn1TcHXHYFKljUJe1qquEkcWxOMAQ==') format('woff2');
	// }

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.icon-duihao:before {
		content: "\e60b";
	}
</style>
