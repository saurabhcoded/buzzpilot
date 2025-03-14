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
import { useAuth } from "../../hooks/useAuth";
import { LucideIcons } from "../../_constants/data";
import Checkbox from "../form/input/Checkbox";
import MultiSelect from "../form/MultiSelect";
import { useEffect, useState } from "react";
import { getAccountListbyType, getAccountsList } from "../../api/resources";
import Select from "../form/Select";
import StoragePathSelect from "../StorageManager/StoragePathSelect";
import { URL_CONFIG } from "../../_constants/url_config";
import API_CALL from "../../api/ApiTool";
import notify from "../../utils/notify";

type PostFormTabOptionsType = {
  form: "form";
  preview: "preview";
};
export interface postFormValuesInterface {
  title: string;
  description: string;
  tags: string;
  hashTags: string;
  storageAccount: string;
  accounts: string;
  privacy: string;
  document: any;
  thumbnail: any;
  isScheduled: boolean;
  scheduleTime: string | null;
}

const defaultValues: postFormValuesInterface = {
  title: "",
  description: "",
  tags: "",
  hashTags: "",
  storageAccount: "",
  accounts: "",
  isScheduled: false,
  scheduleTime: null,
  document: null,
  thumbnail: null,
  privacy: "public",
};

const postFormValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  tags: Yup.string().required("Tags are required"),
  hashTags: Yup.string().required("Hash Tags are required"),
  storageAccount: Yup.string().required("Storage Account is required"),
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
  document: Yup.string().required("Document is required"),
  thumbnail: Yup.string().required("Thumbnail is required"),
});

const CreatePostForm = ({ handleCloseCreateMode }) => {
  const { user } = useAuth();
  const handleCreatePost = async (postData) => {
    try {
      let posturl = URL_CONFIG.posts.createpost;
      let postPayload = postData;
      let postResponse = await API_CALL.post(posturl, postPayload);
      return postResponse?.data;
    } catch (Err) {
      console.error(Err);
      return Err;
    }
  };
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
  } = useFormik({
    initialValues: defaultValues,
    validateOnChange: true,
    validationSchema: postFormValidationSchema,
    onSubmit: async (values, helpers): Promise<void> => {
      helpers.setSubmitting(true);
      try {
        const postStatus = await handleCreatePost(values);
        if (postStatus?.status === 1) {
          handleCloseCreateMode?.();
          notify.success(postStatus?.message);
        } else {
          notify.error(postStatus?.message);
        }
      } catch (err) {
        console.log(err);
      }
      helpers.setSubmitting(false);
    },
  });
  console.log("form", { errors, values });
  const { isFieldError, getFieldError } = useFormikErrors({
    FormErrors: errors,
    FormTouched: touched,
  });

  const [accountsList, setAccountsList] = useState({
    social: [],
    storage: [],
    connectors: [],
  });

  useEffect(() => {
    if (user?.uid) {
      getAccountListbyType("all").then((accounts) => {
        console.log("accounts", accounts);
        let socialAccounts = [],
          storageAccounts = [],
          connectorAccounts = [];
        accounts.forEach((accItem) => {
          let accountItem = {
            value: accItem?.id,
            label: accItem?.name,
            selected: false,
            icon: accItem?.connector?.image ?? "",
          };
          if (accItem?.account_type === "social") {
            socialAccounts.push(accountItem);

            let isAccountExist = connectorAccounts.findIndex(
              (item) => item?.connector?.id === accItem?.connector?.id
            );
            if (isAccountExist >= 0) {
              connectorAccounts[isAccountExist].accounts.push(accountItem);
            } else {
              let connectorAcc = accItem?.connector;
              connectorAcc.accounts = [accountItem];
              connectorAccounts.push(connectorAcc);
            }
          } else if (accItem?.account_type === "storage") {
            storageAccounts.push(accountItem);
          }
        });
        setAccountsList({
          social: socialAccounts,
          storage: storageAccounts,
          connectors: connectorAccounts,
        });
      });

      getAccountsList(user?.uid);
    }
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
      <div className="space-y-2">
        <div className="grid grid-cols-2">
          {/* Post Details */}
          <div className="space-y-6 p-3 ">
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
                    type="datetime-local"
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
          </div>
          <div className="space-y-6 bg-gray-50 p-3 ">
            {/* Post Account */}
            <h4 className="text-black">
              <LucideIcons.Users size={"18"} color="red" className="inline" />{" "}
              Post accounts
            </h4>
            <div>
              <MultiSelect
                options={accountsList?.social}
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
            <hr />
            <h4 className="text-black">
              <LucideIcons.DatabaseZap
                size={"18"}
                color="green"
                className="inline"
              />{" "}
              Post Resources
            </h4>
            <div>
              <Label>Choose storage account</Label>
              <div className="flex">
                <Select
                  id="storageAccount"
                  name="storageAccount"
                  className="rounded-r-none border-r-0"
                  value={values?.storageAccount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={accountsList?.storage}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-l-none bg-green-200 hover:bg-green-300 ring-green-500"
                  startIcon={<LucideIcons.Zap size={16} color="green" />}
                >
                  Test
                </Button>
              </div>
              {isFieldError("storageAccount") && (
                <span className="text-red-500 text-sm">
                  {getFieldError("  ")}
                </span>
              )}
            </div>
            <div>
              <Label>Post Thumbnail</Label>
              <StoragePathSelect
                storageAccountId={values?.storageAccount}
                storageConnector="gdrive"
                value={values?.thumbnail}
                onChange={(value) => {
                  setFieldTouched("thumbnail", true);
                  setFieldValue("thumbnail", value);
                }}
              />
              {isFieldError("thumbnail") && (
                <span className="text-red-500 text-sm">
                  {getFieldError("thumbnail")}
                </span>
              )}
            </div>
            <div>
              <Label>Add media</Label>
              <StoragePathSelect
                storageAccountId={values?.storageAccount}
                storageConnector="gdrive"
                value={values?.document}
                onChange={(value) => {
                  setFieldTouched("document", true);
                  setFieldValue("document", value);
                }}
              />
              {isFieldError("document") && (
                <span className="text-red-500 text-sm">
                  {getFieldError("document")}
                </span>
              )}
            </div>
          </div>
        </div>
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
