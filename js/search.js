/* eslint-disable no-undef */
// const apiUrl = 'https://api.aecra.cn/release/blog2021/show';

function setPageTitle(data) {
  if (!(data === 'undefined' || !data)) {
    document.title = `${data} | AECRA BLOG`;
  }
  document.title = '搜索 | AECRA BLOG';
}

function setSearchBoxContent(data) {
  if (!(data === 'undefined' || !data)) {
    document.getElementsByClassName('search-content')[0].value = data;
  }
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
    hasSearchData: false,
  },
  created() {
    if (decodeURI(getGetParam().q)) {
      this.hasSearchData = true;
      fetch(`${apiUrl}/search?q=${decodeURI(getGetParam().q)}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((res) => {
          this.articleList = res;
          setPageTitle(decodeURI(getGetParam().q));
          setSearchBoxContent(decodeURI(getGetParam().q));
        });
    } else {
      // do nothing.
      this.hasSearchData = false;
    }
  },
});

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
