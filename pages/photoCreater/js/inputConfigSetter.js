import tools from "@/libs/tools/index";

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
function getIconContent() {
  return 'http://127.0.0.1/image/fujifilm.png'
}
// 获得配置为timepicker的内容信息 
function getTimePickerContent(value) {
  return timestamp2Str(value)
}

// 根据配置输入信息 更新配置信息到内容
function setContentByInputType(inputTypeConfigData = {}) {
  let content = ''
  switch (inputTypeConfigData.type) {
    case 'input':
      content = inputTypeConfigData.content
      break;
    case 'timepicker':
      content = getTimePickerContent(inputTypeConfigData.content)
      break;
    case 'imageMain':
      content = inputTypeConfigData.content
      break;
    case 'icon':
      content = getIconContent(inputTypeConfigData.content)
      break;
    default:
      break;
  }
  return content;
}

export default setContentByInputType