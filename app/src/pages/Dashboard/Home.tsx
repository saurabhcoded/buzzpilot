import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import { getAccountsList } from "../../api/resources";
import { useAuth } from "../../hooks/useAuth";
import { loadYoutubeAccountReport } from "../../api/connectors/youtube_connector";
import notify from "../../utils/notify";
import YouTubeAnalyticsChart from "../../components/charts/line/LineChartOne";
import Button from "../../components/ui/button/Button";
import { Link } from "react-router";
import { Loader } from "lucide-react";
import FallbackCard from "../../components/ui/cards/FallbackCard";

export default function Home() {
  const [showNoReports, setShowNoReports] = useState(false);
  const [loadingReport, setLoadingReport] = useState(true);
  const [youtubeReport, setYoutubeReport] = useState(null);
  const { user } = useAuth();
  let loadAccountReport = async (userId: string) => {
    let accounts = await getAccountsList(userId);
    if (accounts?.[0]) {
      setShowNoReports(false);
      loadYoutubeAccountReport(accounts?.[0]?.id)
        .then((reportData) => {
          if (reportData?.status === 1) {
            setYoutubeReport(reportData?.data);
            setLoadingReport(false);
          } else {
            notify.error(reportData?.message);
          }
        })
        .catch((Err) => {
          notify.error(Err);
          setLoadingReport(false);
        });
    } else {
      setShowNoReports(true);
      setLoadingReport(false);
    }
  };
  useEffect(() => {
    if (user?.uid) loadAccountReport(user?.uid);
  }, [user?.uid]);

  console.log("youtubeReport", youtubeReport);
  return (
    <>
      <PageMeta title="Buzzpilot" description="" />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 ">
          {loadingReport && <FallbackCard loading={true} />}
          {showNoReports && (
            <div className="flex flex-col justify-center items-center gap-2 py-10">
              <img
                className="w-80 rounded-lg bg-white"
                src="/public/images/icons/noreports.jpg"
                alt=""
              />
              <h4 className="text-lg">To view your report please add a account</h4>
              <Link to={"/accounts"} className="btn btn-primary">
                Add Account
              </Link>
            </div>
          )}
        </div>
        <div className="col-span-12 ">
          <YouTubeAnalyticsChart data={youtubeReport} />
          {/* <EcommerceMetrics />

          <MonthlySalesChart /> */}
        </div>
        {/* 
        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div> */}
      </div>
    </>
  );
}
