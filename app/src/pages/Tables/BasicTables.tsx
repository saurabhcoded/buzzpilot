import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BaseTable from "../../components/tables/BasicTables/BaseTable";

export default function BasicTables() {
  return (
    <>
      <PageMeta title="Buzzpilot" description="" />
      <PageBreadcrumb pageTitle="Basic Tables" />
      <div className="space-y-6">
        {/* <ComponentCard title="Basic Table 1">
          <BaseTable />
        </ComponentCard> */}
      </div>
    </>
  );
}
