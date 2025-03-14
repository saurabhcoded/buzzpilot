import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import StorageManager, {
  fileItemInterface,
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

type DriveStorageManagerProps = {
  storageAccountId: string;
  onChangeHandler: (path: string) => void;
};
const DriveStorageManager: React.FC<DriveStorageManagerProps> =
  React.forwardRef(({ storageAccountId, onChangeHandler }, apiRef) => {
    const storageApiRef = useRef(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [listItems, setListItems] = useState<storagelistItemsInterface>({
      files: [],
      folders: [],
    });
    const [activeFolder, setActiveFolder] = useState<fileItemInterface | null>(
      null
    );

    // To fetch the list of items withing drive
    const getListItems = async (folderId?: string | undefined) => {
      storageApiRef.current?.setLoading?.(true);
      try {
        let listItemsResponse = await API_CALL.post(
          URL_CONFIG.storage.drive.getItemsList,
          {
            storageAccountId: storageAccountId,
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
            storageAccountId: storageAccountId,
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
          `?storageAccountId=${storageAccountId}&fileId=${itemId}`;
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
          storageAccountId: storageAccountId,
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
            storageAccountId: storageAccountId,
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
            storageAccountId: storageAccountId,
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
    }, [activeFolder?.id, storageAccountId]);

    // to get the api access
    useImperativeHandle(
      apiRef,
      () => ({
        storageApi: storageApiRef.current,
      }),
      [storageApiRef.current]
    );
    return (
      <div className="min-h-screen rounded-lg border overflow-hidden">
        <StorageManager
          listItems={listItems}
          ref={storageApiRef}
          activeFolder={activeFolder}
          setActiveFolder={setActiveFolder}
          onChangeHandler={onChangeHandler}
          handlers={{
            onClick: (itemId: itemIdType, itemType: folderItemIdType) => {},
            onDoubleClick: (
              itemId: itemIdType,
              itemType: folderItemIdType,
              itemData: fileItemInterface
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
  });

export default DriveStorageManager;
