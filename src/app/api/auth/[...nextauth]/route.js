import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import createConnection from "@/server/database/mysql";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      const { email, name, image } = user;
      const connection = await createConnection();
      const [rows] = await connection.execute("SELECT id FROM users WHERE email = ?", [
        email,
      ]);
      
      if (rows.length === 0) {
        await connection.execute(
          "INSERT INTO users (email, username, first_name, last_name, avatar_url) VALUES (?, ?, ?, ?, ?)",
          [email, email.split("@")[0], name.split(" ")[0], name.split(" ")[1], image]
        );
      }
      return true;
    },

    async session({ session }) {
      const connection = await createConnection();
      const [rows] = await connection.execute("SELECT id , username, avatar_url FROM users WHERE email = ?", [
        session.user.email,
      ]);
      if (rows.length > 0) {
        session.user.id = rows[0].id;
        session.user.username = rows[0].username;
        session.user.image = rows[0].avatar_url;
      } 
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
