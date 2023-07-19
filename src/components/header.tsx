import { AuthButton } from "~/components/auth-button";

import { ModeToggle } from "./mode-toggle";

export function Header() {
  return (
    <header className="w-full flex justify-between py-8">
      <h1 className="font-bold text-3xl">Welcome to CawfeeHouse!</h1>
      <div className="flex gap-4">
        <AuthButton />
        <ModeToggle />
      </div>
    </header>
  );
}
