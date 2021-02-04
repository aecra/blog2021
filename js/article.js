var vmArticle = new Vue({
  el: "#previer",
  data: {
    article: {
      title: "博客文章",
      tags: ["blog"],
      publish_time: "2021-1-1 20:23:21",
      update_time: "2021-1-1 20:23:21",
      content: "",
    },
  },
  created: function () {
    if (getGetParam()["id"]) {
      fetch("./api/article.php", {
        method: "POST",
        body: JSON.stringify({ id: getGetParam()["id"] }),
      })
        .then((response) => {
          return response.json();
        })
        .then((res) => {
          if (JSON.stringify(res) == "{}") {
            window.location.href = "./";
          }
          this.article = res;
          setArticleContent(res.content);
          setPageTitle(res.title + " | AECRA BLOG");
        });
    } else {
      window.location.href = "./";
    }
  },
});

function setArticleContent(data) {
  // markdown解析
  // https://github.com/markdown-it/markdown-it
  var md;
  var defaults = {
    html: true, // Enable HTML tags in source
    xhtmlOut: true, // Use '/' to close single tags (<br />)
    breaks: true, // Convert '\n' in paragraphs into <br>
    langPrefix: "language-", // CSS language prefix for fenced blocks
    linkify: false, // autoconvert URL-like texts to links
    typographer: true, // Enable smartypants and other sweet transforms
    // options below are for demo only
    _highlight: true,
    _strict: false,
    _view: "html", // html / src / debug
  };

  defaults.highlight = function (str, lang) {
    var esc = md.utils.escapeHtml;
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' + hljs.highlight(lang, str, true).value + "</code></pre>";
      } catch (__) {}
    } else if (lang == "mermaid") {
      try {
        mermaid.parse(str);
        return `<div class="mermaid">${str}</div>`;
      } catch ({ str, hash }) {
        return `<pre>${str}</pre>`;
      }
    } else {
      return '<pre class="hljs"><code>' + esc(str) + "</code></pre>";
    }
  };

  mermaid.initialize({ startOnLoad: true });

  md = window.markdownit(defaults);
  var result = md.render(data);

  document.getElementsByClassName("article-card")[0].innerHTML = result;
}

function setPageTitle(data) {
  document.title = data;
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
