import React from "react";
import { LucideIcons } from "../../../_constants/data";

interface BaseDropdownMenuProps {}

const BaseDropdownMenu = (props: BaseDropdownMenuProps) => {
  const {} = props;
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn m-1">
        <LucideIcons.Menu className="w-5 h-5" />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        <li>
          <a>Item 1</a>
        </li>
        <li>
          <a>Item 2</a>
        </li>
      </ul>
    </div>
  );
};

export default BaseDropdownMenu;
