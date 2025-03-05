interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  headerButtons?: React.ReactNode | null;
  headerDataComp?: React.ReactNode | null;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text,
  cardBoardHeight?: number;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
  headerButtons = null,
  headerDataComp = null,
  cardBoardHeight = 400
}) => {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      <div className="px-4 py-3 flex flex-row justify-between gap-3 items-center">
        <div className="flex flex-col gap-0">
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">{title}</h3>
          {desc && <p className="mt-0 text-sm text-gray-500 dark:text-gray-400">{desc}</p>}
        </div>
        {headerButtons}
      </div>
      {headerDataComp}

      {/* Card Body */}
      <div
        className="p-2 border-t border-gray-100 dark:border-gray-800 sm:p-4"
        style={{ minHeight: cardBoardHeight }}
      >
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
