import React, { useEffect, useState } from "react";
import { connectorsList, LucideIcons } from "../_constants/data";
import notify from "../utils/notify";
import { isFunction, useFormik } from "formik";
import * as Yup from "yup";
import useFormikErrors from "../hooks/useFormikErrors";
import Select from "../components/form/Select";
import Label from "../components/form/Label";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import { createAccountDoc, getConnectorsList, isAccountNameDuplicate } from "../api/resources";
import { ConnectorInterface } from "../types";
import { connectYoutubeAccount } from "../api/connectors/youtube_connector";
import { useAuth } from "../hooks/useAuth";
import API_CALL from "../api/ApiTool";

interface defaultValuesI {
  auth_type: string;
  name: string;
  description: string;
}

const AuthenticationOptions: { label: string; value: string }[] = [
  { label: "Oauth", value: "oauth" }
];

const defaultValues: defaultValuesI = {
  auth_type: "oauth",
  name: "",
  description: ""
};

const AddAccountForm = ({ handleClose }: { handleClose: Function }) => {
  const { user } = useAuth();
  const [selectedConnector, setSelectedConnector] = useState<ConnectorInterface | null>(null);
  const [connectorList, setConnectorList] = useState<ConnectorInterface[] | null>([]);

  const accountValidationSchema = Yup.object().shape({
    auth_type: Yup.string().required("Auth Type is required"),
    name: Yup.string().required("Account name is required"),
    description: Yup.string().required("Account description is required")
  });

  const loadConnectorList = async () => {
    let connData: ConnectorInterface[] = await getConnectorsList();
    console.log("connData", connData);
    let anyActivConn = connData?.find((item) => item?.enabled === true);
    if (anyActivConn?.id) setSelectedConnector(anyActivConn);
    setConnectorList(connData);
  };

  useEffect(() => {
    loadConnectorList();
  }, []);

  const handleConnectorClick = (connector: { id: string; label: string; enabled: boolean }) => {
    if (!connector.enabled) {
      notify.error(`${connector.label} integration is not supported yet.`);
      return;
    }
    setSelectedConnector(connector);
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
    onSubmit: async (values, helpers) => {
      helpers.setSubmitting(true);
      try {
        // Validate Account Name
        let accNameValid = await isAccountNameDuplicate(values?.name, selectedConnector?.id);
        console.log("accNameValid", accNameValid);
        // return;
        if (selectedConnector?.name === "youtube") {
          let credentials = await connectYoutubeAccount();
          console.log("YoutubeCredentials", credentials);
          // Send token to Node.js API for storage
          let accountData = {
            userId: user?.uid,
            metadata: JSON.stringify(credentials),
            provider: "youtube",
            name: values?.name,
            description: values?.description,
            auth_type: values?.auth_type,
            connector: selectedConnector?.id
          };
          const AccountSave = createAccountDoc(accountData);
          console.log("response", AccountSave);
          notify.success(`YouTube account[${values?.name}] is connected successfully`);
          if (isFunction(handleClose)) handleClose?.();
        }
      } catch (Err) {
        console.error(Err);
        notify.error(`Error while connecting account`);
      }
      helpers.setSubmitting(false);
    }
  });

  const handleTestConnection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setTouched({ auth_type: true, name: true, description: true });
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
        {connectorList.map((connector, connIndex) => (
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
            <Label>Account name</Label>
            <Input
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.name}
              id="name"
              name="name"
              error={isFieldError("name")}
              hint={getFieldError("name")}
              className="dark:bg-dark-900"
            />
          </div>
          <div>
            <Label>Account description</Label>
            <Input
              onChange={handleChange}
              onBlur={handleBlur}
              value={values?.description}
              id="description"
              name="description"
              error={isFieldError("description")}
              hint={getFieldError("description")}
              className="dark:bg-dark-900"
            />
          </div>
          <div className="flex flex-row gap-2">
            {/* <Button
              onClick={handleTestConnection}
              size="sm"
              className="bg-success-400 hover:bg-success-500"
              startIcon={<LucideIcons.Zap />}
            >
              Test Account
            </Button> */}
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

const ConnectorCheckCard = ({
  connector,
  selectedConnector,
  handleConnectorClick
}: {
  connector: ConnectorInterface;
  selectedConnector: ConnectorInterface;
  handleConnectorClick: Function;
}) => {
  const isConnectorSelected = connector.id === selectedConnector?.id;
  return (
    <div
      key={connector.name}
      onClick={() => handleConnectorClick(connector)}
      className={`flex flex-col gap-1 p-3 py-5 border items-center justify-center rounded-md 
          transition cursor-pointer ${
            !connector.enabled ? "opacity-50 cursor-not-allowed" : "hover:border-gray-400"
          } 
          ${
            isConnectorSelected ? "border-success-500 ring-2 ring-success-300" : "border-gray-200"
          }`}
    >
      <img src={connector.image} className="h-15 w-15" alt={connector.name} />
      <span className="mt-1 text-base text-gray-700 dark:text-gray-400 font-semibold">
        {connector.name}
      </span>
    </div>
  );
};
