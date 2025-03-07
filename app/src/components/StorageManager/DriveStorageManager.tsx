import React, { useEffect, useState } from "react";
import StorageManager, { storagelistItemsInterface } from "./StorageManager";
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
  "ya29.a0AeXRPp5AiDnZnIswfoZG6tP6tRgryvKvVb6HC2ORZ0Tl9Nc08vQBLFaRn5j5jM23qS-Vd5STN5PWMV-xruPyxuMJ8JYnC7EFJk8t-rRg7BLvQwn1Rn38gfXECyseg35DtBrbMl0GapM78An5SwXh7d2i8wEs5nVxPv4vKBzKaCgYKAYASARMSFQHGX2Mi-R8G_3B0qxfPiv5pk3jxpQ0175";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listItems, setListItems] = useState<storagelistItemsInterface>({
    files: [],
    folders: [],
  });
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const getListItems = async (folderId: string | undefined) => {
    setIsLoading(true);
    try {
      let listItemsResponse = await API_CALL.post(
        URL_CONFIG.storage.drive.getItemsList,
        {
          access_token: DriveAccessToken,
          folderId: folderId,
        }
      );
      if (listItemsResponse?.data?.status === 1) {
        notify.success(listItemsResponse?.data?.message);
        let ListItems = googleDriveListToBuzzpilotStorage(
          listItemsResponse?.data?.data
        );
        setListItems(ListItems);
      } else {
        notify.error(listItemsResponse?.data?.message);
      }
      console.log("listItemsResponse", listItemsResponse);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };
  const downloadFileItem = (fileItemId: itemIdType) => {};
  const deleteItem = (itemId: itemIdType) => {};
  const uploadFileItem = (fileItemData) => {};
  const createNewFolderItem = (
    folderName: folderNameType,
    folderItemId: folderItemIdType
  ) => {};
  const renameListItem = (itemId: string) => {};
  useEffect(() => {
    getListItems(activeFolder);
  }, [activeFolder]);
  return (
    <div>
      <StorageManager
        listItems={listItems}
        handlers={{
          onClick: (itemId: itemIdType, itemType: folderItemIdType) => {},
          onDoubleClick: (itemId: itemIdType, itemType: folderItemIdType) => {
            console.log("Data", { itemId, itemType });
            if (itemType === projectEnums.storageItemTypes.folder)
              setActiveFolder(itemId);
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
