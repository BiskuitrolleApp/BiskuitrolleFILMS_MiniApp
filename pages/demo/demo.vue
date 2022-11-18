<template>
  <view class="demopage">
    <exif-canvas :value="demo" ref="exifCanvas"></exif-canvas>
    <view class="downLoadBtn">
      <u-button
        text="下载"
        size="normal"
        color="#67C23A"
        @click="saveImage"
      ></u-button>
    </view>
  </view>
</template>

<script>
// import { EXIFDrawJSON } from "@/libs/configCanvas";
import exifCanvas from "@/libs/EXIFCanvas";
export default {
  components: {
    exifCanvas,
  },
  data() {
    return {
      demo: [
        {
          id: "canvas",
          child: [
            {
              type: "imageMain",
              maxWidth: 200, // 只能设置宽度
              content: "http://127.0.0.1/image/test.JPG",
              // content: "http://127.0.0.1/image/test2.JPG",
              border: "20 solid #ccc",
              margin:'20',
              padding:'20',
              round: 10,
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
                      },
                    },
                    {
                      type: "text",
                      content: "56mm f/2.2 1/1600 ISO600",
                      padding: "1 10 10 10",
                      font: {
                        fontSize: 8,
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
    };
  },
  mounted() {
    // let ctx = uni.createCanvasContext("canvas");
    // EXIFDrawJSON(ctx, this, this.demo);
  },
  //方法集合
  methods: {
    saveImage() {
      this.$refs.exifCanvas.downLoader();
    },
  },
};
</script>
<style lang="scss" scoped>
.demopage {
  display: flex;
  align-items: center;
  justify-content: center;
  .canvas {
    border: 1px;
    margin: 10px;
    width: 320px;
    // background: rgb(229, 222, 255);
  }
  .downLoadBtn {
    position: fixed;
    bottom: 0px;
    width: calc(100vw - 24px);
    padding: 12px;
    background-color: #fff;
    border-top: 1px #ebedf0 solid;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 10px;
    margin-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS<11.2 */
    margin-bottom: env(safe-area-inset-bottom); /* 兼容iOS>= 11.2 */
  }
}
</style>
