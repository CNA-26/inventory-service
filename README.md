# Inventory Service

## Deployed version

- API https://inventory-service-cna26-inventoryservice.2.rahtiapp.fi/api/
- Swagger Documentation: https://inventory-service-cna26-inventoryservice.2.rahtiapp.fi/docs

## Authentication

This service uses API key authentication for all endpoints. Include one of the following in your requests:

**Header options:**
- `X-API-Key: inventory-beta-key-2026`
- `Authorization: Bearer inventory-beta-key-2026`

**Example with curl:**
```bash
curl -H "X-API-Key: inventory-beta-key-2026" https://inventory-service-cna26-inventoryservice.2.rahtiapp.fi/api/products
```

## Integration Testing

For detailed integration testing instructions, see [INTEGRATION_TESTING.md](INTEGRATION_TESTING.md)

## Database Setup

This service uses PostgreSQL as its database. For CSC Rahti deployment:

### Existing Rahti Database

Your project already has a PostgreSQL database running. To connect to it:

1. **Find your database service details** in the Rahti web console:
   - Go to your project dashboard
   - Navigate to **Services** → **postgresql**
   - Note the service name (likely `postgresql.cna26-inventoryservice.svc.cluster.local`)

2. **Get database credentials** from the secret:
   - Go to **Resources** → **Secrets** → **postgresql**
   - Note the values for:
     - `database-name`
     - `database-user`
     - `database-password`

3. **Set environment variables** in your deployment:
   ```
   DB_HOST=postgresql.cna26-inventoryservice.svc.cluster.local
   DB_PORT=5432
   DB_NAME=<value from database-name secret>
   DB_USER=<value from database-user secret>
   DB_PASSWORD=<value from database-password secret>
   DB_SSL=true
   ```

### Local Development Database

For local development, you can use a local PostgreSQL instance or Docker:

```sh
# Using Docker
docker run --name postgres-inventory -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=inventory -p 5432:5432 -d postgres:13

# Or install PostgreSQL locally and create the database
createdb inventory
```

Copy `.env.example` to `.env` and update the database configuration:

```sh
cp .env.example .env
# Edit .env with your database credentials
```

## Local development

```sh
npm run dev
```

- API: http://localhost:3000/api
- Swagger Documentation: http://localhost:3000/docs

## Build and run

```sh
npm run build
```

```sh
npm start
```

## Build & run Docker image

```sh
docker build -t inventory-service .
```

```sh
docker run -p 3000:3000 inventory-service
```
