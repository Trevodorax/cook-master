# Use the official PHP image with Apache support
FROM php:8.2-apache

# Copy the API file to the document root
COPY ./public /var/www/html/public
COPY ./.htaccess /var/www/html/.htaccess

# Install required system packages and PHP extensions
RUN apt update \
    && apt install -y zlib1g-dev g++ git libicu-dev zip libzip-dev zip libpq-dev \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install intl opcache pdo pdo_pgsql \
    && pecl install apcu \
    && docker-php-ext-enable apcu \
    && docker-php-ext-configure zip \
    && docker-php-ext-install zip

WORKDIR /var/www/html

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN composer require slim/slim:"4.*" \
    && composer require slim/psr7

# Copy the custom Apache configuration file
COPY custom.conf /etc/apache2/conf-available/

# Enable the custom configuration and URL rewriting for Apache
RUN a2enconf custom \
    && a2enmod rewrite \
    && a2enmod headers

EXPOSE 80

# Set the working directory to the document root
WORKDIR /var/www/html
