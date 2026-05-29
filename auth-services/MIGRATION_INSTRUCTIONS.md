# Prisma Migration Guide

## Complete Migration Process

### Step 1: Generate and Apply Migration

Run this command to create a new migration based on schema changes:

```bash
cd backend/auth-services
npx prisma migrate dev --name add_refresh_token_and_terminated
```

**What this does:**
- Compares your `schema.prisma` with the current database state
- Generates SQL migration file in `prisma/migrations/`
- Applies the migration to your database
- Regenerates Prisma Client with new fields

**Expected Output:**
```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "authdb", schema "public" at "localhost:5432"

Migration `20240XXX_add_refresh_token_and_terminated` created successfully.

The following migration(s) have been applied:

migrations/
  └─ 20240XXX_add_refresh_token_and_terminated/
    └─ migration.sql

✔ Generated Prisma Client
```

### Step 2: Verify Migration File

Check the generated SQL in `prisma/migrations/[timestamp]_add_refresh_token_and_terminated/migration.sql`

### Step 3: Regenerate Prisma Client (if needed)

If you make additional schema changes without migrating:

```bash
npx prisma generate
```

**When to use:**
- After pulling schema changes from git
- After manually editing schema without running migrate
- To refresh TypeScript types

## Common Prisma Commands Reference

### Development Workflow

```bash
# 1. Create and apply migration (use this most often)
npx prisma migrate dev --name descriptive_migration_name

# 2. Generate Prisma Client only (no DB changes)
npx prisma generate

# 3. View database in browser GUI
npx prisma studio

# 4. Reset database (WARNING: deletes all data)
npx prisma migrate reset

# 5. Check migration status
npx prisma migrate status

# 6. Format schema file
npx prisma format
```

### Production Workflow

```bash
# Deploy pending migrations (doesn't create new ones)
npx prisma migrate deploy

# Resolve migration issues
npx prisma migrate resolve --applied "migration_name"
npx prisma migrate resolve --rolled-back "migration_name"
```

## Migration Workflow Explained

### When You Change schema.prisma:

1. **Edit** `prisma/schema.prisma`
2. **Run** `npx prisma migrate dev --name your_change_description`
3. **Commit** both `schema.prisma` and the new migration folder
4. **Push** to git

### When Teammate Changes schema.prisma:

1. **Pull** latest code from git
2. **Run** `npx prisma migrate dev` (applies pending migrations)
3. **Continue** development

### If Migration Fails:

```bash
# Check what went wrong
npx prisma migrate status

# Option 1: Fix and retry
# Edit schema.prisma to fix the issue
npx prisma migrate dev

# Option 2: Reset everything (DELETES DATA)
npx prisma migrate reset

# Option 3: Mark as resolved and continue
npx prisma migrate resolve --applied "migration_name"
```

## Troubleshooting

### Error: "Migration failed to apply"

```bash
# Check current state
npx prisma migrate status

# If migration is partially applied
npx prisma migrate resolve --rolled-back "migration_name"

# Then retry
npx prisma migrate dev
```

### Error: "Prisma Client is not generated"

```bash
npx prisma generate
```

### Error: "Database is out of sync"

```bash
# For development (DELETES ALL DATA)
npx prisma migrate reset

# For production (creates baseline)
npx prisma migrate resolve --applied "migration_name"
```

### Error: "Cannot connect to database"

1. Check `.env` file has correct `DATABASE_URL`
2. Verify PostgreSQL is running
3. Test connection:
   ```bash
   npx prisma db pull
   ```

## Rollback Instructions

### Option 1: Revert Migration (Safe)

```bash
# 1. Create a new migration that undoes the changes
npx prisma migrate dev --name revert_changes
```

Manually edit the generated SQL to undo your changes.

### Option 2: Reset Database (DELETES DATA)

```bash
# This will:
# - Drop the database
# - Recreate it
# - Apply all migrations from scratch
npx prisma migrate reset
```

### Option 3: Manual Rollback

```bash
# Mark migration as rolled back
npx prisma migrate resolve --rolled-back "migration_name"
```

## Best Practices

1. **Always backup** production database before migrating
2. **Test migrations** in development first
3. **Use descriptive names** for migrations
4. **Commit migrations** with schema changes
5. **Never edit** applied migration files
6. **Use `migrate deploy`** in production, not `migrate dev`
7. **Review generated SQL** before applying

## Quick Reference Card

```bash
# Most common commands you'll use:

# After changing schema.prisma
npx prisma migrate dev --name your_change

# After pulling from git
npx prisma migrate dev

# View database
npx prisma studio

# Reset everything (dev only)
npx prisma migrate reset

# Check status
npx prisma migrate status
```
