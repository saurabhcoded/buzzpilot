const express = require("express");
const axios = require("axios");
const { commonConfig, apiurlConfig } = require("../../config/config");
const { getQueryurl } = require("../../services/CommonService");

// Facebook App credentials
const FACEBOOK_CLIENT_ID = commonConfig.connector.facebook.clientId;
const FACEBOOK_CLIENT_SECRET = commonConfig.connector.facebook.clientSecret;
const REDIRECT_URI = commonConfig.connectCallbackUrl; // The redirect URL in Facebook app settings

//Generate auth url to Facebook login
const generateFbAuthUrl = () => {
  const fbAuthUrl = getQueryurl(apiurlConfig.connector.facebook.auth_url, {
    client_id: FACEBOOK_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope:
      "public_profile,email,pages_manage_posts,pages_read_engagement,publish_to_groups",
  });
  return fbAuthUrl;
};

// Generate facebook credentials from authCode
const getCredentialsFromFbauthcode = async (auth_code) => {
  if (!auth_code) {
    return null;
  }
  try {
    const response = await axios.get(
      apiurlConfig.connector.facebook.getCredentials,
      {
        params: {
          client_id: FACEBOOK_CLIENT_ID,
          client_secret: FACEBOOK_CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          code: auth_code,
        },
      }
    );

    // The access token is available here
    const credentials = response.data;
    console.log("credentials", credentials);
    return credentials;
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
};

// To create a facebook
const createFacebookPost = async (postData, accessToken) => {
  // Check if access token and message are provided
  if (!accessToken || !postData) {
    return null;
  }

  try {
    // Make the POST request to the Facebook Graph API
    const response = await axios.post(
      apiurlConfig.connector.facebook.create_post,
      {
        message: message, // Content of the post
        access_token: accessToken, // User's Facebook access token
      }
    );

    return { status: true, details: response?.data };
  } catch (error) {
    return {
      status: false,
      details: error?.response ? error?.response?.data : error?.message,
    };
  }
};

module.exports = {
  generateFbAuthUrl,
  getCredentialsFromFbauthcode,
  createFacebookPost
}
