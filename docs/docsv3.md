# UCOB API Documentation

**Layanan backend REST API untuk aplikasi web UCOB (Used Cooking Oil Bank)**

Version: 1.0.0

---

## Table of Contents
- [Auth](#auth)
- [User](#user)
- [Transaction](#transaction)
- [Payment](#payment)

---

## Auth

### Login
**POST** `/v1/auth/login`

Login user dengan email dan password.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Responses:**
- `200` - Success
- `500` - Error

---

### Logout
**POST** `/v1/auth/logout`

Logout user yang sedang login.

**Responses:**
- `204` - Success
- `400` - Token not found
- `500` - Error

---

## User

### Create User
**POST** `/v1/users`

Membuat pengguna baru.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Responses:**
- `201` - User created
- `500` - Error

---

### Get Current User
**GET** `/v1/users/me`

Mengambil data pengguna yang sedang login.

**Responses:**
- `200` - Success
  ```json
  {
    "success": true,
    "code": 200,
    "data": {
      "id": 1,
      "username": "string",
      "email": "string",
      "role": "Admin | User",
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
  ```
- `500` - Error

---

### Get User Address
**GET** `/v1/users/address`

Mengambil alamat pengguna yang sedang login.

**Responses:**
- `200` - Success
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
- `500` - Error

---

### Create User Address
**POST** `/v1/users/address`

Menambahkan alamat pengguna.

**Request Body:**
```json
{
  "district": "string",
  "village": "string",
  "details": "string"
}
```

**Responses:**
- `200` - Success
- `500` - Error

---

## Transaction

### Get All Transactions
**GET** `/v1/transaction`

Mengambil informasi transaksi dengan pagination.

**Query Parameters:**
- `page` (required): integer
- `page_size` (required): integer

**Responses:**
- `200` - Success
  ```json
  {
    "success": true,
    "code": 200,
    "data": [
      {
        "id": 1,
        "oil_volume": 10.5,
        "status": "Pending | Accepted | Verified | Rejected",
        "transaction_type": "Purchase | Sale",
        "user_id": 1,
        "payment_id": null,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
  ```
- `500` - Error

---

### Get All Transactions (Admin)
**GET** `/v1/transaction/admin`

Mengambil informasi transaksi (Admin only) dengan pagination.

**Query Parameters:**
- `page` (required): integer
- `page_size` (required): integer

**Responses:**
- `200` - Success (sama format seperti GET `/v1/transaction`)
- `500` - Error

---

### Get Transaction by ID
**GET** `/v1/transaction/{id}`

Mengambil informasi transaksi berdasarkan ID.

**Path Parameters:**
- `id` (required): integer

**Responses:**
- `200` - Success
  ```json
  {
    "success": true,
    "code": 200,
    "data": {
      "id": 1,
      "oil_volume": 10.5,
      "status": "Pending | Accepted | Verified | Rejected",
      "transaction_type": "Purchase | Sale",
      "user_id": 1,
      "payment_id": null,
      "created_at": "2024-01-01T00:00:00Z"
    }
  }
  ```
- `500` - Error

---

### Create Transaction
**POST** `/v1/transaction`

Membuat transaksi pembelian maupun penjualan baru.

**Request Body:**
```json
{
  "oil_volume": 10.5,
  "transaction_type": "Purchase | Sale",
  "address_district": "string",
  "address_village": "string",
  "address_details": "string",
  "sale_image_url": "string | null"
}
```

**Responses:**
- `201` - Created
- `500` - Error

---

## Payment

### Payment Webhook
**POST** `/v1/payment/webhook`

Webhook yang dipanggil oleh payment gateway ketika transaksi berhasil.

**Request Body:**
```json
{
  "project": "string",
  "order_id": "string",
  "amount": 50000,
  "status": "string",
  "payment_method": "string",
  "completed_at": "2024-01-01T00:00:00Z"
}
```

**Responses:**
- `200` - Success

---

## Error Response

Semua error akan return format:

```json
{
  "success": false,
  "code": 500,
  "error": {
    "kind": "ErrorKind enum",
    "message": "string"
  }
}
```

**ErrorKind Values:**
- `InternalServer`
- `NotFound`
- `ResourceConflict`
- `ForeignKeyViolation`
- `SessionExpired`
- `TokenInvalid`
- `CredentialsInvalid`
- `HashingPassword`
- `ServiceInit`
- `StorageService`
- `BadRequest`
- `UnprocessableEntity`

---

## Enums

### UserRole
- `Admin`
- `User`

### TransactionType
- `Purchase`
- `Sale`

### TransactionStatus
- `Pending`
- `Accepted`
- `Verified`
- `Rejected`
