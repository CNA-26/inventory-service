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
