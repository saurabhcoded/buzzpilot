import React, { useState } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";

const AddFolderWindow = ({ onAddFolder, setIsAddFolderOpen }) => {
  const [folderName, setFolderName] = useState("New Folder");
  const handleChange = (e) => {
    setFolderName(e?.target?.value);
  };
  const handleSubmit = () => {
    onAddFolder(folderName);
    setIsAddFolderOpen(false);
  };
  return (
    <div className="p-3 flex flex-col gap-3">
      <h4>Add new folder</h4>
      <div className="">
        <Label>
          Folder Name <span className="text-error-500">*</span>{" "}
        </Label>
        <Input
          id="folderName"
          name="folderName"
          value={folderName}
          onChange={handleChange}
        />
      </div>
      <hr />
      <Button onClick={handleSubmit} className="rounded-md">
        Add Folder
      </Button>
    </div>
  );
};

export default AddFolderWindow;
