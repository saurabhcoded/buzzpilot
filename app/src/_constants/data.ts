import * as LucideImport from "lucide-react";

export const avatars: { [key: string]: string } = {
  default:
    "https://res.cloudinary.com/dcjuqulfd/image/upload/v1740219181/avatars/Asset_10_gqyhxr.svg",
  avatar1:
    "https://res.cloudinary.com/dcjuqulfd/image/upload/v1740219181/avatars/Asset_10_gqyhxr.svg",
  avatar2:
    "https://res.cloudinary.com/dcjuqulfd/image/upload/v1740219181/avatars/Asset_9_foikzn.svg",
  avatar3:
    "https://res.cloudinary.com/dcjuqulfd/image/upload/v1740219181/avatars/Asset_11_kyzx0g.svg",
  avatar4:
    "https://res.cloudinary.com/dcjuqulfd/image/upload/v1740219180/avatars/Asset_6_razd5d.svg",
  avatar5:
    "https://res.cloudinary.com/dcjuqulfd/image/upload/v1740219175/avatars/Asset_5_uhdwli.svg",
  avatar6:
    "https://res.cloudinary.com/dcjuqulfd/image/upload/v1740219175/avatars/Asset_4_cuehxy.svg",
  avatar7:
    "https://res.cloudinary.com/dcjuqulfd/image/upload/v1740219175/avatars/Asset_1_qzevon.svg"
};

export const resources: { [key: string]: any } = {
  full_logo: "/images/logo/logo2.png",
  full_dark_logo: "/images/logo/logo-dark.png",
  icon_logo: "/images/logo/logo-icon.png",
  icon_dark_logo: "/images/logo/logo-icon-dark.png",
  youtubeLogo:
    "https://res.cloudinary.com/dcjuqulfd/image/upload/v1740246895/connectors/1384060_cppm3f.png",
  facebookLogo:
    "https://res.cloudinary.com/dcjuqulfd/image/upload/v1740246967/connectors/Facebook_Logo__2019_.png_txaprz.webp",
  instagramLogo:
    "https://res.cloudinary.com/dcjuqulfd/image/upload/v1740247067/connectors/Instagram_vj5obd.webp",
  threadsLogo:
    "https://res.cloudinary.com/dcjuqulfd/image/upload/v1740247305/connectors/Threads__app__logo.svg_wscx06.png",
  linkedinLogo:
    "https://res.cloudinary.com/dcjuqulfd/image/upload/v1740247323/connectors/174857_oohiip.png",
  youtubeDemo:
    "https://res.cloudinary.com/dcjuqulfd/image/upload/v1740252184/WhatsApp_Image_2025-02-23_at_12.52.41_AM_zbj5rt.jpg",
  storage: {
    folder: {
      default: "/images/icons/folder-icon.svg",
    },
    file: {
      default: "/images/icons/file-icon.svg",
      docs: "/images/icons/google-docs.png",
      excel: "/images/icons/google-sheets.png",
      pdf: "/images/icons/pdf.png",
      image: "/images/icons/img.png",
      video: "/images/icons/video.png",
    },
  },
};

export const connectorsList: {
  label: string;
  id: string;
  image: string;
  description: string;
  enabled: boolean;
}[] = [
  {
    label: "Youtube",
    id: "youtube",
    image: resources.youtubeLogo,
    description: "Youtube Data API Connector",
    enabled: true
  },
  {
    label: "Facebook",
    id: "facebook",
    image: resources.facebookLogo,
    description: "Facebook API Connector",
    enabled: false
  },
  {
    label: "Instagram",
    id: "instagram",
    image: resources.instagramLogo,
    description: "Instagram API Connector",
    enabled: false
  },
  {
    label: "Threads",
    id: "threads",
    image: resources.threadsLogo,
    description: "Threads API Connector",
    enabled: false
  },
  {
    label: "Linkedin",
    id: "linkedin",
    image: resources.linkedinLogo,
    description: "LinkedIn API Connector",
    enabled: false
  }
];

export const LucideIcons = LucideImport;
