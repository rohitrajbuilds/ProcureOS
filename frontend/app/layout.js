import "./globals.css";

export const metadata = {
  title: "ProcureOS",
  description: "AI Autonomous Procurement SaaS"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
