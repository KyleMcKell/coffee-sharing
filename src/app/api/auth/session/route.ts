import { getServerAuthSession } from "~/app/api/auth/[...nextauth]/route";
import { NextApiHandler } from "next";
import { NextResponse } from "next/server";

export const GET: NextApiHandler = async () => {
  const session = await getServerAuthSession();
  if (session) {
    return NextResponse.json({ data: session }, { status: 200 });
  }
  return NextResponse.json({ error: "Session not found" }, { status: 404 });
};
