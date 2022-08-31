// exif 信息对象
class EXIFINFO {
	constructor(content, type) {
		this.content = content
		this.type = type
	}
}

// 图片类型对象
module.exports = class imgEXIFINFO extends EXIFINFO {
	constructor(content) {
		super(content, 'image')
		this.img = {
			width: null,
			height: null,
			xPostion: null,
			yPostion: null,
		}
	}
}

// 文字类型对象
module.exports = class textEXIFINFO extends EXIFINFO {
	constructor(content, LIST_fontInfo) {
		super(content, 'text')
		this.font = {
			size: null,
			color: null,
			style: null,
			xPostion: null,
			yPostion: null,
		}
		if (LIST_fontInfo) {
			// 默认使用列表中的数据
			if (LIST_fontInfo.size) {
				this.font.size = LIST_fontInfo.size
			}
			if (LIST_fontInfo.color) {
				this.font.size = LIST_fontInfo.color
			}
			if (LIST_fontInfo.style) {
				this.font.size = LIST_fontInfo.style
			}
		}
	}
}

module.exports = class EXIFLIST {
	constructor() {
		this.font = {
			size: null,
			color: null,
			style: null,
		}
		this.conlmns = null
		this.list = []
	}
}
