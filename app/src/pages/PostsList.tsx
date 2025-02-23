import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getPostsList } from "../api/resources";
import { PostInterface } from "../types";
import BasicTableOne from "../components/tables/BasicTables/BasicTableOne";
import { LucideIcons } from "../_constants/data";
import { ColumnDef } from "@tanstack/react-table";

const PostsList = () => {
  const [postsList, setPostsList] = useState<PostInterface[]>([]);
  const { user } = useAuth();
  useEffect(() => {
    if (user?.uid)
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
          <a className="link link-primary" target="_blank" href={Metadata?.postUrl}>
            {value}
          </a>
        );
      }
    },
    {
      header: "Description",
      accessorKey: "description"
    },
    {
      header: "Updated At",
      accessorKey: "updatedAt",
      cell: ({ getValue }) => {
        const CurrDate = getValue() as string;
        return <span>{CurrDate}</span>;
      }
    },
    {
      header: "Created at",
      accessorKey: "createdAt",
      cell: ({ getValue }) => {
        const CurrDate = getValue() as string;
        return <span>{CurrDate}</span>;
      }
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
      }
    }
  ];

  return (
    <div>
      <BasicTableOne columns={columns} data={postsList} />
    </div>
  );
};

export default PostsList;
