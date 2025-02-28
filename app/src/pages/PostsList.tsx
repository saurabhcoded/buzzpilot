import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getPostsList } from "../api/resources";
import { PostInterface } from "../types";
import BaseTable from "../components/tables/BasicTables/BaseTable";
import { LucideIcons } from "../_constants/data";
import { ColumnDef } from "@tanstack/react-table";
import { isEmptyArray } from "formik";
import FallbackCard from "../components/ui/cards/FallbackCard";
import moment from "moment";
import { projectEnums } from "../_constants/project_enums";
import { Dropdown } from "../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../components/ui/dropdown/DropdownItem";
import Button from "../components/ui/button/Button";
import { Menu } from "lucide-react";
import { Link } from "react-router";

const PostsList = () => {
  const [isLoadingpostsList, setIsLoadingPostsList] = useState<boolean>(true);
  const [postsList, setPostsList] = useState<PostInterface[]>([]);
  const { user } = useAuth();
  useEffect(() => {
    if (user?.uid) {
      setIsLoadingPostsList(true);
      getPostsList(user?.uid)
        .then((response) => {
          console.log("response", response);
          if (Array.isArray(response)) {
            setPostsList(
              response?.map((post) => {
                post.metadata = JSON.parse(post.metadata);
                return post;
              })
            );
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
                className="flex items-center gap-x-1 text-nowrap"
              >
                <LucideIcons.LucideYoutube className="text-red-600" size={16} />
                <span className="text-sm">Youtube preview</span>
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
