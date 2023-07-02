import { UserButton } from "@clerk/nextjs"

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <p>hi there</p>
      <UserButton afterSignOutUrl="/" />
    </main>
  )
}
