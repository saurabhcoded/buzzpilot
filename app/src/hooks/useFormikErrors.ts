import { FormikErrors, FormikTouched, isString } from "formik";

interface UseFormikProps {
  FormErrors: FormikErrors<any>;
  FormTouched: FormikTouched<any>;
}
const useFormikErrors = ({ FormErrors, FormTouched }: UseFormikProps) => {
  const isFieldError = (fieldName: string) => {
    return !!(FormTouched?.[fieldName] && FormErrors?.[fieldName]);
  };
  const getFieldError = (fieldName: string) => {
    if (FormTouched?.[fieldName] && FormErrors?.[fieldName] && isString(FormErrors?.[fieldName]))
      return FormErrors?.[fieldName];
    return null;
  };
  return { isFieldError, getFieldError };
};

export default useFormikErrors;
