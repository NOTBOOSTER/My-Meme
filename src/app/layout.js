
import "./globals.css";

export const metadata = {
  title: "MyMeme : Ai generated memes",
  description: "A simple ai based meme generation site where users can generate mems through ai and post them.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="dark"
      >
        {children}
      </body>
    </html>
  );
}
