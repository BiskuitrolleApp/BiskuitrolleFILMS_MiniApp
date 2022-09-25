/**
 * page 跳转的页面
 * thumbnail 缩略图
 * title 标题
 * subtitle 副标题 可以为空
 * type 右上角飘带类型 new新 hot最热
 */
const pageEntrance = [{
	page: '/pages/borderList/photoBorder/index',
	thumbnail: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-915d01a8-6118-4e1e-840f-697d960cbba2/47e9cb99-42e4-4b8b-8447-c8597ea8b5b2.png', // 缩略图
	title: '通用边框',
	subtitle: '通用边框通用边框',
	type: 'new',
}, {
	page: '/pages/borderList/photoBorder2/index',
	thumbnail: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-915d01a8-6118-4e1e-840f-697d960cbba2/47e9cb99-42e4-4b8b-8447-c8597ea8b5b2.png', // 缩略图
	title: '居中边框',
	subtitle: '',
	type: 'hot',
}]

export default {
	pageEntrance
}
