FROM node:lts-alpine3.16

WORKDIR /usr/src/app

# For put product zipfiles imgs, and tsc build
RUN mkdir product_zip && mkdir -p public/productImg \
    mkdir build

RUN npm install -g typescript
RUN npm install pm2 -g

COPY package*.json ./
RUN npm ci


COPY . .

RUN npm run build 


# EXPOSE just declaration, still use -p to setting
EXPOSE 5000

# "--parallel", "1" can make run init DB will not fail
CMD [ "pm2-runtime", "start", "pm2.config.js", "--env", "production", "--parallel", "1" , "--wait-ready", "--listen-timeout", "5000"];
