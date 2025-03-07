import React, { useEffect, useRef, useState } from "react";
import StorageManager, {
  folderItemInterface,
  storagelistItemsInterface,
} from "./StorageManager";
import { projectEnums } from "../../_constants/project_enums";
import API_CALL from "../../api/ApiTool";
import { URL_CONFIG } from "../../_constants/url_config";
import notify from "../../utils/notify";

type folderItemIdType = string | undefined;
type itemIdType = string;
type folderNameType = string;
type selectedItem = {
  itemType: folderItemIdType;
  itemId: itemIdType | null;
};

let DriveAccessToken =
  "ya29.a0AeXRPp5njLXX59gP5vjVy01aQbulVL3rZ6mZRPR9NR_RcxTd751IFHyvGXYGesy0ylUm-jD1z6TYaX4k-FP1aR0r_gfzxNQsy_XMeAGpHYmopeAHDqihmk6O9km6eiIc1bsdLruDoCGqDChc5cSULTcMUeRPt68onUbnmpRLWAaCgYKAW0SARMSFQHGX2Mi0qYwBARITBUdfJyjH6MkVw0177";

const googleDriveListToBuzzpilotStorage = (storageData) => {
  let FilesData = storageData.files.map((item) => {
    return {
      id: item?.id,
      name: item?.name,
      fileType: item?.mimeType,
      type: projectEnums.storageItemTypes.file,
      data: item,
    };
  });
  let FoldersData = storageData?.folders?.map?.((item) => {
    return {
      id: item?.id,
      name: item?.name,
      type: projectEnums.storageItemTypes.folder,
      data: item,
    };
  });
  return { files: FilesData, folders: FoldersData };
};
const DriveStorageManager = () => {
  const storageApiRef = useRef(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listItems, setListItems] = useState<storagelistItemsInterface>({
    files: [],
    folders: [],
  });
  const [activeFolder, setActiveFolder] = useState<folderItemInterface | null>(
    null
  );
  const getListItems = async (folderId: string | undefined) => {
    storageApiRef.current?.setLoading?.(true);
    try {
      let listItemsResponse = await API_CALL.post(
        URL_CONFIG.storage.drive.getItemsList,
        {
          access_token: DriveAccessToken,
          folderId: folderId,
        }
      );
      if (listItemsResponse?.data?.status === 1) {
        let ListItems = googleDriveListToBuzzpilotStorage(
          listItemsResponse?.data?.data
        );
        setListItems(ListItems);
      } else {
        notify.error(listItemsResponse?.data?.message);
      }
    } catch (err) {
      console.error(err);
    }
    storageApiRef.current?.setLoading?.(false);
  };
  const downloadFileItem = async (fileItemId: itemIdType) => {
    storageApiRef.current?.setSelectedLoading?.(true);
    try {
      let listItemsResponse = await API_CALL.post(
        URL_CONFIG.storage.drive.getItemData,
        {
          access_token: DriveAccessToken,
          fileId: fileItemId,
        }
      );
      if (listItemsResponse?.data?.status === 1) {
        let responseData = listItemsResponse?.data?.data;
        let downloadUrl =
          responseData?.webContentLink || responseData?.webViewLink;
        window.open(downloadUrl, "_blank");
      } else {
        notify.error(listItemsResponse?.data?.message);
      }
    } catch (err) {
      console.error(err);
    }
    storageApiRef.current?.setSelectedLoading?.(false);
  };
  const deleteItem = (itemId: itemIdType) => {};
  const uploadFileItem = (fileItemData) => {};
  const createNewFolderItem = (
    folderName: folderNameType,
    folderItemId: folderItemIdType
  ) => {};
  const renameListItem = async (
    itemId: string,
    data: { prevName: string; newName: string }
  ) => {
    storageApiRef.current?.setSelectedLoading?.(true);
    try {
      let listItemsResponse = await API_CALL.post(
        URL_CONFIG.storage.drive.renameItem,
        {
          access_token: DriveAccessToken,
          fileId: itemId,
          newName: data?.newName,
        }
      );
      if (listItemsResponse?.data?.status === 1) {
        notify.success(listItemsResponse?.data?.message);
        getListItems(activeFolder?.id);
      } else {
        notify.error(listItemsResponse?.data?.message);
      }
    } catch (err) {
      console.error(err);
    }
    storageApiRef.current?.setSelectedLoading?.(false);
  };
  useEffect(() => {
    getListItems(activeFolder?.id);
  }, [activeFolder?.id]);
  return (
    <div className="min-h-screen">
      <StorageManager
        listItems={listItems}
        ref={storageApiRef}
        activeFolder={activeFolder}
        setActiveFolder={setActiveFolder}
        handlers={{
          onClick: (itemId: itemIdType, itemType: folderItemIdType) => {},
          onDoubleClick: (
            itemId: itemIdType,
            itemType: folderItemIdType,
            itemData: folderItemInterface
          ) => {
            if (itemType === projectEnums.storageItemTypes.folder)
              setActiveFolder(itemData);
          },
          onDelete: deleteItem,
          onRename: renameListItem,
          onDownload: downloadFileItem,
          onAddFolder: createNewFolderItem,
          onAddFile: uploadFileItem,
        }}
      />
    </div>
  );
};

export default DriveStorageManager;
