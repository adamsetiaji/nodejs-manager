FROM node:lts-alpine

WORKDIR /app

# Install multiple Node.js versions using n
RUN apk add --no-cache curl \
    && curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n \
    && bash n lts \
    && bash n latest \
    && rm n

COPY app/package*.json ./

RUN npm install

COPY app/ .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]