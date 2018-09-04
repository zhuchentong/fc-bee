FROM zct1989/nginx-node:latest

COPY . /usr/local/code/
WORKDIR /usr/local/code

# 项目编译
RUN npm install \
  --ignore-scripts \
  --registry=http://192.168.3.2:4873 \
  --disturl=https://npm.taobao.org/dist \
  npm run build && \
  rm -rf /usr/share/nginx/html/* && \
  cp -rf /usr/local/code/dist/* /usr/share/nginx/html/ && \
  rm -rf /usr/local/code

EXPOSE 80
