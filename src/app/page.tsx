"use client"
import { signIn } from "next-auth/react"

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <p>hi there</p>
      <button className="text-black" onClick={() => signIn("github")}>
        Sign in
      </button>
    </main>
  )
}
