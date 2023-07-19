import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "~/db";
import { coffeeBeansTable } from "~/db/schema/coffeeBeans";
import { getServerAuthSession } from "~/lib/next-auth";

export default async function CoffeeBean({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerAuthSession();

  const coffeeBean = (
    await db
      .select()
      .from(coffeeBeansTable)
      .where(eq(coffeeBeansTable.id, params.id))
      .limit(1)
  )[0];

  if (!session || session.user.id !== coffeeBean?.baristaId) {
    redirect("/");
  }

  return <div>{coffeeBean?.name}</div>;
}
