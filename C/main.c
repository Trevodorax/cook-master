#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <curl/curl.h>
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

// fonction pour envoyer une requête à une API
int send_request(const char *url, char **data) {
    CURL *curl;
    CURLcode response;

    curl_global_init(CURL_GLOBAL_ALL);

    curl = curl_easy_init();
    if(curl) {
        curl_easy_setopt(curl, CURLOPT_URL, url);
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_callback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, data);
        curl_easy_setopt(curl, CURLOPT_SSL_VERIFYPEER, 0L);

        response = curl_easy_perform(curl);
        curl_easy_cleanup(curl);
    } else {
        return -1;
    }
    curl_global_cleanup();
    return (response == CURLE_OK) ? 0 : -1;
}

// fonction pour traiter la réponse de l'API
char* process_response(char *data) {
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
    return citation;
}

// fonction pour se connecter à la base de données
MYSQL* connect_to_database() {
    MYSQL *conn = mysql_init(NULL);
    if (conn == NULL) {
        fprintf(stderr, "Error: %s\n", mysql_error(conn));
        return NULL;
    }
    if (mysql_real_connect(conn, "localhost", "root", "root", "cook_master", 8889, NULL, 0) == NULL) {
        fprintf(stderr, "Error: %s\n", mysql_error(conn));
        mysql_close(conn);
        return NULL;
    }
    return conn;
}

// fonction pour insérer des données dans la base de données
int insert_into_database(MYSQL *conn, char *citation) {
    char query[] = "INSERT INTO quote (response) VALUES (?)";
    MYSQL_STMT *stmt = mysql_stmt_init(conn);
    if (stmt == NULL) {
        fprintf(stderr, "Error: %s\n", mysql_error(conn));
        mysql_close(conn);
        return -1;
    }
    if (mysql_stmt_prepare(stmt, query, strlen(query)) != 0) {
        fprintf(stderr, "Error: %s\n", mysql_error(conn));
        mysql_stmt_close(stmt);
        mysql_close(conn);
        return -1;
    }

    MYSQL_BIND param;
    memset(&param, 0, sizeof(MYSQL_BIND));
    param.buffer_type = MYSQL_TYPE_STRING;
    param.buffer = citation;
    param.buffer_length = strlen(citation);
    if (mysql_stmt_bind_param(stmt, &param) != 0) {
        fprintf(stderr, "Error: %s\n", mysql_error(conn));
        mysql_stmt_close(stmt);
        mysql_close(conn);
        return -1;
    }

    if (mysql_stmt_execute(stmt) != 0) {
        fprintf(stderr, "Error: %s\n", mysql_error(conn));
        mysql_stmt_close(stmt);
        mysql_close(conn);
        return -1;
    }

    mysql_stmt_close(stmt);
    return 0;
}

// fonction principale
int main(int argc, char *argv[]) {
    if (argc < 2) {
        fprintf(stderr, "Usage: %s url\n", argv[0]);
        return EXIT_FAILURE;
    }

    char *data = NULL;
    if (send_request(argv[1], &data) != 0) {
        fprintf(stderr, "Request failed\n");
        return EXIT_FAILURE;
    }

    char *citation = process_response(data);
    free(data);
    if (citation == NULL) {
        fprintf(stderr, "Failed to process API response\n");
        return EXIT_FAILURE;
    }

    MYSQL *conn = connect_to_database();
    if (conn == NULL) {
        free(citation);
        return EXIT_FAILURE;
    }

    if (insert_into_database(conn, citation) != 0) {
        fprintf(stderr, "Failed to insert into database\n");
        free(citation);
        return EXIT_FAILURE;
    }

    free(citation);
    mysql_close(conn);
    return 0;
}