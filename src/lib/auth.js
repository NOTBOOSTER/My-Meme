import createConnection from "@/server/database/mysql";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [GitHub, Google],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      
      const { email, name, image } = user;

      const username = email ? email.split("@")[0] : null;
      const nameParts = name ? name.split(" ") : [];
      const firstName = nameParts[0] || null;
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : null;
      const avatarUrl = image || null;

      const connection = await createConnection();
      const [rows] = await connection.execute(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );

      if (rows.length === 0) {
        await connection.execute(
          "INSERT INTO users (email, username, first_name, last_name, avatar_url) VALUES (?, ?, ?, ?, ?)",
          [
            email,
            username,
            firstName,
            lastName,
            avatarUrl,
          ]
        );
      }
      return true;
    },

    async session({ session }) {
      const connection = await createConnection();
      const [rows] = await connection.execute(
        "SELECT id , username, avatar_url FROM users WHERE email = ?",
        [session.user.email]
      );
      if (rows.length > 0) {
        session.user.id = rows[0].id;
        session.user.username = rows[0].username;
        session.user.image = rows[0].avatar_url;
      }
      return session;
    },
  },
});
