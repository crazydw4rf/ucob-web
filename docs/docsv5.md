# UCOB API Documentation

> **Version:** 1.0.0  
> **OpenAPI:** 3.1.0  
> **Description:** REST API backend service for the UCOB (Used Cooking Oil Bank) web application.

---

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Auth](#auth)
  - [User](#user) *(incl. partial address update)*
  - [Oil](#oil)
  - [Transaction](#transaction)
  - [Payment](#payment)
- [Schemas](#schemas)
  - [Enumerations](#enumerations)
  - [Request Bodies](#request-bodies)
  - [Response Objects](#response-objects)
  - [Error Handling](#error-handling)

---

## Overview

The UCOB API is a RESTful backend for managing a Used Cooking Oil Bank platform. It supports user registration and authentication, oil stock and pricing management, buy/sell transactions, and payment processing via webhook integration.

All endpoints are prefixed with `/v1`.

### Response Format

All successful responses follow this envelope structure:

```json
{
  "success": true,
  "code": 200,
  "data": { ... }
}
```

All error responses follow this structure:

```json
{
  "success": false,
  "code": 500,
  "error": {
    "kind": "InternalServer",
    "message": "Error message here"
  }
}
```

---

## Authentication

The API uses session-based authentication. After logging in via `POST /v1/auth/login`, a session token is issued. This token must be included in subsequent requests. Logging out via `POST /v1/auth/logout` invalidates the session.

Some endpoints are restricted to **Admin** users only — these are noted in their descriptions.

---

## Endpoints

### Auth

#### `POST /v1/auth/login`

Authenticate a user and create a session.

**Request Body** (`application/json`) — required

| Field    | Type   | Required | Description        |
|----------|--------|----------|--------------------|
| email    | string | ✅       | User's email       |
| password | string | ✅       | User's password    |

**Example Request:**
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Responses:**

| Status | Description                  |
|--------|------------------------------|
| 200    | Login successful             |
| 500    | Internal server error → [`ErrorResponse`](#errorresponse) |

---

#### `POST /v1/auth/logout`

Invalidate the current user session.

**Responses:**

| Status | Description                                |
|--------|--------------------------------------------|
| 204    | Logout successful (no content)             |
| 400    | Token not found                            |
| 500    | Internal server error → [`ErrorResponse`](#errorresponse) |

---

### User

#### `POST /v1/users`

Register a new user account.

**Request Body** (`application/json`) — required

| Field    | Type   | Required | Description     |
|----------|--------|----------|-----------------|
| username | string | ✅       | Desired username |
| email    | string | ✅       | User's email    |
| password | string | ✅       | User's password |

**Example Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "strongpassword"
}
```

**Responses:**

| Status | Description                  |
|--------|------------------------------|
| 201    | User created successfully    |
| 500    | Internal server error → [`ErrorResponse`](#errorresponse) |

---

#### `GET /v1/users/me`

Retrieve data for the currently authenticated user.

**Responses:**

| Status | Description                                       |
|--------|---------------------------------------------------|
| 200    | Success → [`HttpResponse_User`](#httpresponse_user) |
| 500    | Internal server error → [`ErrorResponse`](#errorresponse) |

---

#### `GET /v1/users/address`

Retrieve the address of the currently authenticated user.

**Responses:**

| Status | Description                                                   |
|--------|---------------------------------------------------------------|
| 200    | Success → [`HttpResponse_UserAddress`](#httpresponse_useraddress) |
| 500    | Internal server error → [`ErrorResponse`](#errorresponse)         |

---

#### `POST /v1/users/address`

Add an address for the current user.

**Request Body** (`application/json`) — required

| Field    | Type   | Required | Description              |
|----------|--------|----------|--------------------------|
| district | string | ✅       | District name            |
| village  | string | ✅       | Village name             |
| details  | string | ✅       | Detailed address info    |

**Example Request:**
```json
{
  "district": "Gondokusuman",
  "village": "Baciro",
  "details": "Jl. Melati No. 5, RT 02/RW 03"
}
```

**Responses:**

| Status | Description                                                   |
|--------|---------------------------------------------------------------|
| 200    | Success → [`HttpResponse_UserAddress`](#httpresponse_useraddress) |
| 500    | Internal server error → [`ErrorResponse`](#errorresponse)         |

---

#### `PATCH /v1/users/address`

Partially update the address of the current user. All fields are optional — only include the fields you want to change.

**Request Body** (`application/json`) — required

| Field    | Type           | Required | Description              |
|----------|----------------|----------|--------------------------|
| district | string \| null | ❌       | Updated district name    |
| village  | string \| null | ❌       | Updated village name     |
| details  | string \| null | ❌       | Updated address details  |

**Example Request** (updating only district and details):
```json
{
  "district": "Umbulharjo",
  "details": "Jl. Veteran No. 12, RT 01/RW 05"
}
```

**Responses:**

| Status | Description                                                   |
|--------|---------------------------------------------------------------|
| 200    | Success → [`HttpResponse_UserAddress`](#httpresponse_useraddress) |
| 500    | Internal server error → [`ErrorResponse`](#errorresponse)         |

---

### Oil

#### `GET /v1/oil`

Retrieve current oil stock information.

**Responses:**

| Status | Description                                       |
|--------|---------------------------------------------------|
| 200    | Success → [`HttpResponse_Oil`](#httpresponse_oil) |
| 500    | Internal server error → [`ErrorResponse`](#errorresponse) |

---

#### `POST /v1/oil`

Update the oil stock. **Admin only.**

**Request Body** (`application/json`) — required

| Field | Type  | Required | Description                                      |
|-------|-------|----------|--------------------------------------------------|
| delta | float | ✅       | Stock change amount (positive = add, negative = subtract) |

**Example Request:**
```json
{
  "delta": 50.5
}
```

**Responses:**

| Status | Description                                       |
|--------|---------------------------------------------------|
| 200    | Success → [`HttpResponse_Oil`](#httpresponse_oil) |
| 500    | Internal server error → [`ErrorResponse`](#errorresponse) |

---

#### `GET /v1/oil/price`

Get current oil price by type.

**Query Parameters:**

| Parameter  | Type                        | Required | Description          |
|------------|-----------------------------|----------|----------------------|
| price_type | [`PriceType`](#pricetype)   | ✅       | `Buy` or `Sell`      |

**Example:** `GET /v1/oil/price?price_type=Buy`

**Responses:**

| Status | Description                                                   |
|--------|---------------------------------------------------------------|
| 200    | Success → [`HttpResponse_OilPrices`](#httpresponse_oilprices) |
| 500    | Internal server error → [`ErrorResponse`](#errorresponse)     |

---

#### `POST /v1/oil/price`

Update the oil price. **Admin only.**

**Request Body** (`application/json`) — required

| Field      | Type                        | Required | Description         |
|------------|-----------------------------|----------|---------------------|
| price      | integer (int32)             | ✅       | Price value         |
| price_type | [`PriceType`](#pricetype)   | ✅       | `Buy` or `Sell`     |

**Example Request:**
```json
{
  "price": 5000,
  "price_type": "Buy"
}
```

**Responses:**

| Status | Description                                                   |
|--------|---------------------------------------------------------------|
| 200    | Success → [`HttpResponse_OilPrices`](#httpresponse_oilprices) |
| 500    | Internal server error → [`ErrorResponse`](#errorresponse)     |

---

### Transaction

#### `GET /v1/transaction`

List transactions for the current user with pagination.

**Query Parameters:**

| Parameter | Type            | Required | Description            |
|-----------|-----------------|----------|------------------------|
| page      | integer (int64) | ✅       | Page number (1-based)  |
| page_size | integer (int64) | ✅       | Number of items/page   |

**Example:** `GET /v1/transaction?page=1&page_size=10`

**Responses:**

| Status | Description                                                               |
|--------|---------------------------------------------------------------------------|
| 200    | Success → [`HttpResponse_Vec_Transaction`](#httpresponse_vec_transaction) |
| 500    | Internal server error → [`ErrorResponse`](#errorresponse)                 |

---

#### `POST /v1/transaction`

Create a new purchase or sale transaction.

**Request Body** (`application/json`) — required

| Field            | Type                                        | Required | Description                            |
|------------------|---------------------------------------------|----------|----------------------------------------|
| oil_volume       | float                                       | ✅       | Volume of oil (liters)                 |
| transaction_type | [`TransactionType`](#transactiontype)       | ✅       | `Purchase` or `Sale`                   |
| payment_method   | [`PaymentMethod`](#paymentmethod)           | ✅       | `Qris` or `Cod`                        |
| address_district | string                                      | ✅       | Delivery district                      |
| address_village  | string                                      | ✅       | Delivery village                       |
| address_details  | string                                      | ✅       | Delivery address details               |
| sale_image_url   | string \| null                              | ❌       | Image URL for sale proof (optional)    |

**Example Request:**
```json
{
  "oil_volume": 10.5,
  "transaction_type": "Sale",
  "payment_method": "Qris",
  "address_district": "Gondokusuman",
  "address_village": "Baciro",
  "address_details": "Jl. Melati No. 5",
  "sale_image_url": null
}
```

**Responses:**

| Status | Description                                                     |
|--------|-----------------------------------------------------------------|
| 201    | Created → [`HttpResponse_Transaction`](#httpresponse_transaction) |
| 500    | Internal server error → [`ErrorResponse`](#errorresponse)       |

---

#### `GET /v1/transaction/admin`

List all transactions (paginated). **Admin only.**

**Query Parameters:**

| Parameter | Type            | Required | Description           |
|-----------|-----------------|----------|-----------------------|
| page      | integer (int64) | ✅       | Page number (1-based) |
| page_size | integer (int64) | ✅       | Items per page        |

**Responses:**

| Status | Description                                                               |
|--------|---------------------------------------------------------------------------|
| 200    | Success → [`HttpResponse_Vec_Transaction`](#httpresponse_vec_transaction) |
| 500    | Internal server error → [`ErrorResponse`](#errorresponse)                 |

---

#### `GET /v1/transaction/{id}`

Retrieve a single transaction by ID.

**Path Parameters:**

| Parameter | Type                                    | Required | Description    |
|-----------|-----------------------------------------|----------|----------------|
| id        | [`TransactionId`](#transactionid) (int32) | ✅     | Transaction ID |

**Responses:**

| Status | Description                                                     |
|--------|-----------------------------------------------------------------|
| 200    | Success → [`HttpResponse_Transaction`](#httpresponse_transaction) |
| 500    | Internal server error → [`ErrorResponse`](#errorresponse)       |

---

#### `GET /v1/transaction/details/{transaction_id}`

Retrieve detailed information about a transaction (address, sale image, etc.).

**Path Parameters:**

| Parameter      | Type                                    | Required | Description    |
|----------------|-----------------------------------------|----------|----------------|
| transaction_id | [`TransactionId`](#transactionid) (int32) | ✅     | Transaction ID |

**Responses:**

| Status | Description                                                                   |
|--------|-------------------------------------------------------------------------------|
| 200    | Success → [`HttpResponse_TransactionDetails`](#httpresponse_transactiondetails) |
| 500    | Internal server error → [`ErrorResponse`](#errorresponse)                     |

---

#### `GET /v1/transaction/payment/{transaction_id}`

Retrieve payment information for a transaction.

**Path Parameters:**

| Parameter      | Type                                      | Required | Description    |
|----------------|-------------------------------------------|----------|----------------|
| transaction_id | [`TransactionId`](#transactionid) (int32) | ✅       | Transaction ID |

**Responses:**

| Status | Description                                                       |
|--------|-------------------------------------------------------------------|
| 200    | Success → [`HttpResponse_Payment`](#httpresponse_payment)         |
| 500    | Internal server error → [`ErrorResponse`](#errorresponse)         |

> **📌 Frontend Note — Redirecting to the Payment Page**
>
> After retrieving payment info, use the `order_id` and `amount` fields from the response to build the Pakasir payment page URL:
>
> ```
> https://app.pakasir.com/pay/{slug}/{amount}?order_id={order_id}
> ```
>
> | Parameter  | Description                                                              |
> |------------|--------------------------------------------------------------------------|
> | `slug`     | Project name — always `ucob`                                             |
> | `amount`   | Transaction amount as a plain integer, no dots or spaces (e.g. `100000`) |
> | `order_id` | The `order_id` value from the payment response                           |
>
> **Example:**
> ```
> https://app.pakasir.com/pay/ucob/22000?order_id=240910HDE7C9
> ```
>
> Redirect the user to this URL to complete payment.

---

#### `PATCH /v1/transaction/status/{transaction_id}`

Update the status of a transaction.

**Path Parameters:**

| Parameter      | Type                                      | Required | Description    |
|----------------|-------------------------------------------|----------|----------------|
| transaction_id | [`TransactionId`](#transactionid) (int32) | ✅       | Transaction ID |

**Request Body** (`application/json`) — required

| Field              | Type                                          | Required | Description      |
|--------------------|-----------------------------------------------|----------|------------------|
| transaction_status | [`TransactionStatus`](#transactionstatus)     | ✅       | New status value |

**Example Request:**
```json
{
  "transaction_status": "Processing"
}
```

**Responses:**

| Status | Description                                                     |
|--------|-----------------------------------------------------------------|
| 200    | Success → [`HttpResponse_Transaction`](#httpresponse_transaction) |
| 500    | Internal server error → [`ErrorResponse`](#errorresponse)       |

---

#### `POST /v1/transaction/upload-url`

Request a presigned URL for uploading a sale proof image.

**Request Body** (`application/json`) — required

| Field     | Type   | Required | Example       | Description               |
|-----------|--------|----------|---------------|---------------------------|
| mime_type | string | ✅       | `image/png`   | MIME type of the image    |

**Example Request:**
```json
{
  "mime_type": "image/jpeg"
}
```

**Responses:**

| Status | Description                                                                                       |
|--------|---------------------------------------------------------------------------------------------------|
| 200    | Success → [`HttpResponse_TransactionSaleUploadUrlResponse`](#httpresponse_transactionsaleuploadurlresponse) |
| 500    | Internal server error → [`ErrorResponse`](#errorresponse)                                         |

> **📌 Frontend Note — Building the Public Image URL**
>
> The response returns a `public_url_path` in the format `/{bucket_name}/{directory}/{file_name}`. To construct the full publicly accessible URL, prepend the base object storage URL from your environment variable:
>
> ```
> VITE_BASE_PUBLIC_OBJECT_STORAGE_URL=https://xxxx.supabase.co/storage/v1/object/public
> ```
>
> **Full URL formula:**
> ```
> {VITE_BASE_PUBLIC_OBJECT_STORAGE_URL}{public_url_path}
> ```
>
> **Example:**
> ```
> https://xxxx.supabase.co/storage/v1/object/public/ucob-bucket/sale-images/abc123.png
> ```
>
> This constructed URL is what should be stored as `sale_image_url` when creating a transaction.

---

### Payment

#### `POST /v1/payment/webhook`

Webhook endpoint called by the payment gateway (Pakasir) when a successful transaction completes.

> ⚠️ This endpoint is intended for internal use by the payment gateway service, not for end users.

**Request Body** (`application/json`) — required

| Field          | Type            | Required | Description                         |
|----------------|-----------------|----------|-------------------------------------|
| amount         | integer (int32) | ✅       | Transaction amount                  |
| order_id       | string          | ✅       | Unique order identifier             |
| project        | string          | ✅       | Project identifier                  |
| status         | string          | ✅       | Payment status from gateway         |
| payment_method | string          | ✅       | Method used (e.g., QRIS, COD)       |
| completed_at   | string (datetime) | ✅     | Completion timestamp (ISO 8601)     |

**Example Request:**
```json
{
  "amount": 52500,
  "order_id": "ORDER-20240101-001",
  "project": "ucob",
  "status": "success",
  "payment_method": "QRIS",
  "completed_at": "2024-01-01T12:00:00Z"
}
```

**Responses:**

| Status | Description       |
|--------|-------------------|
| 200    | Webhook received  |

---

## Schemas

### Enumerations

#### `PriceType`
Determines whether a price applies to buying or selling oil.

| Value  | Description               |
|--------|---------------------------|
| `Buy`  | Price for buying oil      |
| `Sell` | Price for selling oil     |

---

#### `PaymentMethod`
Supported payment methods.

| Value  | Description                       |
|--------|-----------------------------------|
| `Qris` | QR code-based payment (QRIS)      |
| `Cod`  | Cash on delivery                  |

---

#### `PaymentStatus`
Status of a payment.

| Value       | Description                          |
|-------------|--------------------------------------|
| `Pending`   | Payment initiated, not yet confirmed |
| `Completed` | Payment successfully confirmed       |

---

#### `TransactionType`
Direction of the transaction.

| Value      | Description                          |
|------------|--------------------------------------|
| `Purchase` | User buys oil from the bank          |
| `Sale`     | User sells oil to the bank           |

---

#### `TransactionStatus`
Lifecycle status of a transaction.

| Value        | Description                              |
|--------------|------------------------------------------|
| `Unpaid`     | Created but not yet paid                 |
| `Pending`    | Payment submitted, pending verification  |
| `Processing` | Verified and being processed             |
| `Rejected`   | Rejected by admin                        |
| `Delivered`  | Oil has been delivered                   |
| `Done`       | Transaction fully completed              |

---

#### `UserRole`
Role assigned to a user account.

| Value   | Description               |
|---------|---------------------------|
| `Admin` | Administrator privileges  |
| `User`  | Regular user              |

---

#### `ErrorKind`
Categorizes the type of error.

| Value                | Description                              |
|----------------------|------------------------------------------|
| `InternalServer`     | Unexpected server-side error             |
| `NotFound`           | Requested resource does not exist        |
| `ResourceConflict`   | Conflict with existing resource          |
| `ForeignKeyViolation`| Referential integrity violation          |
| `SessionExpired`     | User session has expired                 |
| `TokenInvalid`       | Provided token is invalid                |
| `CredentialsInvalid` | Email or password is incorrect           |
| `HashingPassword`    | Error during password hashing            |
| `ServiceInit`        | Service initialization failure           |
| `StorageService`     | Storage/cloud service error              |
| `BadRequest`         | Malformed or invalid request data        |

---

### Request Bodies

#### `UserCreate`
```json
{
  "username": "string",   // required
  "email": "string",      // required
  "password": "string"    // required
}
```

#### `UserLogin`
```json
{
  "email": "string",      // required
  "password": "string"    // required
}
```

#### `UserAddressCreate`
```json
{
  "district": "string",   // required
  "village": "string",    // required
  "details": "string"     // required
}
```

#### `UserAddressUpdate`
All fields are optional. Only include the fields you want to update.
```json
{
  "district": "string | null",   // optional
  "village": "string | null",    // optional
  "details": "string | null"     // optional
}
```

#### `OilSetStockRequest`
```json
{
  "delta": 0.0            // float, required — positive to add, negative to subtract
}
```

#### `OilPriceSetRequest`
```json
{
  "price": 0,             // integer (int32), required
  "price_type": "Buy"     // PriceType, required
}
```

#### `TransactionCreateRequest`
```json
{
  "oil_volume": 0.0,             // float, required
  "transaction_type": "Purchase",// TransactionType, required
  "payment_method": "Qris",      // PaymentMethod, required
  "address_district": "string",  // required
  "address_village": "string",   // required
  "address_details": "string",   // required
  "sale_image_url": null         // string | null, optional
}
```

#### `TransactionStatusUpdateRequest`
```json
{
  "transaction_status": "Processing"  // TransactionStatus, required
}
```

#### `TransactionSaleUploadUrlRequest`
```json
{
  "mime_type": "image/png"   // string, required
}
```

#### `PakasirWebhookPayload`
```json
{
  "amount": 0,                        // integer (int32), required
  "order_id": "string",              // required
  "project": "string",               // required
  "status": "string",                // required
  "payment_method": "string",        // required
  "completed_at": "2024-01-01T00:00:00Z"  // datetime, required
}
```

---

### Response Objects

#### `HttpResponse_User`
```json
{
  "success": true,
  "code": 200,
  "data": {
    "id": 1,
    "username": "string",
    "email": "string",
    "role": "User",
    "password": null,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### `HttpResponse_UserAddress`
```json
{
  "success": true,
  "code": 200,
  "data": {
    "id": 1,
    "district": "string",
    "village": "string",
    "details": "string"
  }
}
```

#### `HttpResponse_Oil`
```json
{
  "success": true,
  "code": 200,
  "data": {
    "delta": 0.0,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### `HttpResponse_OilPrices`
```json
{
  "success": true,
  "code": 200,
  "data": {
    "price_type": "Buy",
    "price_per_liter": 5000,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### `HttpResponse_Transaction`
```json
{
  "success": true,
  "code": 200,
  "data": {
    "id": 1,
    "oil_volume": 10.5,
    "price_per_liter": 5000,
    "payment_method": "Qris",
    "status": "Pending",
    "transaction_type": "Sale",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### `HttpResponse_Vec_Transaction`
Same as `HttpResponse_Transaction` but `data` is an **array** of transaction objects.

#### `HttpResponse_TransactionDetails`
```json
{
  "success": true,
  "code": 200,
  "data": {
    "id": 1,
    "transaction_id": 1,
    "address_district": "string",
    "address_village": "string",
    "address_details": "string",
    "sale_image_url": null
  }
}
```

#### `HttpResponse_Payment`
```json
{
  "success": true,
  "code": 200,
  "data": {
    "id": 1,
    "transaction_id": 1,
    "amount": 52500,
    "order_id": "string",
    "status": "Pending",
    "completed_at": null,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### `HttpResponse_TransactionSaleUploadUrlResponse`
```json
{
  "success": true,
  "code": 200,
  "data": {
    "upload_url": "https://storage.example.com/presigned-url",
    "public_url_path": "/ucob-bucket/sale-images/abc123.png"
  }
}
```

---

### Error Handling

All error responses use the `ErrorResponse` schema:

```json
{
  "success": false,
  "code": 500,
  "error": {
    "kind": "InternalServer",
    "message": "Error message here"
  }
}
```

**Common HTTP status codes:**

| Status | Meaning                          |
|--------|----------------------------------|
| 200    | OK                               |
| 201    | Created                          |
| 204    | No Content                       |
| 400    | Bad Request                      |
| 500    | Internal Server Error            |

Refer to [`ErrorKind`](#errorkind) for a full list of application-level error categories.

---

*Documentation generated from `swagger.json` — UCOB API v1.0.0*
