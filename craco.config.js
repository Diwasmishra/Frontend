// craco.config.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.resolve.fallback = {
                ...webpackConfig.resolve.fallback,
                buffer: require.resolve('buffer/')
            };
            return webpackConfig;
        },
    },
};
