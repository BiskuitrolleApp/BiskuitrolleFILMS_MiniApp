# 2.0.0
#### feat@2.0.0

版本2.0.0功能如下：

1. 上传图片自动判断识别出图片数据，识别完成后自动按照格式填写到页面信息栏；
2. 可以调节图片信息，图片压缩率，图片样式；
3. 可以调节信息栏信息，font大小，颜色等；
4. 实现下载到手机功能

#### feat@2.0.1

1. 新增画图数据结构

   **canvas(画板)数据如下**

   | key         | 含义     | 类型                 | 默认值  | 备注                                   |
   | ----------- | -------- | -------------------- | ------- | -------------------------------------- |
   | width       | 宽       | String               | 320     |                                        |
   | height      | 高       | String               | 240     |                                        |
   | compress    | 压缩率   | String               | 100     | 压缩比例，范围为：1-100，100完全不压缩 |
   | background  | 背景颜色 | String               | #ffffff |                                        |
   | contentList | 内容列表 | Array[canvasContent] | []      |                                        |
   
   
   
**canvasContent(画板内容)数据如下**
   

   
| key          | 含义     | 类型     | 默认值  | 备注                                                  |
   | ------------ | -------- | -------- | ------- | ----------------------------------------------------- |
| id           | id       | String   | -       |                                                       |
   | width        | 宽       | String   | 0       | 数字或者auto，设为auto固定height的等比例缩放计算width |
   | height       | 高       | String   | 0       | 数字或者auto，设为auto固定width的等比例缩放计算height |
   | zindex       | 层级     | String   | 1       | 用于渲染顺序                                          |
   | scale        | 缩放     | String   | 1       | 压缩比例，范围为：1-0.1，当前元素的缩放显示           |
   | background   | 背景颜色 | String   | -       | 背景颜色，默认为空是透明                              |
   | fontStyle    | 字体样式 | String   | “”      |                                                       |
   | fontColor    | 字体颜色 | String   | #000000 |                                                       |
   | fontSize     | 字体大小 | Number   | 10      |                                                       |
   | padding      | 填充     | padding  | -       | -                                                     |
   | position     | 位置信息 | position | -       | -                                                     |
   | type         | 内容类型 | String   | text    | image 图片，text 文字，                               |
   | content      | 内容     | String   | -       | -                                                     |
   | angle        | 角度     | Number   | 0       | 角度默认为0                                           |
   | originWidth  | 原图宽   | String   | 0       | type是image时候记录图片信息原图宽                     |
   | originHeight | 原图高   | String   | 0       | type是image时候记录图片信息原图高                     |
   
   **padding(填充)数据如下**
   

   
**position(位置)数据如下**
   
**content(位置)数据如下**
   

   

   
