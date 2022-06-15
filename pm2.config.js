module.exports = {
  apps: [{
    name: "app1",
    script: "./build/index.js",
    instances : "max",
    env_production: {
      NODE_ENV: "production"
    },
    env_development: {
      NODE_ENV: "development"
    }
  }]
}
