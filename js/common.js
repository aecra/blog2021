var apiUrl = "https://2021.aecra.cn/release/show";
function toTopChange() {
  var toTop = document.getElementsByClassName("to-top")[0];
  var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  var scrolledHeight = document.documentElement.scrollTop;
  toTop.style.display = scrolledHeight <= screenHeight ? "none" : "block";
}

document.onscroll = function () {
  toTopChange();
};

document.getElementsByClassName("to-top")[0].onclick = function () {
  var itemTime = 8;

  var timer = setInterval(() => {
    if (document.documentElement.scrollTop <= 0) {
      document.documentElement.scrollTop = 0;
      clearInterval(timer);
    }
    var itemTemp = document.documentElement.scrollTop * 0.05;
    itemTemp = itemTemp < 1 ? 1 : itemTemp;
    // console.log(itemTemp, document.documentElement.scrollTop);
    document.documentElement.scrollTop -= itemTemp;
  }, itemTime);
};

var vmHotArticle = new Vue({
  el: "#hot-article",
  data: {
    articleList: [],
  },
  created: function () {
    fetch(`${apiUrl}/hotArticle`, {
      //请求方法
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        this.articleList = res;
      });
  },
});