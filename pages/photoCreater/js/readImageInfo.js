import { getImageData, getFloatLocationByExif } from "@/util/js_sdk/izExif/izExif.js";
import tools from "@/util/tools/index.js";

// 初始化exif的info信息到
function initExifCanvasInfo(info = {}) {
  let that = this;
  let dataJson = {};
  console.log("initExifCanvasInfo", info);
  if (!info.FNumber || !info.ExposureTime || !info.FocalLength || !info.Make || !info.Model) {
    console.error("识别失败");
  }
  // dataJson.Make = info.Make || "default";
  dataJson.Make = info.Make || "";
  // dataJson.Model = info.Model || 'machine name';
  dataJson.Model = info.Model || "";
  let time = info.DateTimeOriginal;
  if (time && time.indexOf(":") >= 4) {
    time = time.replace(":", "-");
    time = time.replace(":", "-");
  }
  let timestamp = new Date(time).getTime();
  dataJson.DateTime = timestamp || new Date().getTime();
  // 图片焦段 光圈 快门 iso信息
  // 结构: 28mm f/8 1/500 ISO100
  // 焦段
  let FocalLength = "?mm ";
  let FNumber = "f/? ";
  let ExposureTime = "?/?";
  let ISOSpeedRatings = " ISO ?";
  if (info.FocalLength) {
    FocalLength = info.FocalLength + "mm ";
  }
  if (info.FNumber && info.FNumber.numerator && info.FNumber.denominator) {
    FNumber = "f/" + info.FNumber.numerator / info.FNumber.denominator + " ";
  }
  if (info.ExposureTime && info.ExposureTime.numerator && info.ExposureTime.denominator) {
    ExposureTime = info.ExposureTime.numerator + "/" + info.ExposureTime.denominator;
  }
  if (info.ISOSpeedRatings) {
    ISOSpeedRatings = ISOSpeedRatings = " ISO" + (info.ISOSpeedRatings || " ?");
  }
  dataJson.ShotInfo = FocalLength + FNumber + ExposureTime + ISOSpeedRatings;
  return dataJson;
}

export class ImageInfo {
  constructor(url = "") {
    console.log("new ImageInfo", url);
    this.originImage = url;
    this.imageEXIFInfo = {};
    this.$imageEXIFInfoSource = {};
  }
  getImageInfo() {
    return this.imageEXIFInfo;
  }
  computerImageInfo() {
    let imageUrl = this.originImage;
    return new Promise((resolve, reject) => {
      let infoJson = {};
      if (imageUrl == "") {
        console.error("cannot find images url by:" + imageUrl);
        this.imageEXIFInfo = infoJson;
        this.$imageEXIFInfoSource = null;
        reject();
      }
      // 使用
      getImageData(imageUrl)
        .then((res) => {
          infoJson = initExifCanvasInfo(res.exif);
          let locRes = getFloatLocationByExif(res.exif);
          if (locRes) {
            infoJson = { ...infoJson, ...locRes };
          }
          this.imageEXIFInfo = infoJson;
          this.$imageEXIFInfoSource = res.exif;
          resolve();
        })
        .catch((e) => {
          console.error("new imageInfo() getImageInfo function error", e);
          this.imageEXIFInfo = infoJson;
          this.$imageEXIFInfoSource = null;
          reject();
        });
    });
  }
}
