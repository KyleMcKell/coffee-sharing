import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { insertCoffeeBeanSchema } from "~/db/schema/coffeeBeans";
import { getServerAuthSession } from "~/lib/next-auth";

export default async function NewCoffeeBean() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  async function addCoffeeBean(data: FormData) {
    "use server";
    console.log(data);
    if (!session) return;
    try {
      const yeah = insertCoffeeBeanSchema.parse(data);
      console.log(yeah);
    } catch (e) {
      if (e instanceof ZodError) {
        console.log(e.errors);
      }
    }
  }

  return (
    <form action={addCoffeeBean}>
      <Label htmlFor="name">Name</Label>
      <Input placeholder="Ethiopia" id="name" type="text" name="name" />
      <Label htmlFor="brand">Brand</Label>
      <Input placeholder="Ethiopia" id="brand" type="text" name="brand" />
      <Label htmlFor="brand">Brand</Label>
      <Input placeholder="Ethiopia" id="brand" type="text" name="brand" />
      <Button type="submit">Submit</Button>
    </form>
  );
}
