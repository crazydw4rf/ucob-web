export type ApiResponse<T = any> = {
  success: boolean;
  code: number;
  data: T;
};

export type ErrorResponse = ApiResponse<Error>;

export type Error = { message: string; kind: ErrorKind };

export const ErrorKind = {
  InternalServer: "InternalServer",
  NotFound: "NotFound",
  ResourceConflict: "ResourceConflict",
  ForeignKeyViolation: "ForeignKeyViolation",
  SessionExpired: "SessionExpired",
  TokenInvalid: "TokenInvalid",
  CredentialsInvalid: "CredentialsInvalid",
  BadRequest: "BadRequest",
} as const;

export type ErrorKind = (typeof ErrorKind)[keyof typeof ErrorKind];

export const TransactionStatus = {
  Accepted: "Accepted",
  Verified: "Verified",
  Rejected: "Rejected",
  Pending: "Pending",
} as const;

export const UserRole = {
  Admin: "Admin",
  User: "User",
} as const;

// src/js/types.ts

// Struktur data User sesuai ERD Database UCOB
export interface User {
  id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  role: "ADMIN" | "USER";
  created_at?: string;
}

// Payload untuk registrasi pengguna baru
export interface RegisterPayload {
  first_name: string;
  last_name?: string;
  email: string;
  password: string;
}
