This is a set of applications that will work together to allow Cook Master to manage their clients, their content and their partners easily.

It provides an admin access, a client access and a service provider access.

# The backend
## Laravel REST API
Laravel will allow us to easily create routes, while handling identification, permissions and other technical details.

It will be the single entrypoint of the backend, and will be used by all the other applications.

## MySQL database
The database will be accessed only by the REST API, and will store all the data of all the applications.

## C API fetcher
This program will use Curl to ...

It will be called by ...

The results will be used for ...

# NextJS web app
This web app will be the main interface.

It will provide all types of users with a personnalized dashboard, where they will be able to find every information they have permissions to access.

## For admins
Admins will have a complete yet well organized interface for browsing through the whole database (only the informations they can access of course).

They will be able to create, edit and delete users and content.

They will also have the possibility to create a manage events.

## For service providers
Service providers will have very easy access to their events, as well as possibility to create new ones or animate those created by admins.

They will also be able to create and manage their content.

## For clients
Clients will have access to their events, and to the content of the service providers.

They will have a complete events and service providers browsing functionnality to make sure they find everything they need.

## Link with backend
All this information will come from or be sent to the backend through the REST API.

The identification will be done via a session cookie.

Performance and SEO will be assured by using server side rendering, and by caching the data.

# Java mobile app

# Java desktop app
 
