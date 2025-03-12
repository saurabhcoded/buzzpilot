import ComponentCard from "../common/ComponentCard";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import FileInput from "../form/input/FileInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import useFormikErrors from "../../hooks/useFormikErrors";
import Button from "../ui/button/Button";
import { createYoutubePost } from "../../api/connectors/youtube_connector";
import { getIdToken } from "firebase/auth";
import { useAuth } from "../../hooks/useAuth";
import { LucideIcons, resources } from "../../_constants/data";
import Checkbox from "../form/input/Checkbox";
import MultiSelect from "../form/MultiSelect";
import { useEffect, useState } from "react";
import { getAccountsList, getConnectorsList } from "../../api/resources";
import { useOutletContext } from "react-router";
import TabGroup from "../form/TabGroup";
import { Eye, File } from "lucide-react";
import PostPreview from "./PostPreview";

type PostFormTabOptionsType = {
  form: "form";
  preview: "preview";
};
export interface postFormValuesInterface {
  title: string;
  description: string;
  tags: string;
  hashTags: string;
  accounts: string;
  privacy: string;
  document: any;
  isScheduled: boolean;
  scheduleTime: string | null;
}

const defaultValues: postFormValuesInterface = {
  title: "",
  description: "",
  tags: "",
  hashTags: "",
  accounts: "",
  isScheduled: false,
  scheduleTime: null,
  document: null,
  privacy: "public",
};

const postFormValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  tags: Yup.string().required("Tags are required"),
  hashTags: Yup.string().required("Hash Tags are required"),
  accounts: Yup.string().required("Account is required"),
  privacy: Yup.string().required("Privacy is required"),
  isScheduled: Yup.boolean().required("Scheduling option is required"),
  scheduleTime: Yup.string()
    .nullable()
    .test(
      "isScheduledEnabled",
      "Schedule timer is required",
      (value, context) => {
        if (value === null && context.parent.isScheduled) {
          return false;
        } else {
          return true;
        }
      }
    ),
  document: Yup.mixed()
    .required("A video file is required")
    .test("fileType", "Only video files are allowed", (file: any) =>
      file ? file.type.startsWith("video/") : false
    )
    .test("fileSize", "File size must be under 20MB", (file: any) =>
      file ? file.size <= 20 * 1024 * 1024 : false
    ),
});

const CreatePostForm = ({ handleCloseCreateMode }) => {
  const { user } = useAuth();
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    validateField,
  } = useFormik({
    initialValues: defaultValues,
    validateOnChange: true,
    validationSchema: postFormValidationSchema,
    onSubmit: async (values, helpers): Promise<void> => {
      helpers.setSubmitting(true);
      try {
        const createPostStatus = await createYoutubePost(values);
        if (createPostStatus) {
          handleCloseCreateMode?.();
        }
      } catch (err) {
        console.log(err);
      }
      helpers.setSubmitting(false);
    },
  });
  const { isFieldError, getFieldError } = useFormikErrors({
    FormErrors: errors,
    FormTouched: touched,
  });

  const [connectorList, setConnectorList] = useState([]);
  useEffect(() => {
    if (user?.uid)
      getAccountsList(user?.uid).then((accounts) => {
        let formmatedAccount = accounts.map((item) => {
          return {
            value: item?.id,
            text: item?.name,
            selected: false,
            icon: item?.connector?.image ?? "",
          };
        });
        setConnectorList(formmatedAccount);
      });
  }, [user?.uid]);

  const postformTabOptions: PostFormTabOptionsType = {
    form: "form",
    preview: "preview",
  };
  const [postFormTab, setPostFormTab] = useState<keyof PostFormTabOptionsType>(
    postformTabOptions.form
  );

  return (
    <div className="min-h-full">
      <div className="p-3 space-y-2">
        <div className="flex justify-start">
          <TabGroup
            activeTab={postFormTab}
            setActiveTab={setPostFormTab}
            tabOptions={[
              { icon: File, label: "Form", value: postformTabOptions?.form },
              {
                icon: Eye,
                label: "Preview",
                value: postformTabOptions?.preview,
              },
            ]}
          />
        </div>
        {postFormTab === postformTabOptions.form && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Post title</Label>
              <Input
                type="text"
                name="title"
                id="title"
                placeholder="Post title"
                value={values["title"]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={isFieldError("title")}
                hint={getFieldError("title")}
              />
            </div>
            <div>
              <Label htmlFor="description">Post description</Label>
              <TextArea
                name="description"
                id="description"
                placeholder="Describe your post"
                value={values["description"]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={isFieldError("description")}
                hint={getFieldError("description")}
              />
            </div>
            <div>
              <Label htmlFor="description">Post tags</Label>
              <TextArea
                name="tags"
                id="tags"
                placeholder="Add Post Tags in comma separated"
                value={values["tags"]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={isFieldError("tags")}
                hint={getFieldError("tags")}
              />
            </div>
            <div>
              <Label htmlFor="description">Hash tags</Label>
              <TextArea
                name="hashTags"
                id="hashTags"
                placeholder="Add Post Hash Tags"
                value={values["hashTags"]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={isFieldError("hashTags")}
                hint={getFieldError("hashTags")}
              />
            </div>
            <div>
              <Label>Add media</Label>
              <FileInput
                accept="video/*"
                onChange={(e) => {
                  setFieldTouched("document", true);
                  if (e?.target?.files?.[0]) {
                    setFieldValue("document", e?.target?.files?.[0]);
                    // e.target.value = ""; // Resetting the Input
                  }
                  validateField("document");
                }}
              />
              {isFieldError("document") && (
                <span className="text-red-500 text-sm">
                  {getFieldError("document")}
                </span>
              )}
            </div>
            <div>
              <Checkbox
                id={"privacy"}
                checked={values["privacy"] === "unlisted"}
                onChange={(val) => {
                  let value = val ? "unlisted" : "public";
                  setFieldValue("privacy", value);
                  setFieldTouched("privacy", true);
                }}
                label={"Is Video private"}
              />
            </div>
            <div>
              <Checkbox
                id={"isScheduled"}
                checked={values["isScheduled"]}
                onChange={(val) => {
                  setFieldValue("isScheduled", val);
                  setFieldTouched("isScheduled", true);
                }}
                label={"Schedule post"}
              />
              {values["isScheduled"] && (
                <div className="mt-4">
                  <Label>Choose post publish date</Label>
                  <Input
                    type="date"
                    name="scheduleTime"
                    id="scheduleTime"
                    value={values["scheduleTime"]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={isFieldError("scheduleTime")}
                    hint={getFieldError("scheduleTime")}
                  />
                </div>
              )}
            </div>
            <hr />
            <div>
              <MultiSelect
                options={connectorList}
                label={"Choose Account"}
                onChange={(selectedAccounts) => {
                  setFieldValue("accounts", selectedAccounts.join(","));
                  setFieldTouched("accounts", true);
                }}
              />
              {isFieldError("accounts") && (
                <span className="text-red-500 text-sm">
                  {getFieldError("accounts")}
                </span>
              )}
            </div>
          </div>
        )}
        {postFormTab === postformTabOptions.preview && (
          <PostPreview postData={values} />
        )}
      </div>
      <div className="sticky bottom-0 z-50 w-full bg-white border-t p-2">
        <Button
          loading={isSubmitting}
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {values["isScheduled"] ? "Schedule Post" : "Publish Post"}
        </Button>
      </div>
    </div>
  );
};

export default CreatePostForm;
