import tools from "@/libs/tools/index";

let photoLogoDatabase = []; // 图片列表

// 获得配置信息，从数据库中请求
function getPhotoConfigListByDB() {
  let tempPhotoLogo = photoLogo;
  tempPhotoLogo = _.sortBy(tempPhotoLogo, function (o) {
    return o.sort_key;
  });
  uni.setStorageSync("itools-config-logoList", {
    version: "-1",
    content: tempPhotoLogo,
  });
  return tempPhotoLogo;
}

// 获得配置信息
export const getPhotoConfigList = function () {
  let photoConfigData = [];
  return new Promise((resolve, reject) => {
    uni.getStorage({
      key: "itools-config-logoList",
      success: function ({ data }) {
        if (data.content && data.content.length > 0) {
          photoConfigData = _.sortBy(data.content, function (o) {
            return o.sort_key;
          });
        } else {
          photoConfigData = getPhotoConfigListByDB();
        }
        photoLogoDatabase = photoConfigData;
        resolve(photoConfigData);
      },
      fail: () => {
        photoConfigData = getPhotoConfigListByDB();
        photoLogoDatabase = photoConfigData;
        reject(photoConfigData);
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
async function getIconContent(val) {
  let markLogoList = photoLogoDatabase;
  if (photoLogoDatabase.length == 0) {
    markLogoList = await getPhotoConfigList();
  }
  let logoImg = {};
  let listImgDefault = {};
  for (let i = 0; i < markLogoList.length; i++) {
    if (markLogoList[i].photo_keyword == "default") {
      listImgDefault = markLogoList[i];
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
    logoImg = { _id: "6304807cb4a67e4013cd2b10", photo_keyword: "default", photo_name: "默认", photo_name_en: "default", photo_original_name: "default.png", photo_url: "https://i.imgtg.com/2023/02/03/0vDSD.png", sort_key: 1000001 };
  }
  console.log("logoImg", logoImg);
  return logoImg.photo_url;
}

// 获得配置为timepicker的内容信息
function getTimePickerContent(value) {
  return timestamp2Str(value);
}

// 根据配置输入信息 更新配置信息到内容
export const setContentByInputType = async function (inputTypeConfigData = {}, additional = {}) {
  let beforeValue = additional.before || "";
  let afterValue = additional.after || "";
  let content = "";
  switch (inputTypeConfigData.type) {
    case "input":
      content = beforeValue + inputTypeConfigData.content + afterValue;
      break;
    case "nickname":
      content = beforeValue + inputTypeConfigData.content + afterValue;
      break;
    case "timepicker":
      content = beforeValue + getTimePickerContent(inputTypeConfigData.content) + afterValue;
      break;
    case "ImageMain":
      content = inputTypeConfigData.content;
      break;
    case "icon":
      content = await getIconContent(inputTypeConfigData.content);
      break;
    default:
      content = beforeValue + inputTypeConfigData.content + afterValue;
      break;
  }
  console.log("inputTypeConfigData", inputTypeConfigData, content);
  return content;
};
