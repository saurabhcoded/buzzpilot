import React, { useEffect, useState } from "react";
import DriveStorageManager from "../../components/StorageManager/DriveStorageManager";
import { getAccountListbyType } from "../../api/resources";
import { AccountInterface } from "../../types";
import Select from "../../components/form/Select";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import FallbackCard from "../../components/ui/cards/FallbackCard";

const StoragePage: React.FC = () => {
  const [currentStorageAcc, setCurrStorageAcc] = useState(null);
  const [storageOptions, setStorageOptions] = useState<AccountInterface[]>([]);
  const loadStorageOptions = async () => {
    const listData = await getAccountListbyType("storage");
    if (Array.isArray(listData)) {
      setStorageOptions(listData);
      setCurrStorageAcc(listData?.[0]?.id);
    }
  };
  useEffect(() => {
    loadStorageOptions();
  }, []);
  return (
    <div>
      <PageMeta title="Manage Storage" description="" />
      <PageBreadcrumb pageTitle="Manage Storage" />
      <ComponentCard
        title="Manage Accounts"
        desc="Here you can manage your storage data"
        headerButtons={
          <div>
            <Select
              id="storageAcc"
              name="storageAcc"
              value={currentStorageAcc}
              onChange={(e) => {
                setCurrStorageAcc(e?.target?.value);
              }}
              options={storageOptions.map((item) => ({
                label: item?.name,
                value: item?.id,
              }))}
            />
          </div>
        }
      >
        {currentStorageAcc ? (
          <DriveStorageManager storageAccountId={currentStorageAcc} />
        ) : (
          <FallbackCard message="No storage account added" />
        )}
      </ComponentCard>
    </div>
  );
};

export default StoragePage;
