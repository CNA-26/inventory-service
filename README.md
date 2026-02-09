# Inventory Service

## Deployed version

- API https://inventory-service-cna26-inventoryservice.2.rahtiapp.fi/api/
- Swagger Documentation: https://inventory-service-cna26-inventoryservice.2.rahtiapp.fi/

## Local development

```sh
npm run dev
```

- API: http://localhost:3000/api
- Swagger Documentation: http://localhost:3000

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
