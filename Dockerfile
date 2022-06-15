FROM node:lts-alpine3.16

WORKDIR /usr/src/app
RUN mkdir build

COPY package*.json ./

RUN npm ci 

RUN npm install -g typescript
RUN npm install pm2 -g

COPY . .

RUN npm run build 


# EXPOSE 只是聲明, 還是要用 -p 來指定
EXPOSE 5000

CMD [ "pm2-runtime", "start", "pm2.config.js", "--env", "production"]
