export const URL_CONFIG = {
  api_base_url: import.meta.env.VITE_APP_API_PATH,
  account: {
    youtube: {
      getAuthUrl: "/connector/youtube",
    },
    createAccount: "/account/create",
    editAccount: "/account/update",
    deleteAccount: "/account/delete",
  },
  posts: {
    youtube: {
      createpost: "/posts/createpost/youtube",
    },
  },
  storage: {
    drive: {
      getItemsList: "/connector/gdrive/items",
      getItemData: "/connector/gdrive/itemdata",
      deleteItem: "/connector/gdrive/delete",
      uploadFile: "/connector/gdrive/uploadfile",
      addFolder: "/connector/gdrive/addfolder",
      renameItem: "/connector/gdrive/rename",
    },
  },
};
