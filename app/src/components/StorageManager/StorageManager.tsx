import React, { useCallback, useState } from "react";
import FolderCard from "./FolderCard";
import FileCard from "./FileCard";
export type storageItemId = string;
export type storageItemIdType = string;
export interface fileItemInterface {
  id: string;
  icon?: string | null;
  name: string;
  type: string;
  fileType: string;
  data: any;
}
export interface folderItemInterface {
  id: string;
  name: string;
  icon?: string | null;
  type: string;
}
export interface storagelistItemsInterface {
  files: Array<fileItemInterface>;
  folders: Array<folderItemInterface>;
}

interface StorageManagerProps {
  listItems: storagelistItemsInterface;
  handlers: {
    onClick: VoidFunction;
    onDoubleClick: VoidFunction;
    onDelete: VoidFunction;
    onRename: VoidFunction;
    onDownload: VoidFunction;
    onAddFolder: VoidFunction;
    onAddFile: VoidFunction;
  };
}

const StorageManager: React.FC = ({
  listItems,
  handlers,
}: StorageManagerProps) => {
  let { folders, files } = listItems;
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const handleClick =
    (itemType: storageItemIdType) =>
    (actiontype: string, itemId: storageItemId) => {
      setSelectedItem(itemId);
      handlers.onClick();
    };
  const handleDoubleClick =
    (itemType: storageItemIdType) => (e, itemId: storageItemId) => {
      handlers.onDoubleClick(itemId, itemType);
    };
  const isItemSelected = useCallback(
    (itemId) => {
      return selectedItem === itemId;
    },
    [selectedItem]
  );
  return (
    <div className="p-3 storageGridWrapper">
      <div className="flex flex-row flex-wrap gap-3">
        {folders.map((folder) => (
          <FolderCard
            onClick={handleClick("folder")}
            onDoubleClick={handleDoubleClick("folder")}
            selected={isItemSelected(folder?.id)}
            {...folder}
          />
        ))}
        {files.map((file) => (
          <FileCard
            onClick={handleClick("file")}
            onDoubleClick={handleDoubleClick("file")}
            selected={isItemSelected(file?.id)}
            {...file}
          />
        ))}
      </div>
    </div>
  );
};

export default StorageManager;
