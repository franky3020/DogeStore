FROM node:lts-alpine3.16

WORKDIR /usr/src/app

# For put product zipfiles imgs, and tsc build
RUN mkdir product_zip && mkdir -p public/productImg \
    mkdir build

COPY package*.json ./
RUN npm ci


COPY . .

RUN npm run build 


# EXPOSE just declaration, still use -p in docker run
EXPOSE 5000

CMD ["npx", "pm2-runtime", "start", "pm2.config.js", "--env", "production"];
