cmake_minimum_required(VERSION 3.23)
project(test_curl_mysql C)

set(CMAKE_C_STANDARD 99)

# Ajouter le répertoire d'inclusion pour Curl
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/curl-8.0.1_6-win64-mingw/include)

# Ajouter le répertoire de bibliothèques pour Curl
link_directories(${CMAKE_CURRENT_SOURCE_DIR}/curl-8.0.1_6-win64-mingw/lib)

# Ajouter le répertoire d'inclusion pour MySQL
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/mysql-connector-c-6.1.11-winx64/include)

# Ajouter le répertoire de bibliothèques pour MySQL
link_directories(${CMAKE_CURRENT_SOURCE_DIR}/mysql-connector-c-6.1.11-winx64/lib)

# Ajouter le fichier exécutable pour le code combiné
add_executable(test_curl_mysql main.c)

# Lier les bibliothèques Curl et MySQL pour le code combiné
target_link_libraries(test_curl_mysql curl mysql)
