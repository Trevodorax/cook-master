#!/bin/bash
cd /home/debian/cook-master
git pull --rebase
docker compose up -d && docker compose exec api npx prisma migrate dev --preview-feature
