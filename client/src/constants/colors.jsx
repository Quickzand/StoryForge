export default class Colors {
	static accent(level) {
		switch (level) {
			case 1:
				return "#E2BD83";
			case 2:
				return "#FF8C00";
			case 3:
				return "#FF7F50";
			case 4:
				return "#FF6347";
			case 5:
				return "#FF4500";
			case 6:
				return "#FF0000";
			default:
				return "#E2BD83";
		}
	}

	static background() {
		return "#000000";
	}

	// Returns translucent background based on alpha value (0 - 255)
	static translucentBackground() {
		return "#00000080";
	}

	static outsetBackground(level) {
		switch (level) {
			case 1:
				return "#edd7b4";
			default:
				return "#E2BD83";
		}
	}

	static borderColor() {
		return "#463319";
	}

	static error() {
		return "#FF8080";
	}
}
