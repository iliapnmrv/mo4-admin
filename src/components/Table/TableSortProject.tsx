import {
  ChangeEvent,
  Dispatch,
  FC,
  MouseEventHandler,
  PropsWithChildren,
  SetStateAction,
} from "react";

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
  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | MouseEventHandler<HTMLInputElement>
  ) => {
    if (e instanceof MouseEvent) {
      setProject("");
      return;
    }

    //@ts-ignore
    e.target.value === project ? setProject("") : setProject(e.target.value);
  };

  return (
    <label className="flex flex-row">
      <input
        onChange={handleChange}
        //@ts-ignore
        onClick={handleChange}
        type="radio"
        name="project"
        value={name}
        checked={project === name}
        id={name}
      />
      {children}
    </label>
  );
};

export default TableSortProject;
