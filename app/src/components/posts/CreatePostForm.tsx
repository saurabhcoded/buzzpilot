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

interface initialValuesInterface {
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

const defaultValues: initialValuesInterface = {
  title: "",
  description: "",
  tags: "",
  hashTags: "",
  accounts: "",
  isScheduled: false,
  scheduleTime: null,
  document: null,
  privacy: "public"
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
    .test("isScheduledEnabled", "Schedule timer is required", (value, context) => {
      if (value === null && context.parent.isScheduled) {
        return false;
      } else {
        return true;
      }
    }),
  document: Yup.mixed()
    .required("A video file is required")
    .test("fileType", "Only video files are allowed", (file: any) =>
      file ? file.type.startsWith("video/") : false
    )
    .test("fileSize", "File size must be under 20MB", (file: any) =>
      file ? file.size <= 20 * 1024 * 1024 : false
    )
});

const CreatePostForm = () => {
  const { handleCloseCreateMode } = useOutletContext<any>();
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
    validateField
  } = useFormik({
    initialValues: defaultValues,
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
    }
  });
  const { isFieldError, getFieldError } = useFormikErrors({
    FormErrors: errors,
    FormTouched: touched
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
            icon: item?.connector?.image ?? ""
          };
        });
        setConnectorList(formmatedAccount);
      });
  }, [user?.uid]);

  return (
    <ComponentCard title="Create New Post">
      <div className="grid grid-cols-2 gap-4">
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
            <Input
              type="text"
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
              <span className="text-red-500 text-sm">{getFieldError("document")}</span>
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
              <span className="text-red-500 text-sm">{getFieldError("accounts")}</span>
            )}
          </div>
          <Button loading={isSubmitting} disabled={isSubmitting} onClick={handleSubmit}>
            {values["isScheduled"] ? "Schedule Post" : "Publish Post"}
          </Button>
        </div>
        <div className="flex flex-col gap-3 items-center justify-center bg-blue-light-25 p-2 pb-4">
          <div>
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90 inline-flex gap-1">
              <LucideIcons.Eye /> Preview
            </h3>
          </div>
          <div className="mockup-phone mx-auto w-fit">
            <div className="camera"></div>
            <div className="display">
              <div className="artboard artboard-demo phone-1">
                <img src={resources.youtubeDemo} height={"100%"} className="height" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComponentCard>
  );
};

export default CreatePostForm;
