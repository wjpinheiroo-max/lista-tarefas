import "./globals.css";

export const metadata = {
  title: "Minha Lista | Organize seu dia",
  description: "Uma lista de tarefas simples para organizar sua rotina.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
