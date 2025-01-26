import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string; 
      name?: string | null;
      email?: string | null;
      image?: string | null;
      // add anything else you'd like on the user object
    };
  }
}