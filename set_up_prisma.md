# Everytime you change something prisma related

npx prisma generate     # 1. generate client from schema
npm run db:migrate      # 2. create/update tables in PostgreSQL
npm run dev