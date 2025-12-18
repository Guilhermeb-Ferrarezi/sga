FROM nginx:alpine

# Remove config padrão
RUN rm /etc/nginx/conf.d/default.conf

# Copia sua config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos do site
COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
