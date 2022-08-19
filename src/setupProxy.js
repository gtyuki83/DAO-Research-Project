// const { createProxyMiddleware } = require('http-proxy-middleware');

// module.exports = function (app) {
//     //proxyの第一引数はドメイン以下の部分
//     //第二引数のtarget部はドメイン
//     app.use(proxy("/tasks", { target: 'https://api.notion.com', changeOrigin: true }));
// };

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    const headers = {
        "Content-Type": "application/json",
    }
    app.use(
        '/v1/databases/425af77e016c48da823b452f66035fc6/query',
        createProxyMiddleware({
            target: 'https://api.notion.com/',
            changeOrigin: true,
        })
    );
};