# Node.js Application Manager

Simple Node.js application manager for CasaOS.

## Quick Start
To deploy in CasaOS:

1. Open CasaOS interface
2. Go to "Manual App Install"
3. Use this docker-compose:

```yaml
version: '3'
services:
  nodejs-manager:
    container_name: nodejs-manager
    image: node:18-alpine
    working_dir: /app
    ports:
      - "3000:3000"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    command: >
      sh -c "apk add --no-cache git &&
             git clone https://github.com/adamsetiaji/nodejs-manager.git . &&
             npm install &&
             npm start"
