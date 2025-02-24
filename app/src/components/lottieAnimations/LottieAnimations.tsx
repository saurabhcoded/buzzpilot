import Lottie from "lottie-react";
import notfound from "./notfound.json";
import loading from "./loading.json";

type LottieCompProps = {
  size?: string;
};

const sizeClasses: { [key: string]: string } = {
  sm: "h-60 w-60",
  md: "h-100 w-100",
  lg: "h-120 w-120"
};

export const NoDataFoundLottie = ({ size = "sm" }: LottieCompProps) => {
  let sizeCompClass = sizeClasses[size];
  return <Lottie className={sizeCompClass} animationData={notfound} loop={true} />;
};
export const LoadingLottie = ({ size = "sm" }: LottieCompProps) => {
  let sizeCompClass = sizeClasses[size];
  return <Lottie className={sizeCompClass} animationData={loading} loop={true} />;
};
