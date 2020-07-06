FROM node:12-alpine as builder

RUN mkdir /app
WORKDIR /app

# install and cache app dependencies
COPY package.json package-lock.json ./
RUN npm install

COPY . ./
RUN VUE_APP_PUBLIC_PATH=/ npm run build

# ------------------------------------------------------
# Production Build
# ------------------------------------------------------
FROM nginx:1.16.0-alpine
COPY --from=builder /app/docs /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
