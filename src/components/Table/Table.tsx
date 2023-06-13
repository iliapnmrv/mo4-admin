"use client";
import { projects_users, users } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type UsersResponse = (users & {
  projects_users: projects_users[];
})[];

type Props = {
  users: UsersResponse;
};

type SortBy = {
  direction: "asc" | "desc";
  field: keyof UsersResponse[number];
};

const USER_ROLES_OPTIONS = [
  { value: 1, label: "Админ" },
  { value: 2, label: "Менеджер" },
  { value: 3, label: "Пользователь" },
  { value: 4, label: "Гость" },
  { value: 5, label: "Нет доступа" },
];

const Table = ({ users: initialUsers }: Props) => {
  const [users, setUsers] = useState<UsersResponse>(initialUsers);

  const [sortBy, setSortBy] = useState<SortBy>({
    direction: "asc",
    field: "name",
  });

  const onFilterUsers = async () => {
    const res = await fetch(`/api?${new URLSearchParams(sortBy)}`);
    const filtered = await res.json();
    setUsers(filtered);
  };

  useEffect(() => {
    onFilterUsers();
  }, [sortBy]);

  const onUserEditRole = async (
    role: number,
    project_id: number,
    user_id: number
  ) => {
    const res = await fetch(`/api`, {
      method: "PUT",
      body: JSON.stringify({ role, project_id, user_id }),
    });
    const filtered = await res.json();
    setUsers(filtered);
  };

  return (
    <table className="table-auto">
      <thead>
        <tr>
          <th colSpan={4}></th>
          <th>Проекты</th>
        </tr>
        <tr>
          <th>ФИО</th>
          <th>Должность</th>
          <th>Подразделение</th>
          <th>Инвентаризация</th>
          <th>Медкомиссия</th>
          <th>Питание</th>
          <th>
            Энергетики
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 6.75L12 3m0 0l3.75 3.75M12 3v18"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3"
              />
            </svg>
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.title}</td>
            <td>
              <select name="inventory" id="inventory">
                {USER_ROLES_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </td>
            <td>{user.department}</td>
            <td>{user.department}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
