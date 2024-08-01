import { createProxyMiddleware } from "http-proxy-middleware";

// 타입스크립트 지원 X
module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "http://localhost:3001",
      changeOrigin: true,
    })
  );
};