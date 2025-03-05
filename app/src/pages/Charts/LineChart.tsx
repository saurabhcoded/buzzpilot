import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import LineChartOne from "../../components/charts/line/LineChartOne";
import PageMeta from "../../components/common/PageMeta";

export default function LineChart() {
  return (
    <>
      <PageMeta
        title="Buzzpilot"
        description=""
      />
      <PageBreadcrumb pageTitle="Line Chart" />
      <div className="space-y-6">
        {/* <ComponentCard title="Line Chart 1">
          <LineChartOne />
        </ComponentCard> */}
      </div>
    </>
  );
}
