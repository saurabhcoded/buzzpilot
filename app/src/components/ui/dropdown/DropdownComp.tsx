import React, { useState } from "react";
import Button from "../button/Button";
import { Dropdown } from "./Dropdown";
import { DropdownItem } from "./DropdownItem";
import { Menu, Plus } from "lucide-react";

interface DropdownItemProps {
  label: string;
  id: string;
  icon?: React.ReactNode;
}
interface DropdownCompProps {
  handleClick: (id: string) => void;
  dropdownList: Array<DropdownItemProps>;
  className?: string;
  buttonVariant?: string;
  buttonLabel?: string;
}

export const DropdownComp: React.FC<DropdownCompProps> = ({
  handleClick,
  buttonVariant,
  buttonLabel,
  dropdownList,
  className = "",
}) => {
  const [isOpen, setShowMenu] = useState<boolean>(false);
  const handleOpen = () => setShowMenu(true);
  const handleClose = () => setShowMenu(false);
  return (
    <div className={`dropdown-comp relative ${className}`}>
      {buttonVariant === "full" ? (
        <Button size="sm" className="rounded-md pe-5" onClick={handleOpen}>
          <Plus size={16} fontWeight={"bold"} /> {buttonLabel}
        </Button>
      ) : (
        <Button
          size="xxs"
          variant="outline"
          className="rounded-md bg-white/40 border-0"
          onClick={handleOpen}
        >
          <Menu size={14} />
        </Button>
      )}
      <Dropdown isOpen={isOpen} onClose={handleClose} className="rounded-md">
        {dropdownList.map((item: DropdownItemProps, itemIndex: number) => {
          return (
            <React.Fragment key={item?.id}>
              {itemIndex > 0 && <hr />}
              <DropdownItem
                onClick={() => handleClick(item?.id)}
                className="flex items-center gap-x-2 text-nowrap"
              >
                {Boolean(item?.icon) && item?.icon}
                <span className="text-sm">{item?.label}</span>
              </DropdownItem>
            </React.Fragment>
          );
        })}
      </Dropdown>
    </div>
  );
};
