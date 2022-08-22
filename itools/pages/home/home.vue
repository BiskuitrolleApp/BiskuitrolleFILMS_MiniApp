<template>
	<view class="itools-home">
		<view class="list-wrap">
			<view class="list-item" v-for="(item,index) in list" @click="pushPages(item.pageIndex)">
				{{item.name}}
			</view>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				list:[{
					name:'phone',
					pageIndex:'/pages/componentsFunction/photoBorder/photoBorder'
				}]
			};
		},
		methods:{
			pushPages(path){
				uni.$u.route({
					url: path
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.itools-home{
	.list-wrap{
		margin: 20px;
		width: calc(100vw - 40px);
		background-color: #f8fcf8;
		.list-item{
			width: 100%;
			min-height: 40px;
			line-height: 40px;
			padding: 0px 12px;
		}
	}
}
</style>
