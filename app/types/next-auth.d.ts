// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      userName: string;
      email: string;
      phoneNumber: string;
      //   endpoint_tokens: any[];
      //   access_token: string;
      //   refresh_token: string;
      //   expires_in: number;
      //   cookies: any[];
    };
  }

  interface User {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    endpoint_tokens: any[];
    access_token: string;
    refresh_token: string;
    expires_in: number;
    cookies: any[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    phoneNumber: string;
    endpoint_tokens: any[];
    access_token: string;
    refresh_token: string;
    expires_in: number;
    cookies: any[];
    accessTokenExpires: number;
  }
}
