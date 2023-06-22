# Launching the app

## create the .env files

Find all the .env.example files

create a .env with the right values for each, located in the same folder as the .env.example

## run with docker-compose
### In the api's .env

Use the database container name in the URL

### Launch the docker-compose and run migrations

`docker-compose up --build`

`docker-compose exec <backend-container> npx prisma migrate dev --preview-feature`

## run with npm
### In the api's .env

Use 127.0.0.1 for the database instead of the db container name
### In frontend folder

`npm install`

`npm run dev`

### In api folder

`npm install`

`npx prisma generate`

`npm run db:dev:restart`

`npm run start:dev`
