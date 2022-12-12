<template>
	<view class="content">
		<view class="text-area">
			<text class="title" @tap="showPopup">{{ memberSelected.length ? memberSelected.join(',') : '请选择' }}</text>
		</view>
		<uni-popup ref="popup" type="bottom" :safeAreaInsetTop="true" :safeAreaInsetBottom="true">
			<tongtong-select
				color='#D7C2F3'
				:isMultiple="isMultiple"
				:list="memberList"
				:defaultValue="memberSelected"
				showParam="name"
				@cancel="cancelFun"
				@change="memberChange"
			></tongtong-select>
		</uni-popup>
	</view>
</template>
<script>
import tongtongSelect from '@/components/tongtong-select/tongtong-select.vue';
export default {
	data() {
		return {
			isMultiple: true,
			memberSelected: ['张三'],
			//会员list数据
			memberList: []
		};
	},
	components: {
		tongtongSelect
	},
	onLoad() {
		//模拟数据加载
		setTimeout(() => {
			this.memberList = [
				{
					name: '张三',
					id: 1,
					type: 1
				},
				{
					name: '李四',
					id: 2,
					type: 2
				},
				{
					name: '王五',
					id: 3,
					type: 3
				}
			];
		}, 1500);
	},
	methods: {
		//显示
		showPopup() {
			this.$refs.popup.open();
		},
		cancelFun() {
			this.$refs.popup.close();
		},
		//多选确认后
		memberChange(callBackObj) {
			console.log(callBackObj);
			this.memberSelected = [];
			callBackObj.selectedList.map(item => {
				this.memberSelected.push(item.name);
			});
			this.cancelFun();
		}
	}
};
</script>
