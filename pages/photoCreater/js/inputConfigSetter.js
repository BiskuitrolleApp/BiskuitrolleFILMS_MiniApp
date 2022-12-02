// 获得配置为icon的内容信息
function getIconContent() {
  return 'http://127.0.0.1/image/fujifilm.png'
}
// 根据配置输入信息 更新配置信息到内容
function setContentByInputType(inputTypeConfigData = {}) {
  let content = ''
  switch (inputTypeConfigData.type) {
    case 'input':
      content = inputTypeConfigData.content
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