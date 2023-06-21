import React, { Dispatch, FC, PropsWithChildren, SetStateAction } from "react";
import { SortBy, UsersResponse } from "./Table";

type Props = {
  sortBy: SortBy;
  setSortBy: Dispatch<SetStateAction<SortBy>>;
  name: keyof UsersResponse[number] | string;
};

const TableSort: FC<PropsWithChildren<Props>> = ({
  sortBy,
  name,
  children,
  setSortBy,
}) => {
  const onHeaderPress = () => {
    setSortBy({
      direction: sortBy.direction === "asc" ? "desc" : "asc",
      field: name,
    });
  };
  return (
    <div onClick={onHeaderPress} className="flex flex-row">
      {children}
      {sortBy.field === name ? (
        <span>
          {sortBy.direction === "asc" ? (
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
          ) : (
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
          )}
        </span>
      ) : null}
    </div>
  );
};

export default TableSort;
