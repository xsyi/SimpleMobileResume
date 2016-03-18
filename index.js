/**
 * Created by shan on 3/17/16.
 */
var main = document.querySelector("#main");
var oLis = document.querySelectorAll("#list>li");
var winW = document.documentElement.clientWidth;/*设备的宽度*/
var winH = document.documentElement.clientHeight;/*设备的高度*/
var desW = 640;/*设计稿宽*/
var desH = 1008;/*设计稿高/
 /*设备的宽／设备的高< 设计稿宽／设计稿高 按照高来缩放 ->把设计稿的高缩小到设备的高*/
if (winW / winH <= desW / desH) {
    main.style.webkitTransform = "scale(" + winH / desH + ")";    //main虽然缩放了，但是宽高不变还是640 960
} else {
    main.style.webkitTransform = "scale(" + winW / desW + ")";
}
[].forEach.call(oLis, function () {
    var oLi = arguments[0];
    oLi.index = arguments[1];
    oLi.addEventListener("touchstart", start, false);
    oLi.addEventListener("touchmove", move, false);
    oLi.addEventListener("touchend", end, false);
})

function start(e) {
    this.touchStart = e.changedTouches[0].pageY;
}

function move(e) {
    e.preventDefault();
    this.flag = true;
    var touchMove = e.changedTouches[0].pageY;
    var pos = touchMove - this.touchStart;
    var index = this.index;//当前这一张的索引
    [].forEach.call(oLis, function () {
        arguments[0].className = "";
        if (arguments[1] != index) {
            arguments[0].style.display = "none"
        }
        arguments[0].firstElementChild.id = "";
    })
    if (pos > 0) {/*下滑*/
        //获得上一张的索引，并且做过界判断，当前这一张是第一张，上一张就是最后一张
        this.prevsIndex = (index == 0 ? oLis.length - 1 : index - 1);
        var duration = -winH + pos;

    } else if (pos < 0) {/*上滑*/
        //获得下一张的索引 过界判断 当前是最后一张 下一张就是第一张
        this.prevsIndex = (index == oLis.length - 1 ? 0 : index + 1);
        var duration = winH + pos;
    }

    oLis[index].style.webkitTransform = "translate(0," + pos + "px)";//缩放的值是按照移动的距离／设备的高度这个比例来缩放
    oLis[this.prevsIndex].style.webkitTransform = "translate(0," + duration + "px)";
    oLis[this.prevsIndex].style.display = "block";
    oLis[this.prevsIndex].className = "zIndex";//层级在最上面
}
function end(e) {
    if (this.flag) {
        oLis[this.prevsIndex].style.webkitTransform = "translate(0,0)";
        oLis[this.prevsIndex].style.webkitTransition = "0.5s";
        oLis[this.prevsIndex].addEventListener("webkitTransitionEnd", function () {
            this.style.webkitTransition = "";
            this.firstElementChild.id = "a" + (this.index + 1)
        }, false)
    }
}


document.addEventListener("touchmove", function (e) {
    //console.log(e.target.id);    防止模拟机问题touchmove丢失 自己给加一个防止丢失
}, false)

