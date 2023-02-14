const config = [
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
        background: "#000000ff",
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
                  color: "#ffffffff",
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
                  color: "#ffffffff",
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
                  content: "leicaCoCo",
                  type: "icon",
                  id: "Make",
                },
              },
              {
                type: "block",
                border: "0 0 0 1 solid #ffffffff",
                padding: "0 0 0 5",
                child: [
                  {
                    type: "text",
                    content: "",
                    font: {
                      fontSize: 10,
                      textAlign: "right",
                      bold: true,
                      color: "#ffffffff",
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
                      color: "#ffffffff",
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
];

export default config;
