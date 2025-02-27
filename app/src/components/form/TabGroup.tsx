import { Dispatch, FC, SetStateAction } from "react";
import Button from "../ui/button/Button";
import { Eye } from "lucide-react";

type TabGroupPropsType = {
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  tabOptions: { label: string; value: string; icon: FC }[];
};
const TabGroup = ({
  activeTab,
  setActiveTab,
  tabOptions = [],
}: TabGroupPropsType) => {
  return (
    <div role="tablist" className="tabs tabs-boxed border">
      {tabOptions.map((tab) => (
        <a
          className={`tab flex flex-row gap-2 h-8 rounded-md ${
            tab?.value === activeTab
              ? "tab-active"
              : "bg-transparent hover:bg-transparent"
          }`}
          onClick={() => setActiveTab(tab.value)}
        >
          <tab.icon size={16} />
          {tab?.label}
        </a>
      ))}
    </div>
  );
};

export default TabGroup;
