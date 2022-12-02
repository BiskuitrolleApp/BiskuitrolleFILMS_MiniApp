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
  config: [
    {
      id: "canvas",
      child: [
        {
          type: "imageMain",
          maxWidth: 320, // 只能设置宽度
          content: "http://127.0.0.1/image/test.JPG",
          // content: "http://127.0.0.1/image/test2.JPG",
          // border: "20 solid #ccc",
          // margin:'20',
          // padding:'20',
          // round: 10,
          input: {
            type: "imagePick",
            id: "imageMain",
          },
        },
        {
          content: "",
          display: "flex",
          horizontal: "space-between",
          vertical: "center",
          width: 320,
          child: [
            {
              content: "",
              width: 100,
              child: [
                {
                  type: "text",
                  content: "XSXS",
                  padding: "10 10 1 10",
                  font: {
                    fontSize: 8,
                    bold: true,
                  },
                  input: {
                    type: "input",
                    id: "Model",
                  },
                },
                {
                  type: "text",
                  content: "56mm f/2.2 1/1600 ISO600",
                  padding: "1 10 10 10",
                  font: {
                    fontSize: 8,
                  },
                  input: {
                    type: "input",
                    id: "pictureMessage",
                  },
                },
              ],
            },
            {
              width: 180,
              horizontal: "right",
              vertical: "center",
              display: "flex",
              // border: "1 solid #000",
              content: "66",
              margin: "0 10 0 0",
              child: [
                {
                  type: "image",
                  // height: 20, // 只能设置宽度
                  maxHeight: 20,
                  maxWidth: 60,
                  content: "http://127.0.0.1/image/fujifilm.png",
                  // content: "http://127.0.0.1/image/leica.png",
                  // marign: "0 5 0 0",
                  margin: "0 5 0 0",
                  input: {
                    type: "icon",
                    id: "brandLogo",
                  },
                },
                {
                  type: "block",
                  border: "0 0 0 0.7 solid #000",
                  margin: "0 5 0 0",
                  // border: "1 solid #000",
                  child: [
                    {
                      type: "text",
                      content: "XSXS",
                      padding: "0 0 1 5",
                      // border: "1 solid #000",
                      font: {
                        fontSize: 8,
                        textAlign: "right",
                        bold: true,
                      },
                      input: {
                        type: "input",
                        id: "userInfo",
                      },
                    },
                    {
                      type: "text",
                      content: "56mm f/2.2 1/1600 ISO600",
                      padding: "1 0 0 5",
                      // border: "1 solid #000",
                      font: {
                        fontSize: 8,
                        textAlign: "right",
                      },
                      input: {
                        type: "input",
                        id: "shotTime",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ]
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
