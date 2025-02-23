import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function YouTubeAnalyticsChart({ data }) {
  if (!data?.rows) return null;

  // Extract date labels and metric values
  const categories = data.rows.map((row) => row[0]); // Dates
  const views = data.rows.map((row) => row[1]);
  const likes = data.rows.map((row) => row[2]);
  const dislikes = data.rows.map((row) => row[3]);
  const comments = data.rows.map((row) => row[4]);

  const options: ApexOptions = {
    chart: {
      type: "line",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false }
    },
    colors: ["#465FFF", "#28C76F", "#FF4560", "#FEC400"], // Custom colors
    stroke: {
      curve: "smooth",
      width: 2
    },
    markers: {
      size: 4,
      hover: { size: 6 }
    },
    grid: { yaxis: { lines: { show: true } } },
    dataLabels: { enabled: false },
    xaxis: {
      type: "category",
      categories: categories, // Dynamic dates
      labels: { rotate: -45 }
    },
    yaxis: { labels: { style: { fontSize: "12px", colors: "#6B7280" } } },
    tooltip: { enabled: true },
    legend: { position: "top", horizontalAlign: "left" }
  };

  const series = [
    { name: "Views", data: views },
    { name: "Likes", data: likes },
    { name: "Dislikes", data: dislikes },
    { name: "Comments", data: comments }
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6 max-w-full overflow-x-auto custom-scrollbar">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Youtube Reports</h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          This graph shows the details report of your youtube channel
        </p>
      </div>
      <hr className="my-3" />
      <div className="min-w-[1000px]">
        <Chart options={options} series={series} type="line" height={310} />
      </div>
    </div>
  );
}
