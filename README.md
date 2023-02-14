# 2.0.0
## feat@2.0.0

版本2.0.0功能如下：

1. 上传图片自动判断识别出图片数据，识别完成后自动按照格式填写到页面信息栏；
2. 可以调节图片信息，图片压缩率，图片样式；
3. 可以调节信息栏信息，font大小，颜色等；
4. 实现下载到手机功能

## feat@2.0.1

版本2.0.0功能如下：

优化图片渲染加载速度


# 3.0.0
## feat@3.0.0

版本3.0.0功能如下：
#### 新增：生成页面，列表页面
- 生成页面将以配置项形式进行配置信息
- 列表页面展示配置项列表
- 配置信息挂载在：[itools-oss](https://gitee.com/KevinJZheng/itools-oss) 之下
- 图片信息挂载在： [imgtg](https://imgtg.com/) 图床之下

## feat@3.1.0
#### 新增功能
- 新增黑夜模式
- 编辑信息高级功能
- 新增管理员功能输入管理员密码可以操作高级功能
- 用户信息获取改造
- 新增管理员功能输入管理员密码可以操作高级功能
#### 修复
- 主页列表加载逻辑
- 配置获取文件需要配置下载白名单和访问白名单

## feat@3.1.1
#### 新增
- 调试样式样式功能模式：
  - 1 数据配置在：/pages/photoCreater/js/demoConfig.js中；
  - 2 调试模式开关：/pages/photoCreater/index.vue文件开启设置testMode为true；
  - 3 调试完成后：将demoConfig的数据进行转换为json，使用命令为：
  ```
  JSON.stringify(config)
  ```
  - 4 同时上传tg图床的缩略图
  - 5 再设置入oss的config中后数据配置完成，修改配置信息版本，推送的gitee中
  - 6 开启测试完成
  
  获得
#### 修复
- 修复canvas底色显示错误问题

***
# 工作计划
#### v3.1.2
- [ ] 编辑信息高级功能同步调试通过
- [ ] 新增block项的shadow
#### v3.2.0
- [ ] 新增批量输出
- [ ] 新增背景图逻辑
- [ ] 新增多图添加到一个画框的编辑逻辑，例如生成列表图
#### v3.3.0
- [ ] 新增存储用户调试后的config逻辑。
- [ ] 新增列表页面手动添加config逻辑。
- [ ] 新增列表页面手动删除config，远程config不可删除。
   

   

   
