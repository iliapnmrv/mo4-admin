"use client";
import { projects, projects_users, users } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import TableSort from "./TableSort";
import TableSortProject from "./TableSortProject";

export type UsersResponse = (users & {
  projects_users: projects_users[];
})[];

type Props = {
  users: UsersResponse;
  projects: projects[];
};

export type SortBy = {
  direction: "asc" | "desc";
  field: keyof UsersResponse[number] | string;
};

const USER_ROLES_OPTIONS = [
  { value: 1, label: "Админ" },
  { value: 2, label: "Менеджер" },
  { value: 3, label: "Пользователь" },
  { value: 4, label: "Гость" },
  { value: 5, label: "Нет доступа" },
];

const Table = ({ users: initialUsers, projects }: Props) => {
  const [users, setUsers] = useState<UsersResponse>(initialUsers);

  const [sortBy, setSortBy] = useState<SortBy>({
    direction: "asc",
    field: "name",
  });

  const [project, setProject] = useState<string>("");

  const onFilterUsers = async () => {
    const res = await fetch(
      `/api?${new URLSearchParams({
        ...sortBy,
        project,
      })}`,
      {
        next: { tags: ["users"] },
      }
    );
    const filtered = await res.json();
    setUsers(filtered);
  };

  useEffect(() => {
    onFilterUsers();
  }, [sortBy, project]);

  const onUserEditRole = async (
    role: number,
    project_id: number,
    user_id: number
  ) => {
    await fetch(`/api`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role, project_id, user_id }),
      next: { tags: ["users"] },
    });
    onFilterUsers();
  };

  return (
    <table className="table-auto">
      <thead>
        <tr>
          <th colSpan={4}></th>
          <th>Проекты</th>
        </tr>
        <tr>
          <TableSort setSortBy={setSortBy} sortBy={sortBy} name="name">
            ФИО
          </TableSort>
          <TableSort setSortBy={setSortBy} sortBy={sortBy} name="title">
            Должность
          </TableSort>
          <TableSort setSortBy={setSortBy} sortBy={sortBy} name="department">
            Подразделение
          </TableSort>
          <TableSortProject
            setProject={setProject}
            project={project}
            name="medkomissia"
          >
            Медкомиссия
          </TableSortProject>
          <TableSortProject
            setProject={setProject}
            project={project}
            name="inventory"
          >
            Инвентаризация
          </TableSortProject>
          <TableSortProject
            setProject={setProject}
            project={project}
            name="energetics"
          >
            Энергетики
          </TableSortProject>
          <TableSortProject
            setProject={setProject}
            project={project}
            name="pitanie"
          >
            Питание
          </TableSortProject>
        </tr>
      </thead>
      <tbody>
        {users?.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.title}</td>
            <td>{user.department}</td>
            {projects.map((project) => (
              <td key={project.id}>
                <select
                  onChange={(e) =>
                    onUserEditRole(+e.target.value, project.id, user.id)
                  }
                  value={
                    user?.projects_users?.find(
                      (project_user) => project_user.project_id === project.id
                    )?.role ?? 5
                  }
                  name={project.name}
                  id={project.id.toString()}
                >
                  {USER_ROLES_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
