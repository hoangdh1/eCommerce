# E-Commerce

API endpoints will implement the Restful API standard

The main usecases of the system include: admin, customer, shipper, product, order, cart

- Users can login, register, forgot password and delete their account
- About products: get product list, view details, order, add/remove products to cart, search product information
- About the order: view the status of the order, cancel the order
- Shipper: get list and change order status
- Admin can perform CRUD functions for users, products, orders. In addition, the admin can
  - Statistical the number of best-selling products by day, products in stock, customize product prices in a certain period of time
  - Limit the number of products purchased by each user
  - Change order status
  - Deactivate the shipper account, assign orders to shipper

## Technology
- Node version: v16 (use `Express`)
- Database: postgres v12
- Cache/Queue: Redis and bull queue with redis
- Typescript
- `Awillix` to folow pattern: Dependency Injection to clean code and reuse/replace easy compoment
- Swagger with autogen to gen document  
- ORM: use sequelize with postgres
- Docker in env development local

## Start server
- start docker application
- cd to src, run: `docker compose up`
- run: `yarn start` to start server to local