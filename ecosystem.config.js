module.exports = {
  apps: [
    {
      name: 'forresting',
      exec_mode: "cluster",
      cwd: './',
      script: 'npm',
      args: 'start',
      instances: "1",
      autorestart: true,
      listen_timeout: 50000,
      kill_timeout: 5000,
    }
  ]
}
