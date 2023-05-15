# Launching the app

## create the .env files

- Find all the .env.example files
- create a .env with the right values for each, located in the same folder as the .env.example

## launch the containers

- `docker-compose up --build`

## run the migration

- `docker-compose exec api npx prisma migrate dev --preview-feature`
