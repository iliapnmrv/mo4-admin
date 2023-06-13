import Table from "@/components/Table/Table";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

const prisma = new PrismaClient();

async function getData() {
  // console.log(prisma.users);

  const users = await prisma.users.findMany({
    include: { projects_users: true },
  });

  return users;
}

export default async function Home() {
  const users = await getData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Table users={users} />
    </main>
  );
}
