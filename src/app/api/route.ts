import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  const res = await request.json();

  const updatedUser = await prisma.projects_users.create({
    data: res.body,
  });

  console.log(updatedUser);

  return new Response("Пользователь обновлен", {
    status: 200,
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const field = searchParams.get("field");
  const direction = searchParams.get("direction");

  const users = await prisma.users.findMany({
    ...(field && direction && { orderBy: { [field]: direction } }),
    include: { projects_users: true },
  });

  return NextResponse.json(users);
}
