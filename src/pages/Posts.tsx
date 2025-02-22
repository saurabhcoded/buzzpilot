import PageBreadcrumb from "../components/common/PageBreadCrumb";
import DefaultInputs from "../components/form/form-elements/DefaultInputs";
import InputGroup from "../components/form/form-elements/InputGroup";
import DropzoneComponent from "../components/form/form-elements/DropZone";
import CheckboxComponents from "../components/form/form-elements/CheckboxComponents";
import RadioButtons from "../components/form/form-elements/RadioButtons";
import ToggleSwitch from "../components/form/form-elements/ToggleSwitch";
import FileInputExample from "../components/form/form-elements/FileInputExample";
import SelectInputs from "../components/form/form-elements/SelectInputs";
import TextAreaInput from "../components/form/form-elements/TextAreaInput";
import InputStates from "../components/form/form-elements/InputStates";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import CreatePostForm from "../components/posts/CreatePostForm";
import BasicTableOne from "../components/tables/BasicTables/BasicTableOne";
import { useState } from "react";
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
          <BasicTableOne />
        </ComponentCard>
      </div>
    </div>
  );
}
