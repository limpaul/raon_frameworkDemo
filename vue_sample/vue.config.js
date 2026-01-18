const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
    devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 백엔드 서버의 실제 주소
        changeOrigin: true,                // CORS 회피를 위해 호스트 헤더 변경
        pathRewrite: { '^/api': '' }       // URL에서 /api 부분을 제거하고 백엔드에 전달
      },
      '/transkeyServlet': {
        target: 'http://localhost:8080', // 백엔드 서버의 실제 주소
        changeOrigin: true,                // CORS 회피를 위해 호스트 헤더 변경
      }
    }
  }
})
