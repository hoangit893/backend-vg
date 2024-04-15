module.exports = {
    apps: [{
        name: "be",
        script: "pm2 start ./src/server.ts",
        instances: "1",
        exec_mode: "cluster",
        env: {
            NODE_ENV: "development",
        },
        env_production: {
            NODE_ENV: "production",
        }
    }]
}