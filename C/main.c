#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "curl-8.0.1_6-win64-mingw/include/curl/curl.h"
#include <mysql.h>

// fonction de rappel pour écrire les données dans une chaîne de caractères
size_t write_callback(char *ptr, size_t size, size_t nmemb, char **data) {
    size_t new_size = size * nmemb;

    int data_size = *data ? strlen(*data) : 0;
    char *new_data = realloc(*data, data_size + new_size + 1);
    if (new_data == NULL) {
        fprintf(stderr, "Error: failed to allocate memory\n");
        return 0;
    }

    *data = new_data;
    memcpy(&((*data)[data_size]), ptr, new_size);
    data_size += new_size;
    (*data)[data_size] = '\0';

    return new_size;
}

int main(void) {
    CURL *curl;
    CURLcode response;
    char *data = NULL;
    int data_size = 0;
    char *phrase = NULL;

    curl_global_init(CURL_GLOBAL_ALL);

    curl = curl_easy_init();
    if(curl) {
        curl_easy_setopt(curl, CURLOPT_URL, "https://api.kanye.rest");

        // récupérer la réponse de l'API
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &data);
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);

        response = curl_easy_perform(curl);

        if(response != CURLE_OK) {
            fprintf(stderr, "Request failed: %s\n", curl_easy_strerror(response));
        } else {
            printf("Request succeeded: %d\n", response);
            phrase = data;

            // extraire la citation de la réponse de l'API
            char *citation = NULL;
            char *quote_start = strstr(data, "\"quote\":\"");
            if (quote_start != NULL) {
                quote_start += strlen("\"quote\":\"");
                char *quote_end = strchr(quote_start, '\"');
                if (quote_end != NULL) {
                    int len = quote_end - quote_start;
                    citation = malloc(len + 1);
                    strncpy(citation, quote_start, len);
                    citation[len] = '\0';
                }
            }

            // connexion à la base de données MySQL
            MYSQL *conn = mysql_init(NULL);
            if (conn == NULL) {
                fprintf(stderr, "Error: %s\n", mysql_error(conn));
                return EXIT_FAILURE;
            }
            if (mysql_real_connect(conn, "localhost", "root", "root", "cook_master", 8889, NULL, 0) == NULL) {
                fprintf(stderr, "Error: %s\n", mysql_error(conn));
                mysql_close(conn);
                return EXIT_FAILURE;
            }

            // préparer la requête SQL
            char query[1000];
            if (citation != NULL) {
                char *query = "INSERT INTO quote (response) VALUES (?)";
                MYSQL_STMT *stmt = mysql_stmt_init(conn);
                if (stmt == NULL) {
                    fprintf(stderr, "Error: %s\n", mysql_error(conn));
                    mysql_close(conn);
                    return EXIT_FAILURE;
                }
                if (mysql_stmt_prepare(stmt, query, strlen(query)) != 0) {
                    fprintf(stderr, "Error: %s\n", mysql_error(conn));
                    mysql_stmt_close(stmt);
                    mysql_close(conn);
                    return EXIT_FAILURE;
                }

                // lier les paramètres de la requête SQL
                MYSQL_BIND param;
                memset(&param, 0, sizeof(MYSQL_BIND));
                param.buffer_type = MYSQL_TYPE_STRING;
                param.buffer = citation;
                param.buffer_length = strlen(citation);
                if (mysql_stmt_bind_param(stmt, &param) != 0) {
                    fprintf(stderr, "Error: %s\n", mysql_error(conn));
                    mysql_stmt_close(stmt);
                    mysql_close(conn);
                    return EXIT_FAILURE;
                }

                // exécuter la requête SQL
                if (mysql_stmt_execute(stmt) != 0) {
                    fprintf(stderr, "Error: %s\n", mysql_error(conn));
                    mysql_stmt_close(stmt);
                    mysql_close(conn);
                    return EXIT_FAILURE;
                }

                mysql_stmt_close(stmt);
                free(citation);
            }
            mysql_close(conn);
        }
        curl_easy_cleanup(curl);
    }
    curl_global_cleanup();
    return 0;
}
