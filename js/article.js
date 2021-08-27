/* eslint-disable no-new */
// const apiUrl = 'https://api.aecra.cn/release/blog2021/show';

function setPageTitle(data) {
  document.title = data;
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

function setArticleContent(data) {
  // markdown解析
  // https://github.com/markdown-it/markdown-it
  let md;
  const defaults = {
    html: true, // Enable HTML tags in source
    xhtmlOut: true, // Use '/' to close single tags (<br />)
    breaks: true, // Convert '\n' in paragraphs into <br>
    langPrefix: 'language-', // CSS language prefix for fenced blocks
    linkify: false, // autoconvert URL-like texts to links
    typographer: true, // Enable smartypants and other sweet transforms
    // options below are for demo only
    _highlight: true,
    _strict: false,
    _view: 'html', // html / src / debug
  };

  defaults.highlight = (str, lang) => {
    const esc = md.utils.escapeHtml;
    // eslint-disable-next-line no-undef
    if (lang && hljs.getLanguage(lang)) {
      try {
        // eslint-disable-next-line no-undef
        return `<pre class="hljs"><code>${hljs.highlight(lang, str, true).value}</code></pre>`;
      } catch (__) { return ''; }
    } else if (lang === 'mermaid') {
      try {
        // eslint-disable-next-line no-undef
        mermaid.parse(str);
        return `<div class="mermaid">${str}</div>`;
      } catch ({ str1, hash }) {
        return `<pre>${str1}</pre>`;
      }
    } else {
      return `<pre class="hljs"><code>${esc(str)}</code></pre>`;
    }
  };

  // eslint-disable-next-line no-undef
  mermaid.initialize({ startOnLoad: true });

  md = window.markdownit(defaults);
  const result = md.render(data);

  document.getElementsByClassName('markdown')[0].innerHTML = result;
}

// eslint-disable-next-line no-undef
new Vue({
  el: '#previer',
  data: {
    article: {
      title: '博客文章',
      tags: ['blog'],
      publish_time: '2021-1-1 20:23:21',
      update_time: '2021-1-1 20:23:21',
      content: '',
    },
  },
  created() {
    if (getGetParam().id) {
      fetch(`${apiUrl}/article?id=${getGetParam().id}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((res) => {
          if (JSON.stringify(res) === '{}') {
            window.location.href = './';
          }
          this.article = res;
          setArticleContent(res.content);
          setPageTitle(`${res.title} | AECRA BLOG`);
        });
    } else {
      window.location.href = './';
    }
  },
});

// eslint-disable-next-line no-undef
new Valine({
  el: '#vcomments',
  appId: 'vaD1lefArFYNfubMY5J8Su9K-gzGzoHsz',
  appKey: 'iVLB6rYIV43vj9HHmwKlTUQd',
  path: window.location.href,
  avatar: 'identicon',
});
