import React from "react";
import { fileItemInterface } from "./StorageManager";
import { resources } from "../../_constants/data";
import { Download, Eye, Pencil, Trash } from "lucide-react";
import { DropdownComp } from "../ui/dropdown/DropdownComp";

interface fileItemCardInterface {
  selected: boolean;
  onClick: Function;
  onDoubleClick: Function;
  data: fileItemInterface;
}

const FileCard: React.FC<fileItemCardInterface> = (props) => {
  const { selected, onClick, onDoubleClick, data } = props;
  const handleClick = (actionid: string) => onClick(actionid, data?.id);
  return (
    <div
      onClick={() => onClick("click", data?.id)}
      onDoubleClick={(e) => onDoubleClick(e, data)}
      className={`filecard relative ${selected ? "selected" : ""}`}
    >
      <div className="absolute top-1 right-1">
        {selected && (
          <DropdownComp
            handleClick={handleClick}
            dropdownList={[
              {
                icon: <Eye size={14} />,
                label: "View",
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
        alt={data?.name}
      />
      <p className="name">{data?.name}</p>
    </div>
  );
};

export default FileCard;
