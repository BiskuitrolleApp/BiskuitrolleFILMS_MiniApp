<template>
	<view class="itools-home">
		<u-navbar title="个人中心" @rightClick="rightClick" :autoBack="true"></u-navbar>
		<view class="list-wrap">
			<cardItem class="list-item" :value="item" v-for="(item, index) in list">{{ item.title }}</cardItem>
		</view>
	</view>
</template>

<script>
import config from './config.js';
import cardItem from './components/cardItem.vue';
export default {
	components: {
		cardItem
	},
	data() {
		return {
			list: config.pageEntrance
		};
	},
	methods: {}
};
</script>

<style lang="scss" scoped>
.itools-home {
	.list-wrap {
		padding: 10px;
		width: calc(100vw - 20px);
		min-height: 100vh;
		background-color: #f8fcf8;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-content: flex-start;
		.list-item {
			width: 260px;
			margin-bottom: 20px;
			margin-right: 10px;
			// flex: 1;
		}
	}
}
</style>
