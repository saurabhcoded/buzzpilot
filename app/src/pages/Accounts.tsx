import { useEffect, useState } from "react";
import ComponentCard from "../components/common/ComponentCard";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import CreatePostForm from "../components/posts/CreatePostForm";
import BasicTableOne from "../components/tables/BasicTables/BasicTableOne";
import Button from "../components/ui/button/Button";
import { ColumnDef } from "@tanstack/react-table";
import { LucideIcons, resources } from "../_constants/data";
import notify from "../utils/notify";
import AddAccountForm from "./AddAccountForm";

export default function Accounts() {
  const [accountList, setAccountList] = useState([]);
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const loadAccountsList = () => {};
  useEffect(() => {
    loadAccountsList();
  }, []);

  const [testingAcc, setTestingAcc] = useState({ isTesting: false, rowIndex: null });
  const handleTestAccount = (accountData: any, rowIndex: number) => () => {
    setTestingAcc({ isTesting: true, rowIndex });
    setTimeout(() => {
      setTestingAcc({ isTesting: false, rowIndex: null });
      notify.success("Account Connection Success!");
    }, 2000);
  };
  // Define columns dynamically
  const columns: ColumnDef<Order>[] = [
    {
      header: "Account",
      accessorKey: "account",
      cell: ({ getValue }) => {
        const account = getValue() as Order["account"];
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 overflow-hidden">
              <img width={40} height={40} src={account.image} alt={account.name} />
            </div>
            <div>
              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                {account.name}
              </span>
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                {account.description}
              </span>
            </div>
          </div>
        );
      }
    },
    {
      header: "Authentication",
      accessorKey: "auth_type"
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const status = getValue() as string;
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
      }
    },
    {
      header: "Action",
      accessorKey: "action",
      cell: ({ row }) => {
        let AccountData = row?.original;
        const isTestingAcc = testingAcc?.isTesting && row?.index === testingAcc?.rowIndex;
        return (
          <div className="flex items-center gap-3">
            <Button
              className="bg-success-400 hover:bg-success-500 disabled:bg-success-300 rounded-none"
              size="xs"
              startIcon={<LucideIcons.Zap size={14} />}
              onClick={handleTestAccount(AccountData, row?.index)}
              loading={isTestingAcc}
              disabled={isTestingAcc}
            >
              Test
            </Button>
          </div>
        );
      }
    }
  ];

  const handleToggleAddAccount = () => setAddAccountOpen(!addAccountOpen);
  const handleOpenAddAccount = () => setAddAccountOpen(true);
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
                  className="bg-red-500 hover:bg-red-600"
                  onClick={handleToggleAddAccount}
                  size="sm"
                >
                  Cancel
                </Button>
              ) : (
                <Button onClick={handleToggleAddAccount} size="sm">
                  Add Account
                </Button>
              )}
            </div>
          }
          headerDataComp={addAccountOpen && <AddAccountForm />}
        >
          <BasicTableOne columns={columns} data={tableData} />
        </ComponentCard>
      </div>
    </div>
  );
}

// Define the Type for an Order
interface Order {
  id: number;
  account: {
    image: string;
    name: string;
    description: string;
  };
  auth_type: string;
  status: string;
}

// Define table data
const tableData: Order[] = [
  {
    id: 1,
    account: {
      image: resources.youtubeLogo,
      name: "Youtube",
      description: "Youtube Post, Community, Videos, Analytics"
    },
    auth_type: "OAuth",
    status: "Active"
  }
];
