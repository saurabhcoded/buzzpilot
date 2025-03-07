import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import React from "react";

export interface breadCrumbInterface {
  id: string;
  name: string;
  icon?: string | null;
}

interface BreadcrumbProps {
  itemsHistory: breadCrumbInterface[];
  onClick: () => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ itemsHistory, onClick }) => {
  return (
    <nav className="flex items-center space-x-1 text-gray-600 text-sm">
      <button
        onClick={() => onClick(null, 0)}
        className="hover:underline text-blue-600 inline-flex gap-2 items-center"
      >
        <Home size={14} /> Home
      </button>
      {itemsHistory.map((item, index) => (
        <React.Fragment key={item.id}>
          <ChevronRight size={14} />
          <button
            onClick={() => onClick(item, index + 1)}
            className="hover:underline text-blue-500"
          >
            {item.name}
          </button>
        </React.Fragment>
      ))}
      
    </nav>
  );
};

export default Breadcrumb;
