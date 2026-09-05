import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

const microsoftEntraProvider = MicrosoftEntraID({
  clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
  clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
  issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [microsoftEntraProvider],
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    error: "/auth/error",
  },
  callbacks: {
    authorized({ auth: session }) {
      return !!session;
    },
  },
});
