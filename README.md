# Warehouse Management System Frontend

This repository contains the Angular frontend for the Warehouse Management System. It provides the user interface for viewing warehouse data and working with the backend service through a browser-based application.

## Service Overview

The frontend is organised around feature pages and typed service integration:

- `dashboard` for live warehouse totals and low-stock alerts
- `suppliers` for supplier creation and status management
- `inventory` for stock item registration and stock receipt workflows
- `orders` for the future order processing interface
- `finance` for the future financial reporting interface

The current implementation connects the dashboard, supplier, and inventory screens to the Spring Boot backend through a local proxy configuration.

## Technology

- Angular 20
- TypeScript
- SCSS
- RxJS
- Karma and Jasmine

## Running The Frontend

From the repository root:

```bash
npm install
npm start
```

Default address:

```text
http://127.0.0.1:4200
```

## Testing

```bash
npm test
```

## Configuration

Frontend proxy settings are defined in [proxy.conf.json](/Users/arnabsubedi/Documents/Warehouse%20Management%20System%20for%20BNU%20Industry%20Solutions%20Ltd/frontend/proxy.conf.json).

Current local configuration:

- frontend address: `http://127.0.0.1:4200`
- backend proxy target: `http://127.0.0.1:8090`
- proxied API base path: `/api`

## Application Structure

```text
src/app
|- interface
|- services/warehouse-api
|- features/dashboard
|- features/suppliers
|- features/inventory
|- features/orders
|- features/finance
```

## Notes

- The frontend expects the backend service to be running locally for live data.
- Dashboard, supplier, and inventory screens are currently integrated with the backend.
- Orders and finance pages remain placeholders until their backend endpoints are implemented.
