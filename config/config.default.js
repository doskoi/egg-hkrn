'use strict';

exports.keys = 's#J89dfjas,ack-9';

exports.view = {
  defaultViewEngine: 'nunjucks',
  mapping: {
    '.html': 'nunjucks',
  },
};

exports.news = {
  pageSize: 5,
  serverUrl: 'https://hacker-news.firebaseio.com/v0',
  localProxy: 'http://127.0.0.1:8899',
};

exports.middleware = [
  'robot',
];
// robot's configurations
exports.robot = {
  ua: [
    /Baiduspider/i,
  ],
};

exports.security = {
  csrf: {
    ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
  },
};

