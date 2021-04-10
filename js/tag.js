/* eslint-disable no-undef */
// const apiUrl = 'https://2021.aecra.cn/release/show';

function setPageTitle(data) {
  document.title = data;
}

function setPrevierTitle(data) {
  const previerTitle = document.getElementsByClassName('previer-title')[0];
  previerTitle.innerHTML = data;
}

function getGetParam() {
  const url = window.document.location.href.toString();
  let u = url.split('?');
  if (typeof u[1] === 'string') {
    u = u[1].split('&');
    let get = {};

    u.forEach((element) => {
      const j = element.split('=');
      get = Object.assign(get, { [j[0]]: j[1] });
    });
    return get;
  }
  return {};
}

// eslint-disable-next-line no-new
new Vue({
  el: '#article-cards',
  data: {
    articleList: [],
    start: 0,
    step: 4,
    nomore: false,
  },
  methods: {
    getMoreArticles() {
      if (this.nomore) {
        // console.log("no more!");
      } else {
        fetch(`${apiUrl}/tag?tag=${decodeURI(getGetParam().tag)}&start=${this.start}step=${this.step}`, {
          method: 'GET',
        })
          .then((response) => response.json())
          .then((res) => {
            if (this.start === 0 && res.length === 0) {
              // window.location.href = "./";
            }
            if (res.length === 0) {
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
  created() {
    if (decodeURI(getGetParam().tag)) {
      fetch(`${apiUrl}/tag?tag=${decodeURI(getGetParam().tag)}&start=${this.start}&step=${this.step}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((res) => {
          if (this.start === 0 && res.length === 0) {
            // window.location.href = "./";
          }
          if (res.length === 0) {
            this.nomore = true;
          } else {
            this.articleList.push(...res);
            this.start += res.length;
            if (res.length < this.step) {
              this.nomore = true;
            }
          }
          setPageTitle(`标签：${decodeURI(getGetParam().tag)} | AECRA BLOG`);
          setPrevierTitle(`标签：${decodeURI(getGetParam().tag)}`);
        });
    } else {
      // window.location.href = "./";
    }
  },
});
