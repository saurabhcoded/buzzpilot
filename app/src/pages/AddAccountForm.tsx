import React, { useState } from "react";
import { connectorsList, LucideIcons } from "../_constants/data";
import notify from "../utils/notify";
import { useFormik } from "formik";
import * as Yup from "yup";
import useFormikErrors from "../hooks/useFormikErrors";
import Select from "../components/form/Select";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";

interface defaultValuesI {
  auth_type: string;
  client_id: string;
  client_secret: string;
}

const AuthenticationOptions: { label: string; value: string }[] = [
  { label: "Oauth", value: "oauth" }
];

const defaultValues: defaultValuesI = {
  auth_type: "oauth",
  client_id: "",
  client_secret: ""
};

const accountValidationSchema = Yup.object().shape({
  auth_type: Yup.string().required("Auth Type is required"),
  client_id: Yup.string()
    .min(5, "Client ID must be at least 5 characters")
    .required("Client ID is required"),
  client_secret: Yup.string()
    .min(8, "Client Secret must be at least 8 characters")
    .required("Client Secret is required")
});

const AddAccountForm = () => {
  const [selectedConnector, setSelectedConnector] = useState<string | null>("youtube");

  const handleConnectorClick = (connector: { label: string; enabled: boolean }) => {
    if (!connector.enabled) {
      notify.error(`${connector.label} integration is not supported yet.`);
      return;
    }
    setSelectedConnector(connector.label);
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    validateForm,
    setTouched,
    setErrors
  } = useFormik({
    initialValues: defaultValues,
    validationSchema: accountValidationSchema,
    onSubmit: (values, helpers) => {
      helpers.setSubmitting(true);
      try {
        console.log("Connect Account", values);
      } catch (Err) {
        console.error(Err);
      }
      helpers.setSubmitting(false);
    }
  });

  const handleTestConnection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setTouched({ auth_type: true, client_id: true, client_secret: true });
      validateForm(values).then((validateResult) => {
        setErrors(validateResult);
        console.log("validateResult", validateResult);
      });
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const { isFieldError, getFieldError } = useFormikErrors({
    FormErrors: errors,
    FormTouched: touched
  });

  return (
    <div className="px-5 py-3 border-t">
      <h4 className="text-base font-medium text-gray-800 dark:text-white/90">Connect Account</h4>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Here you can connect your accounts to use BuzzPilot successfully.
      </p>
      <div className="grid grid-cols-7 gap-3 mt-4">
        {connectorsList.map((connector, connIndex) => (
          <React.Fragment key={connIndex}>
            <ConnectorCheckCard
              connector={connector}
              selectedConnector={selectedConnector}
              handleConnectorClick={handleConnectorClick}
            />
          </React.Fragment>
        ))}
      </div>
      <form className="mt-5">
        <div className="space-y-6">
          <div>
            <Label>Authentication type</Label>
            <Select
              options={AuthenticationOptions}
              placeholder="Select Option"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.auth_type}
              id="auth_type"
              name="auth_type"
              error={isFieldError("auth_type")}
              hint={getFieldError("auth_type")}
              className="dark:bg-dark-900"
            />
          </div>
          <div>
            <Label>Client id</Label>
            <Input
              placeholder={`Write your ${selectedConnector} client id`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.client_id}
              id="client_id"
              name="client_id"
              error={isFieldError("client_id")}
              hint={getFieldError("client_id")}
              className="dark:bg-dark-900"
            />
          </div>
          <div>
            <Label>Client secret</Label>
            <Input
              placeholder={`Write your ${selectedConnector} client secret`}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.client_secret}
              id="client_secret"
              name="client_secret"
              error={isFieldError("client_secret")}
              hint={getFieldError("client_secret")}
              className="dark:bg-dark-900"
            />
          </div>
          <div className="flex flex-row gap-2">
            <Button
              onClick={handleTestConnection}
              size="sm"
              className="bg-success-400 hover:bg-success-500"
              startIcon={<LucideIcons.Zap />}
            >
              Test Account
            </Button>
            <Button onClick={handleSubmit} size="sm" startIcon={<LucideIcons.LucideSave />}>
              Save Account
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAccountForm;

const ConnectorCheckCard = ({ connector, selectedConnector, handleConnectorClick }) => {
  const isConnectorSelected = connector.id === selectedConnector;
  return (
    <div
      key={connector.label}
      onClick={() => handleConnectorClick(connector)}
      className={`flex flex-col gap-1 p-3 py-5 border items-center justify-center rounded-md 
          transition cursor-pointer ${
            !connector.enabled ? "opacity-50 cursor-not-allowed" : "hover:border-gray-400"
          } 
          ${
            isConnectorSelected ? "border-success-500 ring-2 ring-success-300" : "border-gray-200"
          }`}
    >
      <img src={connector.image} className="h-15 w-15" alt={connector.label} />
      <span className="mt-1 text-base text-gray-700 dark:text-gray-400 font-semibold">
        {connector.label}
      </span>
    </div>
  );
};
