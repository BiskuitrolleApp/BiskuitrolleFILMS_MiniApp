// const dataMap = [
//   ["imageMain", "imageInfo.url", { before: "", after: "" }], // 主要图片路径
//   ["Model", "imageInfo.Model", { before: "", after: "" }], // 机器品牌名称
//   ["Make", "imageInfo.Make", { before: "", after: "" }], // 机器详细标准名称
//   ["ShotInfo", "imageInfo.ShotInfo", { before: "", after: "" }], // 图片主要拍摄参数
//   ["DateTime", "imageInfo.DateTime", { before: "", after: "" }], // 拍摄时间
//   ["Author", "userInfo.author", { before: "", after: "" }], // 作者信息
// ];

const dataMap = {
  imageMain: { queryKey: "imageInfo.url", additional: { before: "", after: "" } }, // 主要图片路径
  Model: { queryKey: "imageInfo.Model", additional: { before: "", after: "" } }, // 机器品牌名称
  Make: { queryKey: "imageInfo.Make", additional: { before: "", after: "" } }, // 机器详细标准名称
  ShotInfo: { queryKey: "imageInfo.ShotInfo", additional: { before: "", after: "" } }, // 图片主要拍摄参数
  DateTime: { queryKey: "imageInfo.DateTime", additional: { before: "", after: "" } }, // 拍摄时间
  Author: { queryKey: "userInfo.author", additional: { before: "", after: "" } }, // 作者信息
};
export default dataMap;
