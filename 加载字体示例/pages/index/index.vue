<template>
    <view class="content">
        <view class="text-area">
            <text class="title">{{title}}</text>
        </view>
        <view>loadFontFaceFromWeb</view>
        <button @click="loadFontFaceFromWeb">从网络加载字体</button>
        <!-- #ifdef APP-PLUS -->
        <!-- 从本地加载字体 -->
        <view>loadFontFaceFromLocal</view>
        <button @click="loadFontFaceFromLocal">从本地加载字体</button>
        <view>loadFontFaceFromCache</view>
        <button @click="loadFontFaceFromCache">从网络加载字体并缓存</button>
        <!-- #endif -->
    </view>
</template>

<script>
    const url = 'https://sungd.github.io/Pacifico.ttf'
    export default {
        data() {
            return {
                title: 'Hello'
            }
        },
        onLoad() {

        },
        methods: {
            loadFontFaceFromWeb() {
                uni.loadFontFace({
                    family: 'font-test',
                    source: `url("${url}")`
                })
            },
            // #ifdef APP-PLUS
            loadFontFaceFromLocal() {
                uni.loadFontFace({
                    family: 'font-test',
                    // 本地字体路径需转换为平台绝对路径
                    source: `url(${plus.io.convertLocalFileSystemURL('_www/static/Pacifico.ttf')})`,
                    success() {
                        console.log('success')
                    },
                    fail(e) {
                        console.log('fail')
                    }
                })
            },
            async loadFontFaceFromCache() {
                let tempFilePath
                const savedFilePath = uni.getStorageSync('Pacifico')
                const [error, res] = await uni.getSavedFileList()
                if (!error) {
                    const fileList = res.fileList
                    const file = fileList.find(file => file.filePath === savedFilePath)
                    if (file) {
                        tempFilePath = file.filePath
                    }
                }
                if (!tempFilePath) {
                    const [error, res] = await uni.downloadFile({
                        url,
                    })
                    if (!error) {
                        tempFilePath = res.tempFilePath
                        uni.saveFile({
                            tempFilePath,
                            success(res) {
                                uni.setStorage({
                                    key: 'Pacifico',
                                    data: res.savedFilePath
                                })
                            }
                        })
                    } else {
                        console.log('下载失败')
                        return
                    }
                } else {
                    console.log('使用缓存资源，跳过下载步骤')
                }
                uni.loadFontFace({
                    family: 'font-test',
                    source: `url("${plus.io.convertLocalFileSystemURL(tempFilePath)}")`
                })
            }
            // #endif
        }
    }
</script>

<style>
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: font-test;
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
