import { LoadingLottie, NoDataFoundLottie } from "../../lottieAnimations/LottieAnimations";

type FallbackCardProps = {
  message?: string;
  loading?: boolean;
};
const FallbackCard = ({ message = "No data found", loading = false }: FallbackCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-3 min-h-[100px]">
      {loading ? <LoadingLottie /> : <NoDataFoundLottie />}
      <h4 className="font-bold text-xl">{loading ? "Loading..." : message}</h4>
    </div>
  );
};

export default FallbackCard;
