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
        })
        .catch((Err) => {
          console.error(Err);
        });
      setIsLoadingPostsList(false);
    }
  }, [user?.uid]);

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
        return <span>{moment(CurrDate).format(projectEnums.datetime_format)}</span>;
      },
    },
    {
      header: "Action",
      accessorKey: "metadata",
      cell: ({ row }) => {
        let Metadata = row?.original?.metadata;
        return (
          <div className="flex items-center gap-3">
            <a
              target="_blank"
              href={Metadata?.postUrl}
              className="btn text-white btn-error btn-sm rounded-md"
            >
              <LucideIcons.Youtube />
              Preview
            </a>
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