import '@/styles/globals.css';

export const metadata = {
  title: "Ed, Edd n Eddy — AI English Companions",
  description: "Learn English with Ed the encourager, Edd the scholar, and Eddy the street-smart hustler!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
