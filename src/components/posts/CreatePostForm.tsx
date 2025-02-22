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
import { fireAuth } from "../../firebase/firebase";
import { useAuth } from "../../hooks/useAuth";

interface initialValuesInterface {
  title: string;
  description: string;
  tags: string;
  document: any;
}

const defaultValues: initialValuesInterface = {
  title: "",
  description: "",
  tags: "",
  document: null
};

const postFormValidationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  tags: Yup.string().required("Tags are required"),
  document: Yup.mixed()
    .required("A video file is required")
    .test("fileType", "Only video files are allowed", (file: any) =>
      file ? file.type.startsWith("video/") : false
    )
    .test("fileSize", "File size must be under 100MB", (file: any) =>
      file ? file.size <= 100 * 1024 * 1024 : false
    )
});

const CreatePostForm = () => {
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
        console.log("Post values", values);
        const YoutubeToken = await getIdToken(user, true);
        const YoutubeUploadRes = await createYoutubePost(YoutubeToken, values);
        console.log(YoutubeUploadRes);
      } catch (err) {}
      helpers.setSubmitting(false);
    }
  });
  const { isFieldError, getFieldError } = useFormikErrors({
    FormErrors: errors,
    FormTouched: touched
  });
  return (
    <ComponentCard title="Create New Post">
      <div className="space-y-6">
        <div>
          <Label htmlFor="title">Post title</Label>
          <Input
            type="text"
            name="title"
            id="title"
            placeholder="post title"
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
          <Label>Add Media</Label>
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
          {/* <Select
            options={options}
            placeholder="Select an option"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          /> */}
        </div>
        {/* <div>
        <Label>Password Input</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
          >
            {showPassword ? (
              <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
            ) : (
              <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
            )}
          </button>
        </div>
      </div>
      <div>
        <Label htmlFor="datePicker">Date Picker Input</Label>
        <div className="relative w-full flatpickr-wrapper">
          <Flatpickr
            value={dateOfBirth} // Set the value to the state
            onChange={handleDateChange} // Handle the date change
            options={{
              dateFormat: "Y-m-d" // Set the date format
            }}
            placeholder="Select an option"
            className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
          />
          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
            <CalenderIcon className="size-6" />
          </span>
        </div>
      </div>
      <div>
        <Label htmlFor="tm">Date Picker Input</Label>
        <div className="relative">
          <Input
            type="time"
            id="tm"
            name="tm"
            onChange={(e) => console.log(e.target.value)}
          />
          <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
            <TimeIcon className="size-6" />
          </span>
        </div>
      </div>
      <div>
        <Label htmlFor="tm">Input with Payment</Label>
        <div className="relative">
          <Input type="text" placeholder="Card number" className="pl-[62px]" />
          <span className="absolute left-0 top-1/2 flex h-11 w-[46px] -translate-y-1/2 items-center justify-center border-r border-gray-200 dark:border-gray-800">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="6.25" cy="10" r="5.625" fill="#E80B26" />
              <circle cx="13.75" cy="10" r="5.625" fill="#F59D31" />
              <path
                d="M10 14.1924C11.1508 13.1625 11.875 11.6657 11.875 9.99979C11.875 8.33383 11.1508 6.8371 10 5.80713C8.84918 6.8371 8.125 8.33383 8.125 9.99979C8.125 11.6657 8.84918 13.1625 10 14.1924Z"
                fill="#FC6020"
              />
            </svg>
          </span>
        </div>
      </div> */}
        <Button loading={isSubmitting} disabled={isSubmitting} onClick={handleSubmit}>
          Save Post
        </Button>
      </div>
    </ComponentCard>
  );
};

export default CreatePostForm;
