import React, { useState } from "react";
import { folderItemInterface } from "./StorageManager";
import { resources } from "../../_constants/data";
import { DropdownComp } from "../ui/dropdown/DropdownComp";
import { Download, Pencil, Trash } from "lucide-react";

interface folderItemCardInterface extends folderItemInterface {
  selected: boolean;
  onClick: Function;
  onDoubleClick: Function;
}

const FolderCard: React.FC<folderItemCardInterface> = (props) => {
  const handleClick = (actionid: string) => props?.onClick(actionid, props?.id);
  return (
    <div
      onClick={(e) => props.onClick("click", props?.id)}
      onDoubleClick={(e) => props.onDoubleClick(e, props?.id)}
      className={`foldercard relative ${props?.selected ? "selected" : ""}`}
    >
      <div className="absolute top-1 right-1">
        {props?.selected && (
          <DropdownComp
            handleClick={handleClick}
            dropdownList={[
              {
                icon: <Download size={14} />,
                label: "Download",
                id: "download",
              },
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
        alt={props?.name}
      />
      <p className="name">{props?.name}</p>
    </div>
  );
};

export default FolderCard;
