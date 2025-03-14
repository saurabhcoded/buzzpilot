import React, { useRef, useState } from "react";
import DriveStorageManager from "./DriveStorageManager";
import Input from "../form/input/InputField";
import BaseDialog from "../Dialog/BaseDialog";
import Button from "../ui/button/Button";
import { LucideIcons } from "../../_constants/data";

const StoragePathSelect = ({
  storageAccountId,
  storageConnector = "gdrive",
  value,
  onChange,
  showSelectButton = true,
}) => {
  const storageCompApi = useRef(null);
  const [openSelectDialog, setOpenSelectDialog] = useState(false);
  const [filepath, setFilepath] = useState("");
  const handleCloseDialog = () => {
    setOpenSelectDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenSelectDialog(true);
  };
  let isSelectDisabled = false;
  console.log(
    "storageCompApi.current?.storageApi",
    storageCompApi.current?.storageApi
  );
  const chooseFileActions = [
    {
      label: "Cancel",
      size: "sm",
      variant: "outline",
      disabled: false,
      action: () => {
        handleCloseDialog();
      },
    },
    {
      label: "Select",
      size: "sm",
      disabled: isSelectDisabled,
      action: () => {
        onChange(filepath, []);
        handleCloseDialog();
      },
    },
  ];
  console.log("filepath", filepath);
  return (
    <>
      <div className="flex w-full">
        <Input value={value} disabled className="rounded-r-none w-200" />
        <Button
          size="sm"
          startIcon={<LucideIcons.FileSearch size={14}/>}
          className="rounded-l-none bg-indigo-200 hover:bg-indigo-300 text-indigo-700"
          onClick={handleOpenDialog}
        >
          Choose
        </Button>
      </div>
      {openSelectDialog && (
        <BaseDialog
          title="Select storage account"
          open={true}
          setOpen={setOpenSelectDialog}
          actions={showSelectButton && chooseFileActions}
        >
          <DriveStorageManager
            ref={storageCompApi}
            storageAccountId={storageAccountId}
            onChangeHandler={(path) => {
              setFilepath(path);
            }}
          />
        </BaseDialog>
      )}
    </>
  );
};

export default StoragePathSelect;
