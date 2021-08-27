/* eslint-disable no-undef */
const apiUrl = 'https://api.aecra.cn/release/blog2021/show';
function toTopChange() {
  const toTop = document.getElementsByClassName('to-top')[0];
  const screenHeight = (window.innerHeight
    || document.documentElement.clientHeight || document.body.clientHeight);
  const scrolledHeight = document.documentElement.scrollTop;
  toTop.style.display = scrolledHeight <= screenHeight ? 'none' : 'block';
}

document.onscroll = () => {
  toTopChange();
};

document.getElementsByClassName('to-top')[0].onclick = () => {
  const itemTime = 8;

  const timer = setInterval(() => {
    if (document.documentElement.scrollTop <= 0) {
      document.documentElement.scrollTop = 0;
      clearInterval(timer);
    }
    let itemTemp = document.documentElement.scrollTop * 0.05;
    itemTemp = itemTemp < 1 ? 1 : itemTemp;
    // console.log(itemTemp, document.documentElement.scrollTop);
    document.documentElement.scrollTop -= itemTemp;
  }, itemTime);
};

// eslint-disable-next-line no-new
new Vue({
  el: '#hot-article',
  data: {
    articleList: [],
  },
  created() {
    fetch(`${apiUrl}/hotArticle`, {
      // 请求方法
      method: 'GET',
    })
      .then((response) => response.json())
      .then((res) => {
        this.articleList = res;
      });
  },
});
