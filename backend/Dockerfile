# Use the official PHP image with Apache support
FROM php:7.4-apache

# Copy the API file to the document root
COPY index.php /var/www/html/

# Install required system packages and PHP extensions
RUN docker-php-ext-install pdo_mysql mysqli

# Copy the custom Apache configuration file
COPY custom.conf /etc/apache2/conf-available/

# Enable the custom configuration and URL rewriting for Apache
RUN a2enconf custom \
    && a2enmod rewrite \
    && a2enmod headers

EXPOSE 80

# Set the working directory to the document root
WORKDIR /var/www/html
