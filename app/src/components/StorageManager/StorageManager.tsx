import React, {
  ForwardedRef,
  ReactNode,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import FileCard from "./FileCard";
import Breadcrumb from "../common/BreadCrumb";
import { isEmptyArray } from "formik";
import FallbackCard from "../ui/cards/FallbackCard";
import { DropdownComp } from "../ui/dropdown/DropdownComp";
import { ArrowLeft, FilePlus, FolderPlus } from "lucide-react";
import Button from "../ui/button/Button";
import AddFolderWindow from "./AddFolderWindow";
export type storageItemId = string;
export type storageItemIdType = string;
export interface fileItemInterface {
  id: string;
  name: string;
  icon?: string | null;
  type: string;
  fileType?: string;
  data?: any;
}

export interface storagelistItemsInterface {
  files: Array<fileItemInterface>;
  folders: Array<fileItemInterface>;
}

interface StorageManagerProps {
  listItems: storagelistItemsInterface;
  activeFolder: fileItemInterface;
  setActiveFolder: React.Dispatch<React.SetStateAction<fileItemInterface>>;
  onChangeHandler: (path: string) => void;
  actions?: ReactNode;
  handlers: {
    onClick: (itemId: string, itemType: string) => void;
    onDoubleClick: (
      itemId: string,
      itemType: string,
      itemData: fileItemInterface
    ) => void;
    onDelete: (itemId: string) => Promise<void>;
    onRename: (
      itemId: string,
      data: {
        prevName: string;
        newName: string;
      }
    ) => Promise<void>;
    onDownload: (fileItemId: string) => Promise<void>;
    onAddFolder: (folderName: string) => Promise<void>;
    onAddFile: (fileItemData: any) => Promise<void>;
  };
}

const StorageManager = React.forwardRef(
  (
    {
      listItems,
      handlers,
      actions,
      activeFolder,
      setActiveFolder,
      onChangeHandler,
    }: StorageManagerProps,
    apiRef: ForwardedRef<any>
  ) => {
    let { folders, files } = listItems;
    const [loading, setLoading] = useState({ all: false, selected: false });
    const [itemsHistory, setItemsHistory] = useState([]);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [isAddFolderOpen, setIsAddFolderOpen] = useState<boolean>(false);

    const selectedFile = useMemo(
      () => files.find((item) => item?.id === selectedItem),
      [selectedItem, files]
    );
    const selectedFolder = useMemo(
      () => folders.find((item) => item?.id === selectedItem),
      [selectedItem, files]
    );

    const isEnableGoback = () => {
      try {
        return itemsHistory?.length >= 1;
      } catch (error) {
        return false;
      }
    };

    const handleClick =
      (itemType: storageItemIdType) =>
      (actiontype: string, itemId: storageItemId, data: any) => {
        setSelectedItem(itemId);
        switch (actiontype) {
          case "download":
            handlers.onDownload(itemId);
            break;
          case "click":
            handlers.onClick(itemId, itemType);
            break;
          case "rename":
            handlers.onRename(itemId, data);
            break;
          case "delete":
            handlers.onDelete(itemId);
            break;

          default:
            break;
        }
        if (onChangeHandler) {
          let currentPath = itemsHistory?.map((item) => item?.name)?.join("/");
          if (data?.type === "file") {
            currentPath += `/${data?.name}`;
          }
          onChangeHandler(currentPath);
        }
      };
    const handleDoubleClick =
      (itemType: storageItemIdType) => (e, itemData: fileItemInterface) => {
        if (itemType === "folder")
          setItemsHistory((prev) => prev?.concat(itemData));
        handlers.onDoubleClick(itemData?.id, itemType, itemData);
      };
    const isItemSelected = useCallback(
      (itemId: string) => {
        return selectedItem === itemId;
      },
      [selectedItem]
    );

    useImperativeHandle(
      apiRef,
      () => ({
        itemsHistory: itemsHistory,
        selectedFile,
        selectedItem,
        setLoading: (attr: boolean) => {
          setLoading((prev) => ({ ...prev, all: attr }));
        },
        setSelectedLoading: (attr: boolean) => {
          setLoading((prev) => ({ ...prev, selected: attr }));
        },
        getSelectedPath: () => {
          let currentPath = itemsHistory?.map((item) => item?.name)?.join("/");
          if (selectedFile) {
            currentPath += `/${selectedFile?.name}`;
          }
          return currentPath;
        },
      }),
      [itemsHistory, selectedItem, selectedFile, setLoading]
    );

    const isNoDataFound = isEmptyArray(folders) && isEmptyArray(files);
    const handelClickAction = (action) => {
      if (action === "addfolder") {
        setIsAddFolderOpen(true);
      }
    };
    let headerBottomHeight = actions ? 140 : 70;
    const handleGoback = () => {
      if (itemsHistory.length >= 1) {
        let lastItem = itemsHistory?.[itemsHistory.length - 2];
        setActiveFolder(lastItem);
        setItemsHistory((prev) => prev.slice(0, itemsHistory.length - 1));
      }
    };

    return (
      <div className="storageGridWrapper h-full">
        <div className="px-3 h-[70px] w-full justify-between flex items-center bg-blue-50 border-b border-gray-100">
          <div className="label-header">
            <h2 className="text-xl font-semibold text-black mb-1">
              {activeFolder?.name ?? "Home"}
            </h2>
            <Breadcrumb
              itemsHistory={itemsHistory}
              onClick={(item: any, itemIndex: number) => {
                if (item) {
                  setActiveFolder(item);
                } else {
                  setActiveFolder(null);
                }
                setItemsHistory((prev) => prev.slice(0, itemIndex));
              }}
            />
          </div>
          <div className="action-header flex gap-2">
            <Button
              size="sm"
              className="rounded-md pe-5"
              onClick={handleGoback}
              disabled={!isEnableGoback()}
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
                  id: "addfolder",
                  icon: <FolderPlus size={14} />,
                },
                {
                  label: "File Upload",
                  id: "uploadfile",
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
          {Boolean(isAddFolderOpen) && (
            <AddFolderWindow
              onAddFolder={handlers.onAddFolder}
              setIsAddFolderOpen={setIsAddFolderOpen}
            />
          )}
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
                      id: "addfolder",
                      icon: <FolderPlus size={14} />,
                    },
                    {
                      label: "File Upload",
                      id: "uploadfile",
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
