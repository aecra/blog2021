/* eslint-disable no-undef */
// const apiUrl = 'https://api.aecra.cn/release/blog2021/show';
// eslint-disable-next-line no-new
// eslint-disable-next-line no-unused-vars
const articleList = new Vue({
  el: '#article-cards',
  computed: {
    articleList: {
      get() {
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
    getMoreArticles() {
      if (this.nomore) {
        // console.log("no more!");
      } else {
        fetch(`${apiUrl}/articleList?start=${this.start}&step=${this.step}`, {
          method: 'GET',
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.length === 0) {
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
  created() {
    fetch(`${apiUrl}/topedArticle`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((res) => {
        this.topedArticleList = res;
      });

    fetch(`${apiUrl}/articleList?start=${this.start}&step=${this.step}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((res) => {
        this.normalArticleList.push(...res);
        this.start += res.length;
      });
  },
});

const screenWidth = (window.innerWidth
  || document.documentElement.clientWidth || document.body.clientWidth);

function bindSearchAction() {
  document.getElementsByClassName('search-button')[0].onclick = () => {
    const data = document.getElementsByClassName('search-content')[0].value;
    window.location.href = `./search.html?q=${decodeURI(data)}`;
  };

  document.getElementsByClassName('search-content')[0].onkeydown = (event) => {
    const e = event || window.event;
    const code = e.which || e.keyCode;
    if (code === 13) {
      const data = document.getElementsByClassName('search-content')[0].value;
      window.location.href = `./search.html?q=${decodeURI(data)}`;
    }
    if (code === 27) {
      this.value = '';
    }
  };
}

function bindPageDown() {
  document.getElementsByClassName('to-down')[0].children[0].onclick = () => {
    const itemTime = 8;

    const timer = setInterval(() => {
      const screenHeight = (window.innerHeight
        || document.documentElement.clientHeight || document.body.clientHeight);
      if (document.documentElement.scrollTop >= screenHeight) {
        document.documentElement.scrollTop = screenHeight;
        clearInterval(timer);
      }
      let itemTemp = (screenHeight - document.documentElement.scrollTop) * 0.05;
      itemTemp = itemTemp < 3 ? 3 : itemTemp;
      document.documentElement.scrollTop += itemTemp;
    }, itemTime);
  };
}

function setTypewriter(id, data) {
  function Typewriter(arg) {
    // options
    const { el } = arg;
    const { cursorFlash } = arg;
    const wordFlash = arg.wordFlash instanceof Array ? arg.wordFlash : [0, 400];
    const m = wordFlash[0];
    const n = wordFlash[1];

    // 创建过就不要再创建了
    if (!el.typewriter) {
      el.typewriter = true;
    } else {
      return false;
    }

    // 初始化
    const text = data;
    let len = 0;

    const textBox = document.createElement('span');
    textBox.id = 'typewriter-text';

    const cursorBox = document.createElement('span');
    cursorBox.id = 'typewriter-cursor';
    cursorBox.innerHTML = '_';

    el.innerHTML = '';
    el.appendChild(textBox);
    el.appendChild(cursorBox);

    // 光标闪闪
    setInterval(() => {
      if (cursorBox.show) {
        cursorBox.style.opacity = 1;
        cursorBox.show = false;
      } else {
        cursorBox.style.opacity = 0;
        cursorBox.show = true;
      }
    }, cursorFlash);

    // 添加字符
    function addWords() {
      if (len <= text.length) {
        textBox.innerHTML = text.slice(0, len);
        len += 1;
        setTimeout(addWords, Math.random() * (n - m) + m);
      }
    }

    this.startWrite = () => {
      if (!textBox.canadd) {
        textBox.canadd = true;
        addWords();
      }
    };
  }

  const wrap = document.querySelector(`#${id}`);

  // 创建打字机
  const tw = new Typewriter({
    el: wrap,
    cursorFlash: 600,
    wordFlash: [100, 300],
  });

  // 开始
  tw.startWrite();
}

bindSearchAction();
if (screenWidth >= 992) {
  bindPageDown();
  setTypewriter('wrap', '且视他人之疑目如盏盏鬼火，大胆地去走你的夜路');
} else if (screenWidth >= 768 && screenWidth < 992) {
  setTypewriter('wrap', '熬过无人问津的日子，才有诗和远方');
} else {
  setTypewriter('wrap', '碧山人来，清酒深杯');
}
