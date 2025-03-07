import React, { useState } from "react";
import { folderItemInterface } from "./StorageManager";
import { resources } from "../../_constants/data";
import { DropdownComp } from "../ui/dropdown/DropdownComp";
import { Download, Eye, Pencil, Trash } from "lucide-react";

interface folderItemCardInterface {
  selected: boolean;
  onClick: Function;
  onDoubleClick: Function;
  data: folderItemInterface;
}

const FolderCard: React.FC<folderItemCardInterface> = (props) => {
  const { selected, data, onClick, onDoubleClick } = props;
  const handleClick = (actionid: string) => props?.onClick(actionid, props?.id);
  return (
    <div
      onClick={(e) => onClick("click", data?.id)}
      onDoubleClick={(e) => onDoubleClick(e, data)}
      className={`foldercard relative ${selected ? "selected" : ""}`}
    >
      <div className="absolute top-1 right-1">
        {selected && (
          <DropdownComp
            handleClick={handleClick}
            dropdownList={[
              { icon: <Pencil size={14} />, label: "Rename", id: "rename" },
              {
                icon: <Trash color="red" size={14} />,
                label: "Delete",
                id: "delete",
              },
            ]}
          />
        )}
      </div>
      <img
        className="icon"
        src={resources.storage.folder.default}
        alt={data?.name}
      />
      <p className="name">{data?.name}</p>
    </div>
  );
};

export default FolderCard;
