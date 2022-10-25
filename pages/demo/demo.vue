<template>
  <view>
    <view>into demo page</view>
    <canvas id="canvas"></canvas>
  </view>
</template>

<script>
import EXIFDrawJSON from "@/libs/configCanvas";
export default {
  data() {
    return {
      demo: [
        {
          id: "canvas",
          child: [
            {
              type: "image",
              content:
                "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-915d01a8-6118-4e1e-840f-697d960cbba2/47e9cb99-42e4-4b8b-8447-c8597ea8b5b2.png",
              border: "1px solid #ccc",
            },
            {
              content: "你好朋友",
              child: [
                {
                  type: "text",
                  content: "我很好",
                },
              ],
            },
            {
              child: [
                {
                  type: "text",
                  content: "我很好3",
                },
                {
                  type: "text",
                  content: "我很好3",
                },
              ],
            },
          ],
        },
      ],
    };
  },
  mounted() {
    let ctx = uni.createCanvasContext("canvas");
    EXIFDrawJSON(ctx, this.demo);
  },
};
</script>

<style lang="scss"></style>
