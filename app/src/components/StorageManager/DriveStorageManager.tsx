import React, { useEffect, useRef, useState } from "react";
import StorageManager, {
  folderItemInterface,
  storagelistItemsInterface,
} from "./StorageManager";
import { projectEnums } from "../../_constants/project_enums";
import API_CALL, { API_CALL_FORMDATA } from "../../api/ApiTool";
import { URL_CONFIG } from "../../_constants/url_config";
import notify from "../../utils/notify";
import { obj2Formdata } from "../../utils";

type folderItemIdType = string | undefined;
type itemIdType = string;
type folderNameType = string;

let DriveAccessToken =
  "ya29.a0AeXRPp568n5_S0jXkPC6GpCSk6LQ9sR819OrQHChEAu1_g30WgkSTnDDQRYeZ4mveDsgwUM4vp0iUuF05IAPI4oizsVz_a3wpARwoKKd7Futy3RszvRc_g-60z2xVrxOa91Syh9Eax4zz6FC8JC_gTpx4RVoujNzHHlXz8IRaCgYKAc0SARISFQHGX2MiK568Kh92qArsXNUutj2CtQ0175";

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

  // To fetch the list of items withing drive
  const getListItems = async (folderId?: string | undefined) => {
    storageApiRef.current?.setLoading?.(true);
    try {
      let listItemsResponse = await API_CALL.post(
        URL_CONFIG.storage.drive.getItemsList,
        {
          access_token: DriveAccessToken,
          folderId: folderId ?? activeFolder?.id,
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

  // To Handle download and webview of the file item
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

  // To Handle delete an Item from drive
  const deleteItem = async (itemId: itemIdType) => {
    storageApiRef.current?.setSelectedLoading?.(true);
    try {
      let deletUrl =
        URL_CONFIG.storage.drive.deleteItem +
        `?access_token=${DriveAccessToken}&fileId=${itemId}`;
      let listItemsResponse = await API_CALL.delete(deletUrl);
      if (listItemsResponse?.data?.status === 1) {
        notify.success(listItemsResponse?.data?.message);
        getListItems();
      } else {
        notify.error(listItemsResponse?.data?.message);
      }
    } catch (err) {
      console.error(err);
    }
    storageApiRef.current?.setSelectedLoading?.(false);
  };

  // Function to upload a new Item
  const uploadFileItem = async (fileItemData) => {
    storageApiRef.current?.setLoading?.(true);
    try {
      let uploadFormData = obj2Formdata({
        access_token: DriveAccessToken,
        folderId: activeFolder?.id,
        file: fileItemData,
      });

      let listItemsResponse = await API_CALL_FORMDATA.post(
        URL_CONFIG.storage.drive.uploadFile,
        uploadFormData
      );
      if (listItemsResponse?.data?.status === 1) {
        notify.success(listItemsResponse?.data?.message);
        getListItems();
      } else {
        notify.error(listItemsResponse?.data?.message);
      }
    } catch (err) {
      console.error(err);
    }
    storageApiRef.current?.setLoading?.(false);
  };

  // To Create a new Folder
  const createNewFolderItem = async (folderName: folderNameType) => {
    storageApiRef.current?.setLoading?.(true);
    try {
      let listItemsResponse = await API_CALL.post(
        URL_CONFIG.storage.drive.addFolder,
        {
          access_token: DriveAccessToken,
          folderName: folderName,
          parentFolderId: activeFolder?.id,
        }
      );
      if (listItemsResponse?.data?.status === 1) {
        notify.success(listItemsResponse?.data?.message);
        getListItems();
      } else {
        notify.error(listItemsResponse?.data?.message);
      }
    } catch (err) {
      console.error(err);
    }
    storageApiRef.current?.setLoading?.(false);
  };

  // To Rename an Item
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
        getListItems();
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
