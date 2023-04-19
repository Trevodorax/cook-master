ARG  PHP_VERSION=8.2
FROM shinsenter/slim:php${PHP_VERSION}

# Control your timezone
ENV TZ="UTC"

# sets GID and UID
ENV PUID=9999
ENV PGID=9999

# sets web server root path
ENV WEBHOME="/var/www/html"

# Copy the API file to the document root
COPY ./public /var/www/html/public

EXPOSE 80

WORKDIR /var/www/html
