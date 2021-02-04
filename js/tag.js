var vmArticle = new Vue({
  el: "#article-cards",
  data: {
    articleList: [],
    start: 0,
    step: 4,
    nomore: false,
  },
  methods: {
    getMoreArticles: function () {
      if (this.nomore) {
        // console.log("no more!");
      } else {
        fetch("./api/tag.php", {
          method: "POST",
          body: JSON.stringify({
            tag: decodeURI(getGetParam()["tag"]),
            start: this.start,
            step: this.step,
          }),
        })
          .then((response) => {
            return response.json();
          })
          .then((res) => {
            if (this.start == 0 && res.length == 0) {
              // window.location.href = "./";
            }
            if (res.length == 0) {
              this.nomore = true;
            } else {
              this.articleList.push(...res);
              this.start += res.length;
              if (res.length < this.step) {
                this.nomore = true;
              }
            }
          });
      }
    },
  },
  created: function () {
    if (decodeURI(getGetParam()["tag"])) {
      fetch("./api/tag.php", {
        method: "POST",
        body: JSON.stringify({
          tag: decodeURI(getGetParam()["tag"]),
          start: this.start,
          step: this.step,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((res) => {
          if (this.start == 0 && res.length == 0) {
            // window.location.href = "./";
          }
          if (res.length == 0) {
            this.nomore = true;
          } else {
            this.articleList.push(...res);
            this.start += res.length;
            if (res.length < this.step) {
              this.nomore = true;
            }
          }
          setPageTitle("标签：" + decodeURI(getGetParam()["tag"]) + " | AECRA BLOG");
          setPrevierTitle("标签：" + decodeURI(getGetParam()["tag"]));
        });
    } else {
      // window.location.href = "./";
    }
  },
});

function setPageTitle(data) {
  document.title = data;
}

function setPrevierTitle(data) {
  var previerTitle = document.getElementsByClassName("previer-title")[0];
  previerTitle.innerHTML = data;
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
