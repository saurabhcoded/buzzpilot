// require("dotenv").config();
exports.dbconfig = {
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: "mysql",
};

exports.commonConfig = {
  jwtSecret: process.env.JWT_SECRET ?? "CFrdizg8bGbMoMX01l26bU6",
  bucketName: process.env.AWS_BUCKET_NAME,
  bucketRegion: process.env.AWS_REGION_NAME,
  secretKeyID: process.env.AWS_SECRET_KEY_ID,
  accessKeyID: process.env.AWS_ACCESS_KEY_ID,
  allowedCors: process.env.ALLOWED_CORS,
  postmax_size: process.env.POST_MAX_SIZE,
  connectCallbackUrl: process.env.CONNECT_CALLBACK_URL,
  connector: {
    facebook: {
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      clientId: process.env.FACEBOOK_CLIENT_SECRET,
    },
    google: {
      clientSecret: process.env.GOOGLE_CLIENT_ID,
      clientId: process.env.GOOGLE_CLIENT_SECRET,
    },
    youtube: {
      scopes: process.env.YOUTUBE_SCOPES?.split?.(",") ?? [],
    },
    drive: {
      scopes: process.env.GOOGLEDRIVE_SCOPES?.split?.(",") ?? [],
    },
  },
};

exports.apiurlConfig = {
  connector: {
    facebook: {
      auth_url: "https://www.facebook.com/v10.0/dialog/oauth",
      create_post: "https://graph.facebook.com/v10.0/me/feed",
      getCredentials: "https://graph.facebook.com/v10.0/oauth/access_token",
    },
  },
};

exports.backendProjectEnums = {
  connectorTypes: {
    youtube: "youtube",
    linkedin: "linkedin",
    facebook: "facebook",
    threads: "threads",
    instagram: "instagram",
  },
};
