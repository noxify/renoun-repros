import { RootProvider } from "renoun";

export default async function RootElement({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootProvider theme={{light: "github-light", dark: "github-dark"}} languages={["tsx", "ts","jsx", "js", "json", "css", "html", "bash", "ini"]}>
      <html lang="en">
        <head></head>
        <body>{children}</body>
      </html>
    </RootProvider>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
  };
};
