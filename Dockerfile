# Serves the static site. Unprivileged nginx listens on 8080 and runs as a non-root user.
FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY site/ /usr/share/nginx/html/
