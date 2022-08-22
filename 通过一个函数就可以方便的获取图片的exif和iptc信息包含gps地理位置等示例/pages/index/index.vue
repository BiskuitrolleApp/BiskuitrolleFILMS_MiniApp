<template>
	<view class="content">
		<button class="title" @click="click()">选择图片</button>
	</view>
</template>

<script>
	import {getImageData,getFloatLocationByExif}  from '@/js_sdk/izExif/izExif.js'
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {
			click(){
				uni.chooseImage({
					sizeType:['original'],
					success: (e) => {
						console.log(e)
						let src = e.tempFilePaths[0]
						getImageData(src).then(res=>{
							console.log('getImageData',res)
							console.log('getFloatLocationByExif',getFloatLocationByExif(res.exif))
						}).catch(e=>{
							console.log('getImageData error',e)
						})
					}
				})
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
