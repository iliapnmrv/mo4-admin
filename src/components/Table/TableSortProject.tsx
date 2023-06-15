import { Dispatch, FC, PropsWithChildren, SetStateAction } from "react";

type Props = {
  setProject: Dispatch<SetStateAction<string>>;
  project: string;
  name: string;
};

const TableSortProject: FC<PropsWithChildren<Props>> = ({
  name,
  setProject,
  project,
  children,
}) => {
  const handleChange = (e) => {
    e.target.value === project ? setProject("") : setProject(e.target.value);
  };

  return (
    <th>
      <label className="flex flex-row">
        <input
          onChange={handleChange}
          onClick={handleChange}
          type="radio"
          name="project"
          value={name}
          checked={project === name}
          id={name}
        />
        {children}
      </label>
    </th>
  );
};

export default TableSortProject;
