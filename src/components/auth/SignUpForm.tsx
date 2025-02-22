import { useFormik } from "formik";
import { useState } from "react";
import { Link } from "react-router";
import * as Yup from "yup";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Checkbox from "../form/input/Checkbox";
import Input from "../form/input/InputField";
import useFormikErrors from "../../hooks/useFormikErrors";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile
} from "firebase/auth";
import { fireAuth } from "../../firebase/firebase";
import Button from "../ui/button/Button";
import { FirebaseError } from "firebase/app";
import { avatars } from "../../_constants/data";
import { generateRandomNumber } from "../../utils";
import notify from "../../utils/notify";

interface signupInitialValueInterface {
  firstname: string;
  lastname: string;
  email: string;
  phone_number: string;
  password: string;
}
const signupInitialValue: signupInitialValueInterface = {
  firstname: "",
  lastname: "",
  email: "",
  phone_number: "",
  password: ""
};

const signupValidationSchema = Yup.object({
  firstname: Yup.string()
    .required("First name is required")
    .min(4, "First name must be at least 2 characters long"),
  lastname: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters long"),
  email: Yup.string().required("Email is required").email("Enter a valid email address"),
  phone_number: Yup.string()
    .required("Phone number is required")
    .length(10, "Invalid Phone number"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[a-zA-Z]/, "Password must contain at least one letter")
    .matches(/[0-9]/, "Password must contain at least one number")
});

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { values, errors, touched, isSubmitting, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: signupInitialValue,
      validationSchema: signupValidationSchema,
      validateOnBlur: true,
      onSubmit: async (values, helpers): Promise<void> => {
        helpers.setSubmitting(true);
        try {
          const userCredential = await createUserWithEmailAndPassword(
            fireAuth,
            values.email,
            values.password
          )
            .then((Response) => {
              console.log("Signup Response", Response);
              return Response;
            })
            .catch((ResError: FirebaseError) => {
              let ErrMsg = ResError.message;
              if (ResError.code === "auth/invalid-credential") {
                ErrMsg = "Credentials Invalid";
              }
              notify.error(ErrMsg);
            });
          if (userCredential) {
            // Profile Photo and Name Add
            let avatarKey = `avatar${generateRandomNumber(1, 7)}`;
            let photoAvatar = avatars[avatarKey];
            await updateProfile(userCredential.user, {
              displayName: [values.firstname, values.lastname].join(" "),
              photoURL: photoAvatar
            });

            // TODO: Update Phone number to user details: phoneNumber: values.phone_number

            // Send email verification
            await sendEmailVerification(userCredential.user);
            notify.success(
              `Please check your inbox[${userCredential.user.email}] for verification email`
            );
          }
        } catch (error) {
          console.log(error);
          notify.error("Error registering user");
        }
        helpers.setSubmitting(false);
      }
    });

  const { isFieldError, getFieldError } = useFormikErrors({
    FormErrors: errors,
    FormTouched: touched
  });
  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      {/* TODO: Add Link Here for the Home */}
      {/* <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div> */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8 py-4">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>
          <div className="mb-4">
            <div className="grid grid-cols-1">
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                    fill="#EB4335"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div>
            </div>
            <form>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="firstname"
                      name="firstname"
                      value={values.firstname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter your first name"
                      error={isFieldError("firstname")}
                      hint={getFieldError("firstname")}
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lastname"
                      name="lastname"
                      placeholder="Enter your last name"
                      value={values["lastname"]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={isFieldError("lastname")}
                      hint={getFieldError("lastname")}
                    />
                  </div>
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={values["email"]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={isFieldError("email")}
                    hint={getFieldError("email")}
                  />
                </div>
                {/* <!-- Phone --> */}
                <div>
                  <Label>
                    Phone number<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="phone_number"
                    name="phone_number"
                    placeholder="Enter your phone"
                    value={values["phone_number"]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={isFieldError("phone_number")}
                    hint={getFieldError("phone_number")}
                  />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      value={values["password"]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={isFieldError("password")}
                      hint={getFieldError("password")}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                {/* <!-- Checkbox --> */}
                <div className="flex items-center gap-3">
                  <Checkbox className="w-5 h-5" checked={isChecked} onChange={setIsChecked} />

                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    By creating an account means you agree to the{" "}
                    <span className="text-gray-800 dark:text-white/90">Terms and Conditions,</span>{" "}
                    and our <span className="text-gray-800 dark:text-white">Privacy Policy</span>
                  </p>
                </div>
                {/* <!-- Button --> */}
                <div>
                  <Button
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="w-full"
                    size="sm"
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
