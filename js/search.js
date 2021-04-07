var apiUrl = "https://2021.aecra.cn/release/show";
var vmArticle = new Vue({
  el: "#article-cards",
  data: {
    articleList: [],
    hasSearchData: false,
  },
  created: function () {
    if (decodeURI(getGetParam()["q"])) {
      this.hasSearchData = true;
      fetch(`${apiUrl}/search?q=${decodeURI(getGetParam()["q"])}`, {
        method: "GET",
      })
        .then((response) => {
          return response.json();
        })
        .then((res) => {
          this.articleList = res;
          setPageTitle(decodeURI(getGetParam()["q"]));
          setSearchBoxContent(decodeURI(getGetParam()["q"]));
        });
    } else {
      // do nothing.
      this.hasSearchData = false;
    }
  },
});

function setPageTitle(data) {
  if (!(data == "undefined" || !data)) {
    document.title = data + " | AECRA BLOG";
  }
  document.title = "搜索 | AECRA BLOG";
}

function setSearchBoxContent(data) {
  if (!(data == "undefined" || !data)) {
    document.getElementsByClassName("search-content")[0].value = data;
  }
}

function getGetParam() {
  var url = window.document.location.href.toString();
  var u = url.split("?");
  if (typeof u[1] == "string") {
    u = u[1].split("&");
    var get = {};
    for (var i in u) {
      var j = u[i].split("=");
      get[j[0]] = j[1];
    }
    return get;
  } else {
    return {};
  }
}

document.getElementsByClassName("search-button")[0].onclick = function () {
  var data = document.getElementsByClassName("search-content")[0].value;
  window.location.href = "./search.html?q=" + decodeURI(data);
};

document.getElementsByClassName("search-content")[0].onkeydown = function (event) {
  var e = event || window.event;
  var code = e.which || e.keyCode;
  if (code == 13) {
    var data = document.getElementsByClassName("search-content")[0].value;
    window.location.href = "./search.html?q=" + decodeURI(data);
  }
  if (code == 27) {
    this.value = "";
  }
};
