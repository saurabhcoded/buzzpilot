const {
    GetSecretValueCommand,
    SecretsManagerClient,
} = require("@aws-sdk/client-secrets-manager");
const clog = require("../services/ChalkService");
const {awsconfig} = require("../config/awsconfig");

/* Function to Get Secret Manager Value for Env */
const getSecretValue = async () => {
    try {
        const client = new SecretsManagerClient({
            region: awsconfig.secretRegion
        });
        const response = await client.send(
            new GetSecretValueCommand({
                SecretId: awsconfig.secretID
            }),
        );
        if (response.SecretString) {
            return JSON.parse(response.SecretString);
        }
    } catch (error) {
        clog.error(error);
        return {};
    }
};
const setEnvironmentVariables = async () => {
    let allowedKeys = [
        "JWT_SECRET", "DB_NAME", "DB_USER_NAME", "DB_PASSWORD", "DB_HOST", "COGNITO_POOL_ID", "COGNITO_CLIENT_ID", "COGNITO_REGION", "COGNITO_DOMAIN_URL", "COGNITO_CALLBACK_URL", "COGNITO_SECRET", "API_URL", "APP_URL", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_ENCRYPTION", "COMPANY_LOGO", "COMPANY_LINK", "COMPANY_NAME", "COMPANY_EMAIL", "PORT"
    ];
    try {
        console.log("Started Setting Env Using Secret Manager...");
        const res = await getSecretValue();
        if (res) {
            Object.keys(res).filter((key) => allowedKeys.includes(key)).forEach((key, keyIndex) => {
                if (res[key]) {
                    console.log("Setting Env...", key);
                    process.env[key] = res[key];
                };
            });
        }
        clog.success("End Setting Env Using Secret Manager...");
    } catch (error) {
        // Handle errors or log as needed
        clog.error("Error setting environment variables:", error);
    }
};
module.exports = setEnvironmentVariables;
