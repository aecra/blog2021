var apiUrl = "https://2021.aecra.cn/release/show";
var vmMainArticleList = new Vue({
  el: "#article-cards",
  computed: {
    articleList: {
      get: function () {
        return this.topedArticleList.concat(this.normalArticleList);
      },
    },
  },
  data: {
    topedArticleList: [],
    normalArticleList: [],
    start: 0,
    step: 5,
    nomore: false,
  },
  methods: {
    getMoreArticles: function () {
      if (this.nomore) {
        // console.log("no more!");
      } else {
        fetch(`${apiUrl}/articleList?start=${this.start}&step=${this.step}`, {
          method: "GET",
        })
          .then((response) => {
            return response.json();
          })
          .then((res) => {
            if (res.length == 0) {
              // console.log("no more!");
              this.nomore = true;
            } else {
              this.normalArticleList.push(...res);
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
    fetch("${apiUrl}/topedArticle", {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        this.topedArticleList = res;
      });

    fetch(`${apiUrl}/articleList?start=${this.start}&step=${this.step}`, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        this.normalArticleList.push(...res);
        this.start += res.length;
      });
  },
});

var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
bindSearchAction();
if (screenWidth >= 992) {
  bindPageDown();
  setTypewriter("wrap", "且视他人之疑目如盏盏鬼火，大胆地去走你的夜路");
}else if(screenWidth>=768&&screenWidth<992){
  setTypewriter("wrap", "熬过无人问津的日子，才有诗和远方");
}else{
  setTypewriter("wrap", "碧山人来，清酒深杯");
}

function bindSearchAction() {
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
}

function bindPageDown() {
  document.getElementsByClassName("to-down")[0].children[0].onclick = function () {
    var itemTime = 8;

    var timer = setInterval(() => {
      var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      if (document.documentElement.scrollTop >= screenHeight) {
        document.documentElement.scrollTop = screenHeight;
        clearInterval(timer);
      }
      var itemTemp = (screenHeight - document.documentElement.scrollTop) * 0.05;
      itemTemp = itemTemp < 3 ? 3 : itemTemp;
      // console.log(itemTemp, document.documentElement.scrollTop, screenHeight);
      document.documentElement.scrollTop += itemTemp;
    }, itemTime);
  };
}

function setTypewriter(id, data) {
  function Typewriter(arg) {
    //options
    var el = arg.el;
    var cursorFlash = arg.cursorFlash;
    var wordFlash = arg.wordFlash instanceof Array ? arg.wordFlash : [0, 400];
    var m = wordFlash[0];
    var n = wordFlash[1];

    //创建过就不要再创建了
    if (!el.typewriter) {
      el.typewriter = true;
    } else {
      return false;
    }

    //初始化
    var text = data;
    var len = 0;

    var text_box = document.createElement("span");
    text_box.id = "typewriter-text";

    var cursor_box = document.createElement("span");
    cursor_box.id = "typewriter-cursor";
    cursor_box.innerHTML = "_";

    el.innerHTML = "";
    el.appendChild(text_box);
    el.appendChild(cursor_box);

    //光标闪闪
    setInterval(function () {
      if (cursor_box.show) {
        cursor_box.style.opacity = 1;
        cursor_box.show = false;
      } else {
        cursor_box.style.opacity = 0;
        cursor_box.show = true;
      }
    }, cursorFlash);

    //添加字符
    function addWords() {
      if (len <= text.length) {
        text_box.innerHTML = text.slice(0, len);
        len++;
        setTimeout(addWords, Math.random() * (n - m) + m);
      }
    }

    this.startWrite = function () {
      if (!text_box.canadd) {
        text_box.canadd = true;
        addWords();
      }
    };
  }

  var wrap = document.querySelector("#" + id);

  //创建打字机
  var tw = new Typewriter({
    el: wrap,
    cursorFlash: 600,
    wordFlash: [100, 300],
  });

  //开始
  tw.startWrite();
}
