import NextAuth, { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { createBrowserToken } from "../../serverlib/tokens";
import { fetchUser } from "../../serverlib/user";
import { JWT } from "next-auth/jwt";
import { refreshAccessToken } from "../../serverlib/refreshToken";

export const authProviders: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENTID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "user",
          value: "Administrator",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "pass",
          value: "dPCW8IJ*E^bn&jvh",
        },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const { data, cookies } = await createBrowserToken(
            credentials.username,
            credentials.password
          );

          if (data) {
            const { access_token, refresh_token, expires_in, endpoint_tokens } =
              data;
            console.log("access token", data);
            const getUserToken = endpoint_tokens.find(
              (token: any) => token.endpoint_route === "GETapi/v1/Users/GetUser"
            ).access_token;
            if (cookies !== null) {
              const user = await fetchUser(getUserToken, access_token, cookies);

              if (user) {
                console.log("user", access_token, user);
                return {
                  ...user,
                  access_token,
                  endpoint_tokens,
                  refresh_token,
                  expires_in,
                  cookies,
                };
              }
            }
          }
          return null;
        } catch (error) {
          console.error("Error during login:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // session.user = { ...session.user, ...token };
      // return session;
      session.user = {
        id: token.id,
        firstName: token.firstName,
        lastName: token.lastName,
        userName: token.userName,
        email: token.email,
        phoneNumber: token.phoneNumber,
      };
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.userName = user.userName;
        token.phoneNumber = user.phoneNumber;
        token.endpoint_tokens = user.endpoint_tokens;
        token.access_token = user.access_token;
        token.refresh_token = user.refresh_token;
        token.expires_in = user.expires_in;
        token.cookies = user.cookies;
        token.accessTokenExpires = Date.now() + user.expires_in * 1000;
      }
      if (Date.now() < token.accessTokenExpires) {
        return token;
      } //else return null;

      return token;
      // return await refreshAccessToken(token as JWT);
    },
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    // signIn: "/auth/signin", // Custom sign-in page
    // signOut: '/auth/signout',  // Custom sign-out page
    // error: '/auth/error',  // Error page to redirect to in case of errors
    // verifyRequest: '/auth/verify-request',  // Verification request page
    // newUser: '/auth/welcome',  // Page to redirect new users to
  },
};

const handler = NextAuth(authProviders);

export { handler as GET, handler as POST };
