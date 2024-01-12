## Backend checkpoint

This API was created using Typescript to run on a Node JS environment. Express framework was used for the architecture development, MongoDB for data storage and ORM Mongoose for modeling and managing the data in this logic layer.

There are 5 modules that integrates this API.
- Auth : used for user registration and login.
- Points: used for returning and validating existing points.
- Trucks: used for returning and validating existing trucks.
- Routes: CRUD for managing routes.
- Orders: CRUD for managing orders.

For deploying you can run from the root folder `npm run start`, or if prefered, `node dist/main.js`.

### Architecture

The Express app is instantiated on the `main.js` file in the root folder. Database models and connections are on de `db` folder. The rest of the logic (routes, controllers, middlewares) is organized on the `src` folder. 

Endpoint routes of each module are linked to the app on `main.js`, developed its correspondent `/src/routes/module.js` and related to its specific controller located on `/src/controllers/module.js`.

All endpoints requests must be handled with `Content-Type: application/json` header.
Only Auth module endpoints are public. The other modules' endpoints must include `Authorization: Bearer <JWT_TOKEN>` header to be processed. The JWT_TOKEN is provided by the API in the auth module as will be detailed further later.

All endpoints return a JSON object with a `success` boolean, a string `message` and, if specified, other value.
Errors are reported using HTTP status codes. Errors might be returned in an `errors` array.

Environmental variables, such as DB connection string and other Keys required to API functioning are specified in a `.env` file. See `.env.example` for its specification.

### Endpoints

**Auth module**
- `POST /auth/signup`: allows the user to register. Valid `email` and `password` must be provided.
- `POST /auth/signin`: allows the user to login. `token` is returned for further petitions authentication.

For both endpoints, valid `email` and `password` (minimum length: 8) must be provided.

**Points module**
- `GET /points/getAll`: returns an array with all existing points.

**Truck module**
- `GET /points/getAll`: returns an array with all existing trucks.

**Routes module**
- `GET /routes/getAll`: retrieves all existing routes.
- `POST /routes/create`: creates a route from `pointA` to `pointB`.
- `GET /routes/read`: retrieves an existing route. `pointA` and `pointB` are required.
- `PUT /routes/update`: updates an existing route. Names of the old and the new route must be provided in the payload using the structure `old.pointA`, `old.pointB`, `new.pointA` and `new.pointB`.
- `DELETE /routes/delete`: deletes an existing route using the names of `pointA` and `pointB`.

For CRUD endpoints, `pointA` and `pointB` are strings that must match the name of a valid _Points_ (those who belong to the collection).

For creating and updating _Routes_, _Points'_ coordenates and the distance between them are requested from Google Maps Api's.

**Orders module**
- `GET /orders/getAll`: retrieves all the orders.
- `POST /orders/create`: creates a new order. `description`, `route` and `truck` must be provided. `type` and `status` data are optional. If created, `orderId` is returned.
- `GET /orders/read`: returns the data of an existing order. `orderId` value is required.
- `PUT /orders/nextStatus`: updates the status of an order to the next status of the enum. `orderId` value is required.
- `PUT /orders/update`: updates the data of an existing order. `orderId` value is required. `description`, `route`, `truck`, `type` and `status` are optional. But if specified, updating is performed. 
- `DELETE /orders/delete`: deletes an existing order using the `orderId`.

The value fields format for this module are:
`type`: number in range 0 to 2. Maped to the `OrderType enum` which values are _Normal_, _Urgent_, _Fragile_. As the string values are stored in DB, number values are used on endpoints consumption.
`description`: string, length at least 4.
`route`: object, with two keys: `pickup` and `dropoff`. Both values must be strings with the names of valid _Points_, as in _Routes_ module.
`status`: number in range 0 to 3. Maped to the `Status enum` which values are stored in DB and are _Created_, _Scheduled_, _OnProgress_, _Completed_. As the string values are stored in DB, number values are used on endpoints consumption.
`truck`: string, it must be the `oid` of an existing truck.

Note that an order cannot be updated if order status is _OnProgress_ or _Completed_, and it cannot be deleted if order status is _OnProgress_.


### Future work
Tests have not been yet developed, due to the lack of time, but it is an important aspect that will be implemented.
