import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "alink:hover": {
        "backgroundColor": "#67b6f4",
        "color": "white",
        "textDecoration": "none",
        "fontSize": 18
    }
});