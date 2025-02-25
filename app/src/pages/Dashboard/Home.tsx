import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { loadYoutubeAccountReport } from "../../api/connectors/youtube_connector";
import { getAccountsList } from "../../api/resources";
import YouTubeAnalyticsChart from "../../components/charts/line/LineChartOne";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import FallbackCard from "../../components/ui/cards/FallbackCard";
import { useAuth } from "../../hooks/useAuth";
import { AccountInterface } from "../../types";
import notify from "../../utils/notify";

interface AccountReportI extends AccountInterface {
  accountReport?: any;
}

export default function Home() {
  const [showNoReports, setShowNoReports] = useState<boolean>(false);
  const [dataConfigs, setDataConfigs] = useState({
    startDate: moment().startOf("month").format("YYYY-MM-DD"),
    endDate: moment().endOf("month").format("YYYY-MM-DD")
  });
  const [accountsData, setAccountsData] = useState<AccountInterface[]>([]);
  const [loadingReport, setLoadingReport] = useState<boolean>(true);
  const [youtubeReport, setYoutubeReport] = useState<AccountReportI[] | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      getAccountsList(user?.uid).then((accounts) => {
        setAccountsData(accounts);
      });
    }
  }, [user?.uid]);

  let loadAccountReport = async () => {
    setShowNoReports(false);
    let reportsData: AccountReportI[] = [];
    if (accountsData?.length === 0) {
      setShowNoReports(true);
    } else {
      setShowNoReports(false);
    }
    for (let ii = 0; ii < accountsData.length; ii++) {
      try {
        const currAccount = accountsData[ii] as AccountReportI;
        let reportData = await loadYoutubeAccountReport(currAccount?.id, dataConfigs);
        if (reportData?.status === 1) {
          currAccount.accountReport = reportData?.data;
          reportsData.push(currAccount);
        } else {
          notify.error(reportData?.message);
        }
      } catch (Err) {
        console.error(Err);
      }
    }
    setYoutubeReport(reportsData);
    setLoadingReport(false);
  };
  useEffect(() => {
    if (Array.isArray(accountsData) && accountsData?.length > 0) loadAccountReport();
  }, [accountsData?.length]);

  return (
    <>
      <PageMeta title="Buzzpilot" description="" />
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {(showNoReports || loadingReport) && (
          <div className="col-span-12">
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
        )}
        {Array.isArray(youtubeReport) &&
          youtubeReport.map((accountReport) => {
            if (accountReport?.accountReport) {
              return (
                <div className="col-span-12" key={accountReport?.id}>
                  <YouTubeAnalyticsChart
                    label={
                      <span className="inline-flex gap-2 items-center">
                        <span className="inline-flex items-center capitalize gap-1 py-1 px-3 bg-gray-100 rounded-full text-sm">
                          <img
                            src={accountReport?.connector?.image}
                            alt={accountReport?.connector?.name}
                            className="h-5 w-5"
                          />
                          {accountReport?.connector?.name}
                        </span>
                        <span>{accountReport?.name + " Report"}</span>
                      </span>
                    }
                    data={accountReport?.accountReport}
                  />
                </div>
              );
            } else {
              return null;
            }
          })}

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
