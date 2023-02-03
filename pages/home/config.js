/**
 * page 跳转的页面
 * thumbnail 缩略图
 * title 标题
 * subtitle 副标题 可以为空
 * type 右上角飘带类型 new新 hot最热
 */
const pageEntrance = [
  {
    id: "20230201162700xx01",
    page: "/pages/photoCreater/index",
    thumbnail: "https://i.imgtg.com/2023/02/01/0knWL.jpg",
    title: "通用边框",
    subtitle: "通用边框通用边框",
    type: "new",
    config: [
      {
        id: "canvas",
        child: [
          {
            type: "image",
            maxWidth: 320,
            content: "",
            input: {
              cnName: "主要图片",
              type: "ImageMain",
              id: "ImageMain",
            },
          },
          {
            content: "",
            display: "flex",
            horizontal: "space-between",
            vertical: "center",
            width: 320,
            background: "#ffffff00",
            child: [
              {
                content: "",
                maxWidth: 120,
                padding: "10",
                child: [
                  {
                    type: "text",
                    content: "",
                    font: {
                      fontSize: 10,
                      bold: true,
                    },
                    input: {
                      cnName: "型号",
                      content: "The Starry Night",
                      type: "input",
                      id: "Model",
                    },
                  },
                  {
                    type: "text",
                    content: "",
                    padding: "1 0 0 0",
                    font: {
                      fontSize: 8,
                    },
                    input: {
                      cnName: "作者",
                      content: "van Gogh",
                      type: "nickname",
                      id: "Author",
                    },
                  },
                ],
              },
              {
                maxWidth: 200,
                horizontal: "right",
                vertical: "center",
                display: "flex",
                content: "",
                padding: "10",
                child: [
                  {
                    type: "image",
                    maxHeight: 20,
                    maxWidth: 60,
                    content: "",
                    margin: "0 5 0 0",
                    input: {
                      cnName: "品牌",
                      content: "fujifilm",
                      type: "icon",
                      id: "Make",
                    },
                  },
                  {
                    type: "block",
                    border: "0 0 0 0.3 solid #000",
                    padding: "0 0 0 5",
                    child: [
                      {
                        type: "text",
                        content: "",
                        font: {
                          fontSize: 10,
                          textAlign: "right",
                          bold: true,
                        },
                        input: {
                          cnName: "拍摄信息",
                          content: "The Starry Night",
                          type: "input",
                          id: "ShotInfo",
                        },
                      },
                      {
                        type: "text",
                        content: "",
                        padding: "1 0 0 0",
                        font: {
                          fontSize: 8,
                          textAlign: "right",
                        },
                        input: {
                          cnName: "时间",
                          content: 1640966400000,
                          type: "timepicker",
                          id: "DateTime",
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
    ],
  },
];

export default {
  pageEntrance,
};
