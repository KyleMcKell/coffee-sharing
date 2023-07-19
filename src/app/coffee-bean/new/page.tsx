import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { zfd } from "zod-form-data";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { db } from "~/db";
import {
  coffeeBeansTable,
  insertCoffeeBeanSchema,
} from "~/db/schema/coffeeBeans";
import { getServerAuthSession } from "~/lib/next-auth";

export default async function NewCoffeeBean() {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/");
  }

  let formErrors: {
    name: string | null;
    brand: string | null;
    base: string | null;
  } = {
    name: "name form error",
    brand: null,
    base: null,
  };

  async function addCoffeeBean(data: FormData) {
    "use server";
    if (!session) {
      return console.log("no session bucko");
    }
    let insertedCoffeeBean: { id: string } | undefined;
    const coffeeBeanFormDataSchema = zfd.formData(insertCoffeeBeanSchema);
    try {
      const coffeeBean = coffeeBeanFormDataSchema.parse(data);
      insertedCoffeeBean = (
        await db
          .insert(coffeeBeansTable)
          .values({ ...coffeeBean, baristaId: session.user.id })
          .returning({ id: coffeeBeansTable.id })
      )[0];
      console.log(insertedCoffeeBean);
    } catch (e) {
      if (e instanceof ZodError) {
        formErrors = { ...formErrors, ...e.formErrors.fieldErrors };
      } else {
        console.log(e);
      }
    }
    if (insertedCoffeeBean?.id) {
      redirect(`/coffee-bean/${insertedCoffeeBean.id}`);
    }
  }

  return (
    <form action={addCoffeeBean}>
      <Label htmlFor="name">Name</Label>
      <Input placeholder="Ethiopia" id="name" type="text" name="name" />
      <p className="text-destructive font-bold">{formErrors.name}</p>
      <Label htmlFor="brand">Brand</Label>
      <Input placeholder="Ethiopia" id="brand" type="text" name="brand" />
      {formErrors.brand}
      <Button type="submit">Submit</Button>
      {formErrors.base}
    </form>
  );
}
