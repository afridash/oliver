import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "*": {
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0,
        "paddingTop": 0,
        "paddingRight": 0,
        "paddingBottom": 0,
        "paddingLeft": 0
    },
    "body": {
        "fontFamily": "'Raleway', sans-serif",
        "overflowY": "scroll",
        "overflowX": "hidden"
    },
    "p": {
        "fontFamily": "'Raleway', sans-serif",
        "fontSize": 14
    },
    "section_title": {
        "paddingTop": 90,
        "paddingBottom": 50
    },
    "section_title h2": {
        "textTransform": "uppercase",
        "textAlign": "center",
        "position": "relative",
        "color": "#333",
        "fontSize": 30,
        "fontWeight": "400"
    },
    "section_title h2:after": {
        "content": "",
        "position": "absolute",
        "bottom": -20,
        "width": 60,
        "height": 1,
        "backgroundColor": "#f39c12",
        "left": "50%",
        "marginLeft": -30
    },
    "section_title p": {
        "textAlign": "center",
        "marginTop": 45,
        "color": "#333",
        "fontSize": 18,
        "lineHeight": 28,
        "fontWeight": "300"
    },
    "parallax": {
        "backgroundAttachment": "fixed !important",
        "backgroundPosition": "center center",
        "backgroundRepeat": "no-repeat",
        "backgroundSize": "cover"
    },
    "header h2": {
        "height": 0,
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0
    },
    "navbar": {
        "marginTop": -100
    },
    "navbar-brand": {
        "paddingTop": 9,
        "paddingRight": 15,
        "paddingBottom": 9,
        "paddingLeft": 15
    },
    "navbar-default navbar-nav>active>a": {
        "background": "transparent",
        "color": "#f39c12"
    },
    "navbar-default navbar-nav>active>a:hover": {
        "background": "transparent",
        "color": "#f39c12"
    },
    "navbar-default navbar-nav>active>a:focus": {
        "background": "transparent",
        "color": "#f39c12"
    },
    "header": {
        "background": "url(../images/home.jpg)",
        "backgroundSize": "cover",
        "backgroundRepeat": "no-repeat"
    },
    "header section_overlay": {
        "backgroundColor": "rgba(33, 33, 33, .75)"
    },
    "logo": {
        "paddingBottom": 50
    },
    "home_text": {
        "textAlign": "left"
    },
    "home-iphone": {
        "textAlign": "right"
    },
    "home-iphone img": {
        "width": "100%"
    },
    "home_text h1": {
        "color": "#fff",
        "textTransform": "uppercase",
        "fontSize": 60,
        "fontWeight": "300",
        "lineHeight": 45,
        "paddingTop": 30
    },
    "home_text p": {
        "color": "#fff",
        "fontSize": 40,
        "lineHeight": 28,
        "marginTop": 0,
        "fontWeight": "300"
    },
    "download-btn": {
        "marginTop": 90,
        "marginBottom": 50
    },
    "home-btn": {
        "background": "transparent",
        "borderColor": "#f39c12",
        "color": "#f39c12",
        "paddingTop": 10,
        "paddingBottom": 10,
        "paddingLeft": 30,
        "paddingRight": 30,
        "fontSize": 19,
        "textTransform": "uppercase",
        "borderRadius": 3,
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "home-btn:focus": {
        "background": "transparent",
        "borderColor": "#f39c12",
        "color": "#f39c12",
        "paddingTop": 10,
        "paddingBottom": 10,
        "paddingLeft": 30,
        "paddingRight": 30,
        "fontSize": 19,
        "textTransform": "uppercase",
        "borderRadius": 3,
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "home-btn:active": {
        "background": "transparent",
        "borderColor": "#f39c12",
        "color": "#f39c12",
        "paddingTop": 10,
        "paddingBottom": 10,
        "paddingLeft": 30,
        "paddingRight": 30,
        "fontSize": 19,
        "textTransform": "uppercase",
        "borderRadius": 3,
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "home-btn:visited": {
        "background": "transparent",
        "borderColor": "#f39c12",
        "color": "#f39c12",
        "paddingTop": 10,
        "paddingBottom": 10,
        "paddingLeft": 30,
        "paddingRight": 30,
        "fontSize": 19,
        "textTransform": "uppercase",
        "borderRadius": 3,
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "home-btn:hover": {
        "backgroundColor": "#f39c12",
        "color": "#fff"
    },
    "tuor": {
        "color": "#A9ADB0",
        "marginLeft": 20,
        "textTransform": "uppercase",
        "fontSize": 19,
        "fontWeight": "500",
        "background": "transparent",
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "tuor:focus": {
        "color": "#A9ADB0",
        "marginLeft": 20,
        "textTransform": "uppercase",
        "fontSize": 19,
        "fontWeight": "500",
        "background": "transparent",
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "tuor:active": {
        "color": "#A9ADB0",
        "marginLeft": 20,
        "textTransform": "uppercase",
        "fontSize": 19,
        "fontWeight": "500",
        "background": "transparent",
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "tuor:visited": {
        "color": "#A9ADB0",
        "marginLeft": 20,
        "textTransform": "uppercase",
        "fontSize": 19,
        "fontWeight": "500",
        "background": "transparent",
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "tuor:hover": {
        "color": "#fff"
    },
    "tuor i": {
        "fontSize": 20,
        "paddingLeft": 5,
        "color": "#f39c12"
    },
    "about": {
        "background": "#F1F1F1"
    },
    "inner_about_area": {
        "paddingTop": 50
    },
    "inner_about_title": {
        "paddingBottom": 50
    },
    "inner_about_title h2": {
        "textTransform": "uppercase",
        "fontWeight": "800",
        "fontSize": 30,
        "lineHeight": 37,
        "position": "relative"
    },
    "inner_about_title h2:after": {
        "content": "",
        "position": "absolute",
        "bottom": -12,
        "left": 0,
        "width": 70,
        "background": "#f39c12",
        "height": 1
    },
    "inner_about_title p": {
        "fontSize": 19,
        "lineHeight": 24,
        "marginTop": 40
    },
    "inner_about_desc": {},
    "single_about_area": {
        "position": "relative",
        "paddingBottom": 4,
        "paddingLeft": 80
    },
    "single_about_area div": {
        "position": "absolute",
        "top": 0,
        "left": 0
    },
    "single_about_area div i": {
        "fontSize": 55,
        "color": "#BABABA",
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "single_about_area h3": {
        "color": "#343434",
        "textTransform": "uppercase",
        "fontSize": 20,
        "fontWeight": "800"
    },
    "single_about_area p": {
        "color": "#727272",
        "fontSize": 15
    },
    "single_about_area:hover div i": {
        "color": "#f39c12"
    },
    "about_phone img": {},
    "video_area": {
        "background": "#e4e4e4",
        "paddingBottom": 140,
        "paddingTop": 120
    },
    "video_title": {
        "paddingBottom": 30
    },
    "video_title h2": {
        "textTransform": "uppercase",
        "fontWeight": "800",
        "fontSize": 30,
        "lineHeight": 37,
        "position": "relative",
        "marginTop": 0
    },
    "video_title h2:after": {
        "content": "",
        "position": "absolute",
        "bottom": -12,
        "left": 0,
        "width": 70,
        "background": "#f39c12",
        "height": 1
    },
    "video_title p": {
        "fontSize": 18,
        "lineHeight": 28,
        "marginTop": 40,
        "color": "#333",
        "fontWeight": "300"
    },
    "btn-video": {
        "background": "transparent",
        "border": "1px solid #929292",
        "color": "#686868",
        "borderRadius": 3,
        "paddingTop": 12,
        "paddingRight": 35,
        "paddingBottom": 12,
        "paddingLeft": 35,
        "textTransform": "uppercase",
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "btn-video:active": {
        "background": "transparent",
        "border": "1px solid #929292",
        "color": "#686868",
        "borderRadius": 3,
        "paddingTop": 12,
        "paddingRight": 35,
        "paddingBottom": 12,
        "paddingLeft": 35,
        "textTransform": "uppercase",
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "btn-video:focus": {
        "background": "transparent",
        "border": "1px solid #929292",
        "color": "#686868",
        "borderRadius": 3,
        "paddingTop": 12,
        "paddingRight": 35,
        "paddingBottom": 12,
        "paddingLeft": 35,
        "textTransform": "uppercase",
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "btn-video:visited": {
        "background": "transparent",
        "border": "1px solid #929292",
        "color": "#686868",
        "borderRadius": 3,
        "paddingTop": 12,
        "paddingRight": 35,
        "paddingBottom": 12,
        "paddingLeft": 35,
        "textTransform": "uppercase",
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "btn-video:hover": {
        "background": "#f39c12",
        "color": "#fff",
        "border": "1px solid #f39c12"
    },
    "video": {},
    "video iframe": {
        "width": "100%",
        "border": "1px solid #999999",
        "paddingTop": 5,
        "paddingRight": 5,
        "paddingBottom": 5,
        "paddingLeft": 5
    },
    "owl-demo item": {
        "marginLeft": 90,
        "marginRight": 90,
        "marginBottom": 50
    },
    "owl-demo item img": {
        "display": "block",
        "width": "100%",
        "height": "auto"
    },
    "testimonial": {
        "background": "url(../images/testimonial.jpg)",
        "backgroundSize": "cover",
        "backgroundRepeat": "no-repeat"
    },
    "testimonial section_overlay": {
        "background": "rgba(0, 0, 0, .6)",
        "paddingTop": 80,
        "paddingBottom": 80
    },
    "carousel-indicators": {
        "bottom": -8
    },
    "divcarousel-inner item img": {
        "border": "2px solid #f39c12",
        "borderRadius": "50%",
        "paddingTop": 3,
        "paddingRight": 3,
        "paddingBottom": 3,
        "paddingLeft": 3
    },
    "testimonial_caption": {
        "paddingBottom": 70
    },
    "testimonial_caption p": {
        "color": "#D8D8D8",
        "fontSize": 18,
        "lineHeight": 27,
        "paddingTop": 50
    },
    "testimonial_caption h2": {
        "color": "#f39c12",
        "textTransform": "uppercase",
        "fontWeight": "900",
        "fontSize": 30,
        "marginTop": 25
    },
    "testimonial_caption h4": {
        "color": "#f39c12"
    },
    "testimonial_caption h4 span": {
        "color": "#D8D8D8",
        "fontStyle": "italic",
        "fontWeight": "300"
    },
    "testimonial olcarousel-indicators li": {
        "width": 12,
        "height": 12,
        "border": "1px solid #f39c12",
        "marginTop": "1PX",
        "marginRight": "1PX",
        "marginBottom": "1PX",
        "marginLeft": "1PX"
    },
    "testimonial olcarousel-indicators liactive": {
        "width": 12,
        "height": 12,
        "border": "0px solid #f39c12",
        "background": "#f39c12"
    },
    "features": {
        "backgroundColor": "#f1f1f1"
    },
    "feature_inner": {
        "paddingTop": 30,
        "paddingBottom": 70
    },
    "feature_iphone": {},
    "feature_iphone img": {
        "width": "100%"
    },
    "right_single_feature": {
        "position": "relative",
        "paddingLeft": 90,
        "marginBottom": 65,
        "marginTop": 35
    },
    "right_single_feature div": {
        "position": "absolute",
        "fontSize": 40,
        "color": "#f39c12",
        "left": 0,
        "width": 90,
        "height": 90,
        "textAlign": "center",
        "top": -8
    },
    "right_single_feature h3": {
        "textTransform": "uppercase",
        "fontSize": 25,
        "fontWeight": "700",
        "marginBottom": 21,
        "color": "#333333"
    },
    "right_single_feature h3 span": {
        "color": "#f39c12"
    },
    "right_single_feature p": {
        "color": "#333",
        "fontSize": 16,
        "fontWeight": "300",
        "lineHeight": 25
    },
    "left_single_feature": {
        "position": "relative",
        "paddingRight": 90,
        "marginBottom": 65,
        "textAlign": "right",
        "marginTop": 35
    },
    "left_single_feature div": {
        "position": "absolute",
        "fontSize": 40,
        "color": "#f39c12",
        "right": 0,
        "width": 90,
        "height": 90,
        "textAlign": "center",
        "top": -8
    },
    "left_single_feature h3": {
        "textTransform": "uppercase",
        "fontSize": 25,
        "fontWeight": "700",
        "marginBottom": 21,
        "color": "#333333"
    },
    "left_single_feature h3 span": {
        "color": "#f39c12"
    },
    "left_single_feature p": {
        "color": "#333",
        "fontSize": 16,
        "fontWeight": "300",
        "lineHeight": 25
    },
    "right_no_padding": {
        "paddingLeft": 15
    },
    "left_no_padding": {
        "paddingRight": 15
    },
    "call_to_action": {
        "backgroundColor": "#1a1a1a",
        "paddingTop": 100,
        "paddingBottom": 100
    },
    "call_to_action p": {
        "color": "#dfdfdf",
        "fontSize": 18,
        "fontWeight": "300"
    },
    "call_to_action a": {},
    "btn-action": {
        "background": "#f39c12",
        "border": "1px solid #f39c12",
        "color": "#fff",
        "borderRadius": 3,
        "paddingTop": 15,
        "paddingRight": 35,
        "paddingBottom": 15,
        "paddingLeft": 35,
        "textTransform": "uppercase",
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "btn-action:active": {
        "background": "#f39c12",
        "border": "1px solid #f39c12",
        "color": "#fff",
        "borderRadius": 3,
        "paddingTop": 15,
        "paddingRight": 35,
        "paddingBottom": 15,
        "paddingLeft": 35,
        "textTransform": "uppercase",
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "btn-action:focus": {
        "background": "#f39c12",
        "border": "1px solid #f39c12",
        "color": "#fff",
        "borderRadius": 3,
        "paddingTop": 15,
        "paddingRight": 35,
        "paddingBottom": 15,
        "paddingLeft": 35,
        "textTransform": "uppercase",
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "btn-action:visited": {
        "background": "#f39c12",
        "border": "1px solid #f39c12",
        "color": "#fff",
        "borderRadius": 3,
        "paddingTop": 15,
        "paddingRight": 35,
        "paddingBottom": 15,
        "paddingLeft": 35,
        "textTransform": "uppercase",
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "btn-action:hover": {
        "background": "#FF6B80",
        "borderColor": "#FF6B80"
    },
    "apps_screen": {
        "background": "#f1f1f1",
        "paddingBottom": 96
    },
    "screen_slider": {
        "paddingTop": 50
    },
    "owl-theme owl-controls owl-page span": {
        "display": "block",
        "width": 12,
        "height": 12,
        "marginTop": 5,
        "marginRight": 7,
        "marginBottom": 5,
        "marginLeft": 7,
        "filter": "Alpha(Opacity=50)",
        "opacity": 0.5,
        "WebkitBorderRadius": 20,
        "MozBorderRadius": 20,
        "borderRadius": 20,
        "background": "transparent",
        "border": "1px solid #f39c12"
    },
    "owl-theme owl-controls owl-pageactive span": {
        "opacity": 1,
        "background": "#f39c12"
    },
    "owl-theme owl-controlsclickable owl-page:hover span": {
        "opacity": 1,
        "background": "#f39c12"
    },
    "fun_facts": {
        "background": "url(../images/fun_bg.jpg) no-repeat center",
        "backgroundSize": "cover"
    },
    "fun_facts section_overlay": {
        "paddingTop": 120,
        "paddingBottom": 120,
        "background": "rgba(0, 0, 0, .4)"
    },
    "single_fun_facts": {
        "fontFamily": "'Source Sans Pro', sans-serif"
    },
    "single_fun_facts i": {
        "color": "#f39c12",
        "fontSize": 60
    },
    "single_fun_facts h2": {
        "color": "#D7DADB",
        "fontWeight": "700",
        "textTransform": "uppercase",
        "fontSize": 35,
        "marginTop": 15,
        "marginBottom": 1,
        "fontFamily": "'Source Sans Pro', sans-serif"
    },
    "single_fun_facts h2 span": {
        "fontWeight": "300",
        "fontFamily": "'Source Sans Pro', sans-serif"
    },
    "single_fun_facts p": {
        "color": "#D7DADB",
        "fontSize": 20,
        "marginTop": 0,
        "fontWeight": "300",
        "textTransform": "uppercase",
        "fontFamily": "'Source Sans Pro', sans-serif"
    },
    "download": {
        "background": "#f1f1f1"
    },
    "download_screen": {
        "paddingTop": 45
    },
    "download_screen img": {
        "width": "100%"
    },
    "available_store": {
        "background": "#1a1a1a",
        "marginTop": -8,
        "position": "relative"
    },
    "available_title": {
        "paddingTop": 75
    },
    "available_title h2": {
        "color": "#fff",
        "fontSize": 30
    },
    "available_title p": {
        "color": "#B5B5B5"
    },
    "single_store": {
        "textAlign": "center",
        "borderLeft": "1px solid #0F1217",
        "minHeight": 230,
        "paddingBottom": 15,
        "position": "relative",
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "single_store i": {
        "color": "#f39c12",
        "textAlign": "center",
        "opacity": 1,
        "fontSize": 40,
        "paddingTop": 90,
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "store_inner": {
        "position": "absolute",
        "bottom": 93,
        "width": "100%",
        "opacity": 0,
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "store_inner h2": {
        "textAlign": "center",
        "fontWeight": "300",
        "color": "#d7dadb",
        "fontSize": 16
    },
    "single_store:hover": {
        "background": "#121212"
    },
    "single_store:hover i": {
        "opacity": 0
    },
    "single_store:hover divstore_inner": {
        "opacity": 1
    },
    "no_padding": {
        "paddingLeft": 0,
        "paddingRight": 0
    },
    "last": {
        "borderRight": "1px solid #0F1217"
    },
    "contact": {
        "background": "#f1f1f1",
        "backgroundRepeat": "no-repeat",
        "backgroundSize": "cover"
    },
    "contact_form": {
        "paddingTop": 30
    },
    "contact_form form-control": {
        "display": "block",
        "width": "100%",
        "height": 50,
        "paddingTop": 6,
        "paddingRight": 12,
        "paddingBottom": 6,
        "paddingLeft": 12,
        "fontSize": 14,
        "lineHeight": 1.42857143,
        "color": "#3d3d3d",
        "backgroundColor": "transparent",
        "border": "1px solid #aeaeae",
        "backgroundImage": "none",
        "borderRadius": 3,
        "marginBottom": 15,
        "opacity": 0.8,
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s",
        "outline": "0px !important"
    },
    "contact_form form-control:focus": {
        "border": "1px solid #f39c12",
        "borderColor": "#f39c12",
        "outline": "0px none",
        "boxShadow": "0px 0px 0px rgba(0, 0, 0, 0.075) inset, 0px 0px 0px rgba(102, 175, 233, 0.6)"
    },
    "form-control:-webkit-input-placeholder": {
        "color": "red"
    },
    "form-control:-moz-placeholder": {
        "color": "red"
    },
    "form-control:-ms-input-placeholder": {
        "color": "red"
    },
    "submit-btn": {
        "backgroundColor": "transparent",
        "border": "1px solid #f39c12",
        "borderRadius": 4,
        "width": "100%",
        "height": 50,
        "textTransform": "uppercase",
        "fontSize": 18,
        "color": "#f39c12",
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s",
        "outline": "0px !important"
    },
    "submit-btn:active": {
        "backgroundColor": "transparent",
        "border": "1px solid #f39c12",
        "borderRadius": 4,
        "width": "100%",
        "height": 50,
        "textTransform": "uppercase",
        "fontSize": 18,
        "color": "#f39c12",
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s",
        "outline": "0px !important"
    },
    "submit-btn:focus": {
        "backgroundColor": "transparent",
        "border": "1px solid #f39c12",
        "borderRadius": 4,
        "width": "100%",
        "height": 50,
        "textTransform": "uppercase",
        "fontSize": 18,
        "color": "#f39c12",
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s",
        "outline": "0px !important"
    },
    "submit-btn:visited": {
        "backgroundColor": "transparent",
        "border": "1px solid #f39c12",
        "borderRadius": 4,
        "width": "100%",
        "height": 50,
        "textTransform": "uppercase",
        "fontSize": 18,
        "color": "#f39c12",
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s",
        "outline": "0px !important"
    },
    "submit-btn:hover": {
        "backgroundColor": "#f39c12",
        "color": "#fff",
        "borderColor": "#f39c12"
    },
    "social_icons": {
        "paddingTop": 50,
        "paddingBottom": 70
    },
    "social_icons ul": {
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0,
        "paddingTop": 0,
        "paddingRight": 0,
        "paddingBottom": 0,
        "paddingLeft": 0,
        "textAlign": "center"
    },
    "social_icons ul li": {
        "listStyle": "none",
        "display": "inline",
        "paddingLeft": 10
    },
    "social_icons ul li a": {
        "textDecoration": "none",
        "display": "inline-block",
        "textAlign": "center",
        "border": "1px solid #9d9d9d",
        "borderRadius": 3,
        "width": 45,
        "height": 45,
        "lineHeight": 49,
        "color": "#9d9d9d",
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "social_icons ul li a i": {
        "fontSize": 20
    },
    "social_icons ul li a:hover": {
        "background": "#f39c12",
        "border": "1px solid #f39c12",
        "color": "#fff"
    },
    "error": {
        "color": "#f39c12",
        "display": "block",
        "paddingBottom": 15,
        "fontSize": 18
    },
    "error i": {
        "paddingRight": 10,
        "fontSize": 18
    },
    "Sucess": {
        "color": "#4DB849",
        "display": "block",
        "paddingBottom": 15,
        "fontSize": 18,
        "textAlign": "center"
    },
    "Sucess i": {
        "paddingRight": 10,
        "fontSize": 18,
        "color": "#4DB849"
    },
    "message": {
        "height": 117,
        "resize": "none"
    },
    "subscribe": {
        "backgroundImage": "url(../images/subscribe.jpg)",
        "backgroundSize": "cover",
        "backgroundRepeat": "no-repeat",
        "backgroundPosition": "center"
    },
    "subscribe section_overlay": {
        "paddingBottom": 70,
        "background": "transparent"
    },
    "subscribe section_title h2": {
        "color": "#eaeaea"
    },
    "subscribe section_title p": {
        "color": "#a4a4a4"
    },
    "subscribe_form": {
        "textAlign": "center",
        "paddingTop": 30
    },
    "subscribe_form form-group": {},
    "subscribe_form form-control": {
        "background": "transparent",
        "border": "1px solid #575b63",
        "borderRadius": 0,
        "height": 45,
        "borderLeft": 0,
        "borderRight": 0,
        "borderTop": 0,
        "color": "#aeaeae",
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "subscribe_form form-control:focus": {
        "background": "transparent",
        "borderBottom": "1px solid #f1f1f1",
        "boxShadow": "none"
    },
    "subs-btn": {
        "width": 200,
        "background": "transparent",
        "border": "1px solid #f39c12",
        "borderRadius": 4,
        "height": 45,
        "marginLeft": 0,
        "marginBottom": 1,
        "color": "#f39c12",
        "textTransform": "uppercase",
        "fontWeight": "600",
        "fontSize": 17,
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s",
        "outline": "0px !important"
    },
    "subs-btn:active": {
        "width": 200,
        "background": "transparent",
        "border": "1px solid #f39c12",
        "borderRadius": 4,
        "height": 45,
        "marginLeft": 0,
        "marginBottom": 1,
        "color": "#f39c12",
        "textTransform": "uppercase",
        "fontWeight": "600",
        "fontSize": 17,
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s",
        "outline": "0px !important"
    },
    "subs-btn:focus": {
        "width": 200,
        "background": "transparent",
        "border": "1px solid #f39c12",
        "borderRadius": 4,
        "height": 45,
        "marginLeft": 0,
        "marginBottom": 1,
        "color": "#f39c12",
        "textTransform": "uppercase",
        "fontWeight": "600",
        "fontSize": 17,
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s",
        "outline": "0px !important"
    },
    "subs-btn:visited": {
        "width": 200,
        "background": "transparent",
        "border": "1px solid #f39c12",
        "borderRadius": 4,
        "height": 45,
        "marginLeft": 0,
        "marginBottom": 1,
        "color": "#f39c12",
        "textTransform": "uppercase",
        "fontWeight": "600",
        "fontSize": 17,
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s",
        "outline": "0px !important"
    },
    "subs-btn:hover": {
        "backgroundColor": "#f39c12",
        "color": "#fff",
        "borderColor": "#f39c12"
    },
    "subscription-success": {
        "color": "#fff",
        "textAlign": "center",
        "fontSize": 20
    },
    "subscription-error": {
        "color": "#fff",
        "textAlign": "center",
        "fontSize": 20
    },
    "copyright": {
        "backgroundColor": "#1A1D22",
        "paddingBottom": 65,
        "paddingTop": 65,
        "borderBottom": "3px solid #f39c12"
    },
    "copyright h2": {
        "height": 0,
        "marginTop": 0,
        "marginRight": 0,
        "marginBottom": 0,
        "marginLeft": 0
    },
    "copy_right_text": {
        "width": "60%"
    },
    "copy_right_text p": {
        "color": "#8C8B8A",
        "fontWeight": "600",
        "textTransform": "uppercase",
        "fontSize": 15
    },
    "copy_right_text p a": {
        "textDecoration": "none",
        "color": "#f39c12"
    },
    "copy_right_text p span": {
        "fontWeight": "300"
    },
    "scroll_top": {
        "textAlign": "right"
    },
    "scroll_top a": {
        "background": "#f39c12",
        "paddingTop": 25,
        "paddingRight": 25,
        "paddingBottom": 25,
        "paddingLeft": 25
    },
    "scroll_top a i": {
        "color": "#fff",
        "fontSize": 25
    },
    "input:-webkit-autofill": {
        "backgroundColor": "red",
        "backgroundImage": "none",
        "color": "rgb(0, 0, 0)"
    },
    "textarea:-webkit-autofill": {
        "backgroundColor": "red",
        "backgroundImage": "none",
        "color": "rgb(0, 0, 0)"
    },
    "select:-webkit-autofill": {
        "backgroundColor": "red",
        "backgroundImage": "none",
        "color": "rgb(0, 0, 0)"
    },
    "spn_hol": {
        "position": "fixed",
        "top": 0,
        "left": 0,
        "right": 0,
        "bottom": 0,
        "background": "#fff",
        "zIndex": 50000,
        "opacity": 1,
        "WebkitTransition": "all 1s",
        "MozTransition": "all 1s",
        "OTransition": "all 1s",
        "transition": "all 1s"
    },
    "spinner": {
        "position": "absolute",
        "top": "50%",
        "marginTop": -12,
        "left": "50%",
        "marginLeft": -35,
        "height": 24,
        "width": 70,
        "textAlign": "center",
        "display": "block"
    },
    "spinner > div": {
        "width": 18,
        "height": 18,
        "backgroundColor": "#333",
        "borderRadius": "100%",
        "display": "inline-block",
        "WebkitAnimation": "bouncedelay 1.4s infinite ease-in-out",
        "animation": "bouncedelay 1.4s infinite ease-in-out",
        "WebkitAnimationFillMode": "both",
        "animationFillMode": "both"
    },
    "spinner bounce1": {
        "WebkitAnimationDelay": "-0.32s",
        "animationDelay": "-0.32s"
    },
    "spinner bounce2": {
        "WebkitAnimationDelay": "-0.16s",
        "animationDelay": "-0.16s"
    }
});