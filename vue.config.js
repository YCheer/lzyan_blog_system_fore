module.exports = {
    devServer: {
        proxy: {
            '/user': {
                target: 'http://localhost:8088',
                changeOrigin: true
            },
            '/admin': {
                target: 'http://localhost:8088',
                changeOrigin: true
            },
        }
    }
}