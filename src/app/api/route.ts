import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  const res = await request.json();

  const relatedField = await prisma.projects_users.findFirst({
    where: { project_id: res.project_id, user_id: res.user_id },
    select: { id: true },
  });

  console.log(relatedField, res);

  if (res.role === 5) {
    await prisma.projects_users.delete({ where: { id: relatedField?.id } });
  } else {
    await prisma.projects_users.upsert({
      where: { id: relatedField?.id ?? 0 },
      create: { ...res },
      update: { role: res.role },
    });
  }

  return NextResponse.json({ message: "Пользователь обновлен" });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const field = searchParams.get("field");
  const project = searchParams.get("project");
  const direction = searchParams.get("direction");

  const users = await prisma.users.findMany({
    ...(field && direction && { orderBy: { [field]: direction } }),
    ...(project && {
      where: {
        projects_users: { some: { projects: { name: project } } },
      },
    }),
    include: {
      projects_users: true,
    },
  });

  return NextResponse.json(users);
}
