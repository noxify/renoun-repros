import { Header } from "@/components/header"

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <main className="flex w-full flex-1 flex-col transition-all duration-300 ease-in-out">
        <div className="container mx-auto py-6">{children}</div>
      </main>
    </>
  )
}
