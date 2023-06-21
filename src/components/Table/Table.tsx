"use client";
import { projects, projects_users, users } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import TableSort from "./TableSort";
import TableSortProject from "./TableSortProject";
import MUITable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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
    <TableContainer component={Paper}>
      <MUITable
        sx={{ minWidth: 650, maxWidth: 1300, margin: "0px auto" }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSort setSortBy={setSortBy} sortBy={sortBy} name="name">
                ФИО
              </TableSort>
            </TableCell>
            <TableCell align="right">
              <TableSort setSortBy={setSortBy} sortBy={sortBy} name="title">
                Должность
              </TableSort>
            </TableCell>
            <TableCell align="right">
              <TableSort
                setSortBy={setSortBy}
                sortBy={sortBy}
                name="department"
              >
                Подразделение
              </TableSort>
            </TableCell>
            <TableCell align="right">
              <TableSortProject
                setProject={setProject}
                project={project}
                name="medkomissia"
              >
                Медкомиссия
              </TableSortProject>
            </TableCell>
            <TableCell align="right">
              <TableSortProject
                setProject={setProject}
                project={project}
                name="inventory"
              >
                Инвентаризация
              </TableSortProject>
            </TableCell>
            <TableCell align="right">
              <TableSortProject
                setProject={setProject}
                project={project}
                name="energetics"
              >
                Энергетики
              </TableSortProject>
            </TableCell>
            <TableCell align="right">
              <TableSortProject
                setProject={setProject}
                project={project}
                name="pitanie"
              >
                Питание
              </TableSortProject>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.title}</TableCell>
              <TableCell>{user.department}</TableCell>
              {projects
                .filter((project) => project.name !== "admin")
                .map((project) => (
                  <TableCell key={project.id}>
                    <select
                      onChange={(e) =>
                        onUserEditRole(+e.target.value, project.id, user.id)
                      }
                      value={
                        user?.projects_users?.find(
                          (project_user) =>
                            project_user.project_id === project.id
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
                  </TableCell>
                ))}
            </TableRow>
          ))}
        </TableBody>
      </MUITable>
    </TableContainer>
  );
};

export default Table;
