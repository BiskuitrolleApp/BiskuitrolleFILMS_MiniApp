<template>
  <view class="demopage">
    <!-- <exif-canvas :value="demo"></exif-canvas> -->
    <canvas class="canvas" id="canvas" canvas-id="canvas"></canvas>
  </view>
</template>

<script>
import { EXIFDrawJSON } from "@/libs/configCanvas";
// import exifCanvas from "@/libs/EXIFCanvas";
export default {
  components: {
    // exifCanvas,
  },
  data() {
    return {
      demo: [
        {
          id: "canvas",
          child: [
            {
              type: "imageMain",
              width: 320, // 只能设置宽度
              content: "http://127.0.0.1/image/test.JPG",
              border: "1px solid #ccc",
            },
            // {
            //   content: "",
            //   display: "flex",
            //   horizontal: "space-between",
            //   vertical: "bottom",
            //   width: 320,
            //   child: [
            //     {
            //       type: "text",
            //       content: "XSXS",
            //       padding: "10 10 1 10",
            //       margin: "10 10 1 10",
            //       border: "1 4 1 1 solid #000",
            //       round: 1,
            //     },
            //     {
            //       type: "text",
            //       content: "56mm f/2.2 1/1600 ISO600",
            //       // padding: "10 10 1 10",
            //       // margin: "10 10 1 10",
            //       // border: "1px solid #000",
            //     },
            //   ],
            // },
            // {
            //   content: "",
            //   display: "flex",
            //   width: 320,
            //   horizontal: "space-between",
            //   vertical: "top",
            //   child: [
            //     {
            //       type: "text",
            //       content: "PHOTO BY KZ。",
            //       // padding: "1 10 10 10",
            //       // margin: "1 10 10 10",
            //       // border: "1px solid #000",
            //     },
            //     {
            //       type: "text",
            //       content: "2022年10月12日 22:10:11",
            //       // padding: "1 10 10 10",
            //       // margin: "1 10 10 10",
            //       // border: "1px solid #000",
            //     },
            //   ],
            // },
          ],
        },
      ],
    };
  },
  mounted() {
    let ctx = uni.createCanvasContext("canvas", this);
    EXIFDrawJSON(ctx, this, this.demo);
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
    background: rgb(229, 222, 255);
  }
}
</style>
