import {useState} from "react";
import ComponentCard from "../components/common/ComponentCard";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import CreatePostForm from "../components/posts/CreatePostForm";
import Button from "../components/ui/button/Button";

export default function Posts() {
  const [postsList, setPostsList] = useState([]);
  const loadPostsList = () => {
    console.log("User Posts LIst");
  };
  return (
    <div>
      <PageMeta title="Buzzpilot" description="" />
      <PageBreadcrumb pageTitle="Posts" />
      <div className="grid grid-cols-1 gap-6">
        <CreatePostForm />
        <ComponentCard
          title="Manage Posts"
          desc="Here you can manage your posts"
          headerButtons={
            <div>
              <Button size="sm">Create Post</Button>
            </div>
          }
        >
          {/* <BasicTableOne /> */}
        </ComponentCard>
      </div>
    </div>
  );
}
