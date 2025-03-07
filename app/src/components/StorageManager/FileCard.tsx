import React from "react";
import { fileItemInterface } from "./StorageManager";
import { resources } from "../../_constants/data";
import { Download, Pencil, Trash } from "lucide-react";
import { DropdownComp } from "../ui/dropdown/DropdownComp";

interface fileItemCardInterface extends fileItemInterface {
  selected: boolean;
  onClick: Function;
  onDoubleClick: Function;
}

const FileCard: React.FC<fileItemCardInterface> = (props) => {
  const handleClick = (actionid: string) => props?.onClick(actionid, props?.id);
  return (
    <div
      onClick={() => props.onClick("click", props?.id)}
      onDoubleClick={(e) => props.onDoubleClick(e, props?.id)}
      className={`filecard relative ${props?.selected ? "selected" : ""}`}
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
        src={resources.storage.file.default}
        alt={props?.name}
      />
      <p className="name">{props?.name}</p>
    </div>
  );
};

export default FileCard;
