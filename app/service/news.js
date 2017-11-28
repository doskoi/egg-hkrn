const Service = require('egg').Service;

class NewsService extends Service {
    async list(page = 1) {
        //read config
      const {serverUrl, pageSize} = this.config.news;
        //get hkrn api
      const {data, idList} = await this.ctx.curl(`${serverUrl}/topstories.json`, {
        data: {
            orderBy: '"$key"',
            startAt: `"${pageSize * (page - 1)}"`,
            endAt: `"${pageSize * page - 1}"`,
        },
        dataType: 'json',
        enableProxy: true,
        proxy: 'http://127.0.0.1:1080',
      });

      //parallel get detail
      const newList = await Promise.all(
          Object.keys(data).map(key => {
              const url = `$(serverUrl)/item/${idList[key]}.json`;
              return this.ctx.curl(url, {
                  dataType: 'json',
                  enableProxy: true,
                  proxy: 'http://127.0.0.1:1080',
                });
          })
      );
      return newsList.map(res => res.data);
    }
}

module.exports = NewsService;