import { useMemo, useState } from "react";
import ComponentCard from "../components/common/ComponentCard";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Button from "../components/ui/button/Button";
import { Outlet, useLocation, useNavigate } from "react-router";
import BaseDialog from "../components/Dialog/BaseDialog";
import CreatePostForm from "../components/posts/CreatePostForm";

export default function Posts() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isCreatePost = useMemo(() => pathname.includes("/posts/create"), []);
  const handleCreatePost = () => navigate("/posts/create");
  const handleGotoPosts = () => navigate("/posts");
  const [showPostDialog, setShowPostDialog] = useState(false);
  return (
    <div>
      <PageMeta title="Buzzpilot" description="" />
      <PageBreadcrumb pageTitle="Posts" />
      <div className="grid grid-cols-1 gap-6">
        <ComponentCard
          title={isCreatePost ? "Create New Post" : "Manage Posts"}
          desc={
            isCreatePost
              ? "Enter details of the post you want to publish"
              : "Here you can manage your posts"
          }
          headerButtons={
            <div>
              {isCreatePost ? (
                <Button
                  size="xs"
                  className="rounded-md"
                  onClick={() => setShowPostDialog(false)}
                >
                  Go to Posts
                </Button>
              ) : (
                <Button
                  size="xs"
                  className="rounded-md"
                  onClick={() => setShowPostDialog(true)}
                >
                  Create Post
                </Button>
              )}
            </div>
          }
        >
          <Outlet context={{ handleCloseCreateMode: handleGotoPosts }} />
          <BaseDialog
            open={showPostDialog}
            setOpen={setShowPostDialog}
            title="Create New Post"
            size="xl"
          >
            <CreatePostForm
              handleCloseCreateMode={() => {
                setShowPostDialog(false);
              }}
            />
          </BaseDialog>
        </ComponentCard>
      </div>
    </div>
  );
}
