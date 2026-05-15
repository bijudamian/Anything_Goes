FROM nginx:alpine

# Remove default Nginx config
RUN rm /etc/nginx/nginx.conf

# Copy custom Nginx config
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy frontend static files to Nginx document root
COPY frontend /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
