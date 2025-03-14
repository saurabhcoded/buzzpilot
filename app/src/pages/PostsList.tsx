import { ColumnDef } from "@tanstack/react-table";
import { isEmptyArray } from "formik";
import { Menu } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { LucideIcons } from "../_constants/data";
import { projectEnums } from "../_constants/project_enums";
import { getPostsList } from "../api/resources";
import BaseTable from "../components/tables/BasicTables/BaseTable";
import Button from "../components/ui/button/Button";
import FallbackCard from "../components/ui/cards/FallbackCard";
import { Dropdown } from "../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../components/ui/dropdown/DropdownItem";
import { useAuth } from "../hooks/useAuth";
import { PostInterface } from "../types";

const PostsList = () => {
  const [isLoadingpostsList, setIsLoadingPostsList] = useState<boolean>(true);
  const [postsList, setPostsList] = useState<PostInterface[]>([]);
  const { user } = useAuth();
  useEffect(() => {
    if (user?.uid) {
      setIsLoadingPostsList(true);
      getPostsList(user?.uid)
        .then((response) => {
          if (Array.isArray(response)) {
            setPostsList(response);
          }
          setIsLoadingPostsList(false);
        })
        .catch((Err) => {
          console.error(Err);
          setIsLoadingPostsList(false);
        });
    }
  }, [user?.uid]);

  const [dropdownActiv, setDropdownActiv] = useState<number | null>(null);
  const handleDropdownClose = () => {
    setDropdownActiv(null);
  };

  // Table Columns
  const columns: ColumnDef<PostInterface>[] = [
    {
      header: "Title",
      accessorKey: "title",
      cell: ({ row, getValue }) => {
        let Metadata = row?.original?.metadata;
        let value = getValue() as string;
        return (
          <a
            className="link link-primary"
            target="_blank"
            href={Metadata?.postUrl}
          >
            {value}
          </a>
        );
      },
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "Accounts",
      accessorKey: "accountData",
      cell: ({ getValue }) => {
        let accountData = getValue() as any[];
        return (
          <div className="flex flex-col gap-y-1">
            {accountData?.map((account, index) => {
              return !account ? (
                "No account"
              ) : (
                <Link
                  to={`/accounts/${account?.id}`}
                  key={index}
                  className="flex items-center gap-x-1 bg-gray-200 px-2 py-1 rounded-xl"
                >
                  <img
                    src={account?.connector?.image}
                    alt={account?.connector?.name}
                    className="w-4 h-4 rounded-full"
                  />
                  <span
                    title={account?.name}
                    className="text-xs text-nowrap inline-block overflow-hidden text-ellipsis max-w-20"
                  >
                    {account?.name}
                  </span>
                </Link>
              );
            })}
          </div>
        );
      },
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      cell: ({ getValue }) => {
        const CurrDate = getValue() as string;
        return (
          <span>{moment(CurrDate).format(projectEnums.datetime_format)}</span>
        );
      },
    },
    {
      header: "Created at",
      accessorKey: "createdAt",
      cell: ({ getValue }) => {
        const CurrDate = getValue() as string;
        return (
          <span>{moment(CurrDate).format(projectEnums.datetime_format)}</span>
        );
      },
    },
    {
      header: "Action",
      accessorKey: "metadata",
      cell: ({ row }) => {
        let Metadata = row?.original?.metadata;
        return (
          <div className="">
            <Button
              size="xs"
              variant="outline"
              className="rounded-full me-0"
              onClick={() => setDropdownActiv(row?.index)}
            >
              <Menu size={12} />
            </Button>
            <Dropdown
              isOpen={row?.index === dropdownActiv}
              onClose={handleDropdownClose}
              className="rounded-md"
            >
              <DropdownItem
                onClick={() => window.open(Metadata?.postUrl)}
                className="flex items-center gap-x-2 text-nowrap"
              >
                <LucideIcons.File size={16} />
                <span className="text-sm">Post details</span>
              </DropdownItem>
              <hr />
              <DropdownItem
                onClick={() => window.open(Metadata?.postUrl)}
                className="flex items-center gap-x-2 text-nowrap"
              >
                <LucideIcons.LineChart size={16} />
                <span className="text-sm">Post analytics</span>
              </DropdownItem>
              <hr />
              <DropdownItem
                onClick={() => window.open(Metadata?.postUrl)}
                className="flex items-center gap-x-2 text-nowrap"
              >
                <LucideIcons.Eye size={16} />
                <span className="text-sm">View post</span>
              </DropdownItem>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const isNoDataAvailable = isEmptyArray(postsList);

  return (
    <div>
      {isNoDataAvailable ? (
        <FallbackCard
          loading={isLoadingpostsList}
          message="No posts available"
        />
      ) : (
        <BaseTable columns={columns} data={postsList} />
      )}
    </div>
  );
};

export default PostsList;
