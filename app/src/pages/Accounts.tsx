import { ColumnDef } from "@tanstack/react-table";
import { isEmptyArray } from "formik";
import { useEffect, useState } from "react";
import { LucideIcons } from "../_constants/data";
import { deleteAccountDoc, getAccountsList } from "../api/resources";
import ComponentCard from "../components/common/ComponentCard";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import BaseTable from "../components/tables/BasicTables/BaseTable";
import Button from "../components/ui/button/Button";
import FallbackCard from "../components/ui/cards/FallbackCard";
import { useAuth } from "../hooks/useAuth";
import { AccountInterface } from "../types";
import notify from "../utils/notify";
import AddAccountForm from "./AddAccountForm";

export default function Accounts() {
  const [accountList, setAccountList] = useState<AccountInterface[]>([]);
  const [loadingAccountList, setLoadingAccountList] = useState<boolean>(true);
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const { user } = useAuth();
  console.log("window", window.location.href);
  const loadAccountsList = async () => {
    if (user?.uid) {
      setLoadingAccountList(true);
      const AccountList = await getAccountsList(user?.uid);
      console.log("AccountList", AccountList);
      setAccountList(AccountList);
      setLoadingAccountList(false);
    }
  };
  useEffect(() => {
    loadAccountsList();
  }, [user?.uid]);

  const [testingAcc, setTestingAcc] = useState({
    isTesting: false,
    rowIndex: null,
  });
  const [deletingAcc, setDeletingAcc] = useState({
    isDeleting: false,
    rowIndex: null,
  });
  const handleTestAccount = (accountData: any, rowIndex: number) => () => {
    setTestingAcc({ isTesting: true, rowIndex });
    setTimeout(() => {
      setTestingAcc({ isTesting: false, rowIndex: null });
      notify.success("Account Connection Success!");
    }, 2000);
  };

  const handleToggleAddAccount = () => setAddAccountOpen(!addAccountOpen);
  const handleDeleteAccount =
    (accountId: string, rowIndex: number) => async () => {
      if (accountId) {
        setDeletingAcc({ rowIndex: rowIndex, isDeleting: true });
        let deleteResponse = await deleteAccountDoc(accountId);
        if (deleteResponse?.status) {
          notify.success(deleteResponse?.message);
        } else {
          notify.error(deleteResponse?.message);
        }
        setDeletingAcc({ isDeleting: false, rowIndex: null });
        loadAccountsList();
      }
    };

  // Table Columns
  const columns: ColumnDef<AccountInterface>[] = [
    {
      header: "Account",
      accessorKey: "connector",
      cell: ({ row, getValue }) => {
        const account = getValue() as Order["connector"];
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden p-2 rounded-full border bg-blue-100">
              <img
                width={'100%'}
                height={'100%'}
                className="object-contain"
                src={account.image}
                alt={account.name}
              />
            </div>
            <div className="flex-1 ">
              <span className="block font-medium text-gray-800 text-theme-xs dark:text-white/90">
                {row?.original?.name} [{account.name}]
              </span>
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                {row?.original?.description}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Connector",
      accessorKey: "connector",
      cell: ({ row, getValue }) => {
        const account = getValue() as Order["connector"];
        return <>{account.name}</>;
      },
    },
    {
      header: "Authentication",
      accessorKey: "auth_type",
    },
    {
      header: "Status",
      accessorKey: "active",
      cell: ({ getValue }) => {
        const status = getValue() === true ? "Active" : "Pending";

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              status === "Active"
                ? "bg-green-100 text-green-800"
                : status === "Pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: ({ row }) => {
        let AccountData = row?.original;
        const isTestingAcc =
          testingAcc?.isTesting && row?.index === testingAcc?.rowIndex;
        const isDeletingAcc =
          deletingAcc?.isDeleting && row?.index === deletingAcc?.rowIndex;
        return (
          <div className="flex items-center gap-3">
            <Button
              className="bg-success-400 hover:bg-success-500 disabled:bg-success-300 rounded-md"
              size="xs"
              startIcon={<LucideIcons.Zap size={14} />}
              onClick={handleTestAccount(AccountData, row?.index)}
              loading={isTestingAcc}
              disabled={isTestingAcc}
            >
              Test
            </Button>
            <button
              className="btn btn-circle btn-outline btn-error btn-xs"
              onClick={handleDeleteAccount(AccountData?.id, row?.index)}
              disabled={isDeletingAcc}
            >
              {isDeletingAcc ? (
                <LucideIcons.Loader />
              ) : (
                <LucideIcons.Trash size={14} />
              )}
            </button>
          </div>
        );
      },
    },
  ];

  const isNoDataAvailable = isEmptyArray(accountList);
  return (
    <div>
      <PageMeta title="Buzzpilot" description="" />
      <PageBreadcrumb pageTitle="Accounts" />
      <div className="grid grid-cols-1 gap-6">
        <ComponentCard
          title="Manage Accounts"
          desc="Here you can manage your accounts"
          headerButtons={
            <div>
              {addAccountOpen ? (
                <Button
                  className="bg-red-500 hover:bg-red-600 rounded-md"
                  onClick={handleToggleAddAccount}
                  size="xs"
                >
                  Cancel
                </Button>
              ) : (
                <Button onClick={handleToggleAddAccount} size="xs" className="rounded-md">
                  Add Account
                </Button>
              )}
            </div>
          }
        >
          {addAccountOpen ? (
            <AddAccountForm
              handleClose={() => {
                handleToggleAddAccount();
                loadAccountsList();
              }}
            />
          ) : isNoDataAvailable ? (
            <FallbackCard loading={loadingAccountList} />
          ) : (
            <BaseTable columns={columns} data={accountList} />
          )}
        </ComponentCard>
      </div>
    </div>
  );
}

// Define the Type for an Order
interface Order {
  id: number;
  connector: {
    id: string;
    name: string;
    image: string;
    description: string;
    enabled: string;
  };
  auth_type: string;
  active: string;
  metadata: string;
}
