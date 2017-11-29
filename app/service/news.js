'use strict';

const Service = require('egg').Service;

class NewsService extends Service {
  async list(page = 1) {
    // read config
    const { serverUrl, pageSize, localProxy } = this.config.news;
    // get hkrn api
    const { data: idList } = await this.ctx.curl(`${serverUrl}/topstories.json`, {
      data: {
        orderBy: '"$key"',
        startAt: `"${pageSize * (page - 1)}"`,
        endAt: `"${pageSize * page - 1}"`,
      },
      dataType: 'json',
      enableProxy: true,
      proxy: `${localProxy}`,
    });

    //   console.log(idList);

      // parallel get detail
    const newsList = await Promise.all(
      Object.keys(idList).map(key => {
        const url = `${serverUrl}/item/${idList[key]}.json`;
        //   console.log(url);
        return this.ctx.curl(url, {
          dataType: 'json',
          enableProxy: true,
          proxy: `${localProxy}`,
          timeout: 10000,
        });
      })
    );
    return newsList.map(res => res.data);
  }
}

module.exports = NewsService;
