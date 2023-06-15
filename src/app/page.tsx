import Table from "@/components/Table/Table";
import { headers } from "next/headers";

export default async function Home() {
  const headersData = headers();
  const protocol = headersData.get("x-forwarded-proto");
  const host = headersData.get("host");

  const users_res = await fetch(`${protocol}://${host}/api`, {
    next: { tags: ["users"] },
  });
  const projects_res = await fetch(`${protocol}://${host}/api/project`, {
    next: { tags: ["projects"] },
  });

  const users = await users_res.json();
  const projects = await projects_res.json();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Table users={users} projects={projects} />
    </main>
  );
}
