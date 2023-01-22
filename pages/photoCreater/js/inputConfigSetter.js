import tools from "@/libs/tools/index";
import photoLogo from "@/static/common/json/database_photoLogo.json";

let photoLogoDatabase = []; // 图片列表

// 获得配置信息，从数据库中请求
function getPhotoConfigListByDB() {
  let tempPhotoLogo = photoLogo;
  tempPhotoLogo = _.sortBy(tempPhotoLogo, function (o) {
    return o.sort_key;
  });
  // console.log("photoLogo", photoLogo, tempPhotoLogo);

  // console.log("photoLogo", photoLogo);
  // const db = uniCloud.database();
  // console.log("数据库中获取");
  // db.collection("photo_broder_logo_list")
  //   .get()
  //   .then(({ result }) => {
  //     // res 为数据库查询结果
  //     console.log("配置加载完成");
  //     let list = result.data;
  //     list = _.sortBy(list, function (o) {
  //       return o.sort_key;
  //     });
  //     that.photoConfigData = list;
  uni.setStorageSync("photoConfigData", {
    data: tempPhotoLogo,
    expirationTime: new Date().getTime() + 24 * 60 * 60 * 1000, // 过期时间为24小时
  });
  // })
  //   .catch((e) => {
  //     that.photoConfigData = [];
  //     uni.showToast({
  //       icon: "error",
  //       duration: 1000,
  //       title: "配置加载失败",
  //     });
  //   });
  return tempPhotoLogo;
}

// 获得配置信息
export const getPhotoConfigList = function () {
  return new Promise((resolve, reject) => {
    if (photoLogoDatabase.length > 0) {
      resolve(photoLogoDatabase);
    }
    uni.getStorage({
      key: "photoConfigData",
      success: function ({ data }) {
        let photoConfigData = [];
        let time = new Date().getTime();
        if (data.expirationTime && time < data.expirationTime) {
          photoConfigData = data.data;
        } else {
          photoConfigData = getPhotoConfigListByDB();
        }
        photoLogoDatabase = photoConfigData;
        resolve(photoConfigData);
      },
      fail: () => {
        photoLogoDatabase = getPhotoConfigListByDB();
        reject(photoLogoDatabase);
      },
    });
  });
};

// 时间戳转为string类型时间
function timestamp2Str(value) {
  try {
    let cDate = new Date(value);
    let newValue = tools.date2Str(cDate, "YYYY-MM-DD hh:mm:ss");
    return newValue;
  } catch (error) {
    return "";
  }
}

// 获得配置为icon的内容信息
function getIconContent(val) {
  let markLogoList = photoLogoDatabase;
  console.log("markLogoList", markLogoList);
  let logoImg = {};
  let listImgDefault = {};
  for (let i = 0; i < markLogoList.length; i++) {
    if (markLogoList[i].photo_keyword == "default") {
      listImgDefault = markLogoList;
    }
    if (val && (val.toLowerCase().indexOf(markLogoList[i].photo_keyword.toLowerCase()) >= 0 || markLogoList[i].photo_keyword.toLowerCase().indexOf(val.toLowerCase()) >= 0)) {
      logoImg = markLogoList[i];
      break;
    }
  }
  // 设置logo 的url
  if (!logoImg.photo_keyword) {
    logoImg = listImgDefault;
  } else if (!logoImg.photo_keyword && !listImgDefault.photo_keyword) {
    logoImg = {
      _id: { $oid: "6304807cb4a67e4013cd2b10" },
      photo_name: "默认",
      photo_name_en: "default",
      photo_keyword: "default",
      photo_url: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-915d01a8-6118-4e1e-840f-697d960cbba2/47e9cb99-42e4-4b8b-8447-c8597ea8b5b2.png",
      photo_original_name: "卷蛋糕.png",
    };
  }
  console.log("logoImg.photo_url", logoImg.photo_url);
  return logoImg.photo_url;
}

// 获得配置为timepicker的内容信息
function getTimePickerContent(value) {
  return timestamp2Str(value);
}

// 根据配置输入信息 更新配置信息到内容
export const setContentByInputType = function (inputTypeConfigData = {}, additional = {}) {
  let beforeValue = additional.before || "";
  let afterValue = additional.after || "";
  let content = "";
  switch (inputTypeConfigData.type) {
    case "input":
      content = beforeValue + inputTypeConfigData.content + afterValue;
      break;
    case "timepicker":
      content = beforeValue + getTimePickerContent(inputTypeConfigData.content) + afterValue;
      break;
    case "imageMain":
      content = inputTypeConfigData.content;
      break;
    case "icon":
      content = getIconContent(inputTypeConfigData.content);
      break;
    default:
      break;
  }
  return content;
};
