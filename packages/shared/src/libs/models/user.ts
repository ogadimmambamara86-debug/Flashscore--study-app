// packages/shared/src/libs/models/user.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "analyst" | "user";
  createdAt: Date;
  updatedAt: Date;
}