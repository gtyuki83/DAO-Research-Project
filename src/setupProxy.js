// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function (app) {
//     //proxyの第一引数はドメイン以下の部分
//     //第二引数のtarget部はドメイン
//     app.use(proxy("/tasks", { target: 'https://api.notion.com', changeOrigin: true }));
// };

const { createProxyMiddleware } = require("http-proxy-middleware");
const token = 'secret_xSth6IX9nYQ2hzYIBiJQeaLuksxg0czyANw0q6sfrdf';

module.exports = function (app) {
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
    }
    app.use(
        createProxyMiddleware(
            '/aaaaaaaaaaaaaa', {
            target: 'https://api.notion.com/',
            changeOrigin: true,
            secure: false,
            headers: headers,
        })
    );
};