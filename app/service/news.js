const Service = require('egg').Service;

class NewsService extends Service {
    async list(page = 1) {
        //read config
      const {serverUrl, pageSize} = this.config.news;
        //get hkrn api
      const {data: idList} = await this.ctx.curl(`${serverUrl}/topstories.json`, {
        data: {
            orderBy: '"$key"',
            startAt: `"${pageSize * (page - 1)}"`,
            endAt: `"${pageSize * page - 1}"`,
        },
        dataType: 'json',
        enableProxy: true,
        proxy: 'http://127.0.0.1:6152',
      });

      console.log(idList);

      //parallel get detail
      const newsList = await Promise.all(
          Object.keys(idList).map(key => {
              const url = `$(serverUrl)/item/${idList[key]}.json`;
              return this.ctx.curl(url, {
                  enableProxy: true,
                  proxy: 'http://127.0.0.1:6152',
                });
          })
      );
      return newsList.map(res => res.data);
    }
}

module.exports = NewsService;