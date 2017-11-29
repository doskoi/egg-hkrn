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
	function getTLD(hostname) {
		const hostnameArray = hostname.split(".");
		const posOfTld = hostnameArray.length - 2;
		const tld = hostnameArray[posOfTld] + '.' + hostnameArray[posOfTld+1];
		return tld;
	}
	return newsList.map(function (res) {
		const data = res.data;
		const { URL } = require('url');
		const theURL = new URL(data.url);
		const hostname = getTLD(theURL.hostname);
		data.domain = hostname;
		return data;
	});
  }
}

module.exports = NewsService;
