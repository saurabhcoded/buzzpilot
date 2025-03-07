import React, {
  ReactNode,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import FileCard from "./FileCard";
import Breadcrumb from "../common/BreadCrumb";
import { isEmptyArray } from "formik";
import FallbackCard from "../ui/cards/FallbackCard";
import { DropdownComp } from "../ui/dropdown/DropdownComp";
import { ArrowLeft, FilePlus, FolderPlus } from "lucide-react";
import Button from "../ui/button/Button";
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
  activeFolder: folderItemInterface;
  setActiveFolder: (args: { itemId: string }) => void;
  actions?: ReactNode;
  handlers: {
    onClick: VoidFunction;
    onDoubleClick: (args: {
      itemId: string;
      itemType: storageItemIdType;
      itemData: folderItemInterface;
    }) => void;
    onDelete: VoidFunction;
    onRename: VoidFunction;
    onDownload: VoidFunction;
    onAddFolder: VoidFunction;
    onAddFile: VoidFunction;
  };
}

const StorageManager: React.FC = React.forwardRef(
  (
    {
      listItems,
      handlers,
      actions,
      activeFolder,
      setActiveFolder,
    }: StorageManagerProps,
    apiRef
  ) => {
    let { folders, files } = listItems;
    const [loading, setLoading] = useState({ all: false, selected: false });
    const [itemsHistory, setItemsHistory] = useState([]);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const handleClick =
      (itemType: storageItemIdType) =>
      (actiontype: string, itemId: storageItemId, data: any) => {
        setSelectedItem(itemId);
        switch (actiontype) {
          case "download":
            handlers.onDownload(itemId);
            break;
          case "click":
            handlers.onClick();
            break;
          case "rename":
            handlers.onRename(itemId, data);
            break;

          default:
            break;
        }
      };
    const handleDoubleClick =
      (itemType: storageItemIdType) => (e, itemData: folderItemInterface) => {
        if (itemType === "folder")
          setItemsHistory((prev) => prev?.concat(itemData));
        handlers.onDoubleClick(itemData?.id, itemType, itemData);
      };
    const isItemSelected = useCallback(
      (itemId) => {
        return selectedItem === itemId;
      },
      [selectedItem]
    );

    useImperativeHandle(
      apiRef,
      () => ({
        itemsHistory: itemsHistory,
        selectedItem,
        setLoading: (attr: boolean) =>
          setLoading((prev) => ({ ...prev, all: attr })),
        setSelectedLoading: (attr: boolean) =>
          setLoading((prev) => ({ ...prev, selected: attr })),
      }),
      [itemsHistory, selectedItem, setLoading]
    );

    const isNoDataFound = isEmptyArray(folders) && isEmptyArray(files);
    const handelClickAction = () => {};
    let headerBottomHeight = actions ? 140 : 70;
    const handleGoback = () => {
      if (itemsHistory.length > 1) {
        let lastItem = itemsHistory?.[itemsHistory.length - 2];
        setActiveFolder(lastItem);
        setItemsHistory((prev) => prev.slice(0, itemsHistory.length - 1));
      }
    };
    return (
      <div className="storageGridWrapper h-full">
        <div className="px-3 h-[70px] w-full justify-between flex items-center bg-blue-50 border-b border-gray-100">
          <div className="label-header">
            <h2 className="text-xl font-semibold mb-1">
              {activeFolder?.name ?? "Home"}
            </h2>
            <Breadcrumb
              itemsHistory={itemsHistory}
              onClick={(item, itemIndex) => {
                if (item) {
                  setActiveFolder(item);
                } else {
                  setActiveFolder(null);
                }
                setItemsHistory((prev) => prev.slice(0, itemIndex));
              }}
            />
          </div>
          <div className="action-header">
            <DropdownComp
              buttonLabel="Add"
              buttonVariant={"full"}
              handleClick={handelClickAction}
              dropdownList={[
                {
                  label: "New Folder",
                  id: "file",
                  icon: <FolderPlus size={14} />,
                },
                {
                  label: "File Upload",
                  id: "file",
                  icon: <FilePlus size={14} />,
                },
              ]}
            />
          </div>
        </div>
        <div
          className="data-body relative"
          style={{ height: `calc(100% - ${headerBottomHeight}px)` }}
        >
          {loading.all && (
            <div className="absolute inset-0 z-40 bg-white/40 bg-opacity-50 flex items-center justify-center">
              <div className="flex items-center gap-2 text-2xl font-semibold">
                <span className="loading loading-spinner loading-xl"></span>{" "}
                Loading
              </div>
            </div>
          )}
          {isNoDataFound ? (
            <div className="flex flex-col items-center justify-center w-full">
              <FallbackCard />
              <div className="flex gap-2 items-center">
                <Button
                  size="sm"
                  className="rounded-md pe-5"
                  onClick={handleGoback}
                >
                  <ArrowLeft size={14} /> Back
                </Button>
                <DropdownComp
                  buttonLabel="Add"
                  buttonVariant={"full"}
                  handleClick={handelClickAction}
                  dropdownList={[
                    {
                      label: "New Folder",
                      id: "file",
                      icon: <FolderPlus size={14} />,
                    },
                    {
                      label: "File Upload",
                      id: "file",
                      icon: <FilePlus size={14} />,
                    },
                  ]}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-row flex-wrap gap-3 p-3">
              {folders.map((folder) => (
                <FileCard
                  itemType="folder"
                  onClick={handleClick("folder")}
                  onDoubleClick={handleDoubleClick("folder")}
                  selected={isItemSelected(folder?.id)}
                  data={folder}
                />
              ))}
              {files.map((file) => (
                <FileCard
                  itemType="file"
                  onClick={handleClick("file")}
                  onDoubleClick={handleDoubleClick("file")}
                  selected={isItemSelected(file?.id)}
                  data={file}
                />
              ))}
            </div>
          )}
        </div>
        {actions && <div className="data-body w-full actions h-[70px]"></div>}
      </div>
    );
  }
);

export default StorageManager;
