import React, { useEffect, useMemo, useState } from "react";
import {
  fileItemInterface,
  folderItemInterface,
  storageItemIdType,
} from "./StorageManager";
import { resources } from "../../_constants/data";
import { Download, Eye, Pencil, Trash } from "lucide-react";
import { DropdownComp } from "../ui/dropdown/DropdownComp";
import Input from "../form/input/InputField";

interface fileItemCardInterface {
  itemType: storageItemIdType;
  selected: boolean;
  onClick: Function;
  onDoubleClick: Function;
  data: folderItemInterface | fileItemInterface;
}

const getImagebyMimeType = (mimeType: string) => {
  let imageResources = resources.storage.file;
  if (mimeType.startsWith("image/")) {
    return imageResources.image;
  } else if (mimeType.startsWith("video/")) {
    return imageResources.video;
  } else if (mimeType.includes("pdf")) {
    return imageResources.pdf;
  } else if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
    return imageResources.excel;
  } else if (mimeType.includes("word")) {
    return imageResources.docs;
  } else {
    return imageResources.default;
  }
};

const FileCard: React.FC<fileItemCardInterface> = (props) => {
  const { itemType = "folder", selected, onClick, onDoubleClick, data } = props;
  const [renameData, setRenameData] = useState("");
  const [renameDataExt, setRenameDataExt] = useState("");
  const [enableRename, setEnableRename] = useState(false);
  const handleChange = (e) => {
    setRenameData(e?.target?.value);
  };
  const handleRename = () => {
    setEnableRename(false);
    let renamednew = renameData;
    if (renameDataExt) renamednew = renamednew + `.${renameDataExt}`;
    onClick("rename", data?.id, {
      newName: renamednew,
      prevName: data?.name,
    });
  };

  const handleClick = (actionid: string) => {
    if (actionid === "rename") {
      setEnableRename(true);
    } else {
      onClick(actionid, data?.id);
    }
  };

  let dropdownOptions = useMemo(() => {
    let options = [
      ,
      { icon: <Pencil size={14} />, label: "Rename", id: "rename" },
      {
        icon: <Trash color="red" size={14} />,
        label: "Delete",
        id: "delete",
      },
    ];
    if (itemType === "file") {
      options.push({
        icon: <Eye size={14} />,
        label: "View",
        id: "download",
      });
    }
    return options;
  }, [itemType]);
  let iconimage = useMemo(() => {
    let defaultImage = resources.storage.folder.default;
    if (itemType === "file") {
      let fileTypeIcon =
        getImagebyMimeType(data?.fileType) ?? resources.storage.file.default;
      defaultImage = fileTypeIcon;
    }
    return defaultImage;
  }, [itemType, data]);

  useEffect(() => {
    try {
      let cleanName: string | string[] = data?.name.split(".");
      let extension = cleanName.length > 1 ? cleanName.pop() : "";
      cleanName = cleanName.filter(Boolean).join(".");
      setRenameData(cleanName || "");
      setRenameDataExt(extension || "");
    } catch (Err) {
      console.error(Err);
    }
  }, [data?.name]);
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
            dropdownList={dropdownOptions}
          />
        )}
      </div>
      <img className="icon" src={iconimage} alt={data?.name} />
      {enableRename ? (
        <Input
          name="name"
          onChange={handleChange}
          onBlur={() => setEnableRename(false)}
          value={renameData}
          onKeyDown={(e) => {
            if (e?.key === "Enter") handleRename();
          }}
          className="p-0 h-7 rounded-md bg-white/70"
        />
      ) : (
        <div className="h-7 flex items-center">
          <p className="name ">{data?.name}</p>
        </div>
      )}
    </div>
  );
};

export default FileCard;
