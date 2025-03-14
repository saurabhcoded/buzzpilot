import type React from "react";
import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label: string;
  options: Option[];
  defaultSelected?: string[];
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  defaultSelected = [],
  onChange,
  disabled = false,
}) => {
  const [selectedOptions, setSelectedOptions] =
    useState<string[]>(defaultSelected);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handleSelect = (optionValue: string) => {
    const newSelectedOptions = selectedOptions.includes(optionValue)
      ? selectedOptions.filter((value) => value !== optionValue)
      : [...selectedOptions, optionValue];

    setSelectedOptions(newSelectedOptions);
    onChange?.(newSelectedOptions);
  };

  const removeOption = (value: string) => {
    const newSelectedOptions = selectedOptions.filter((opt) => opt !== value);
    setSelectedOptions(newSelectedOptions);
    onChange?.(newSelectedOptions);
  };

  const selectedValuesText = selectedOptions.map(
    (value) => options.find((option) => option.value === value)?.label || ""
  );

  const inputWrapperRef = useRef(null);

  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {label}
      </label>

      <div className="relative z-20 inline-block w-full">
        <div className="relative flex flex-col items-center">
          <div
            onClick={toggleDropdown}
            className="w-full"
            ref={inputWrapperRef}
          >
            <div className="mb-2 flex min-h-11 rounded-lg border border-gray-300 py-1.5 pl-3 pr-3 shadow-theme-xs outline-none transition focus:border-brand-300 focus:shadow-focus-ring dark:border-gray-700 dark:bg-gray-900 dark:focus:border-brand-300">
              <div className="flex flex-wrap flex-auto gap-2">
                {selectedValuesText.length > 0 ? (
                  selectedValuesText.map((text, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-center rounded-full border-[0.7px] border-transparent bg-gray-100 py-1 pl-2.5 pr-2 text-sm text-gray-800 hover:border-gray-200 dark:bg-gray-800 dark:text-white/90 dark:hover:border-gray-800"
                    >
                      <span className="flex-initial max-w-full">{text}</span>
                      <div className="flex flex-row-reverse flex-auto">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            removeOption(selectedOptions[index]);
                          }}
                          className="pl-2 text-gray-500 cursor-pointer group-hover:text-gray-400 dark:text-gray-400"
                        >
                          <svg
                            className="fill-current"
                            role="button"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M3.40717 4.46881C3.11428 4.17591 3.11428 3.70104 3.40717 3.40815C3.70006 3.11525 4.17494 3.11525 4.46783 3.40815L6.99943 5.93975L9.53095 3.40822C9.82385 3.11533 10.2987 3.11533 10.5916 3.40822C10.8845 3.70112 10.8845 4.17599 10.5916 4.46888L8.06009 7.00041L10.5916 9.53193C10.8845 9.82482 10.8845 10.2997 10.5916 10.5926C10.2987 10.8855 9.82385 10.8855 9.53095 10.5926L6.99943 8.06107L4.46783 10.5927C4.17494 10.8856 3.70006 10.8856 3.40717 10.5927C3.11428 10.2998 3.11428 9.8249 3.40717 9.53201L5.93877 7.00041L3.40717 4.46881Z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <input
                    placeholder="Select option"
                    className="w-full h-full p-1 pr-2 text-sm bg-transparent border-0 outline-none appearance-none placeholder:text-gray-800 focus:border-0 focus:outline-none focus:ring-0 dark:placeholder:text-white/90"
                    readOnly
                    value="Select option"
                  />
                )}
              </div>
              <div className="flex items-center py-1 pl-1 pr-1 w-7">
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="w-5 h-5 text-gray-700 outline-none cursor-pointer focus:outline-none dark:text-gray-400"
                >
                  <svg
                    className={`stroke-current ${isOpen ? "rotate-180" : ""}`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.79175 7.39551L10.0001 12.6038L15.2084 7.39551"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {isOpen && (
            <MenuPopoverList
              options={options}
              selectedOptions={selectedOptions}
              handleSelect={handleSelect}
              anchorEl={inputWrapperRef.current}
              onClose={toggleDropdown}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;

type MenuPopoverListProps = {
  options: Option[];
  handleSelect: (value: string) => void;
  selectedOptions: string[];
  anchorEl: HTMLElement | null;
  onClose: () => void;
};
const MenuPopoverList: React.FC<MenuPopoverListProps> = ({
  options = [],
  handleSelect,
  selectedOptions,
  anchorEl,
  onClose,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 300,
    placement: "bottom",
  });

  useEffect(() => {
    if (anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const menuHeight = popoverRef?.current?.offsetHeight ?? 300;
      // Switch to top if not enough space below
      const placement =
        spaceBelow < menuHeight && spaceAbove > spaceBelow ? "top" : "bottom";

      setPosition({
        top:
          placement === "bottom"
            ? rect.bottom + window.scrollY
            : rect.top + window.scrollY - Math.min(menuHeight, spaceAbove), // Adjust for top placement
        left: rect.left + window.scrollX,
        width: rect.width,
        maxHeight:
          placement === "bottom"
            ? Math.min(spaceBelow - 10, menuHeight)
            : Math.min(spaceAbove - 10, menuHeight),
        placement,
      });
    }
  }, [anchorEl, popoverRef?.current?.offsetHeight]);

  // Clickaway listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !anchorEl?.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [anchorEl, onClose]);

  if (!anchorEl) return null;

  if (!anchorEl) return null;

  return ReactDOM.createPortal(
    <div
      ref={popoverRef}
      className="absolute z-9999 overflow-y-auto bg-white rounded-lg shadow-lg dark:bg-gray-900"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        maxHeight: `${position.maxHeight}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col">
        {options.map((option, index) => (
          <div
            key={index}
            className={`hover:bg-primary/5 w-full cursor-pointer border-b border-gray-200 dark:border-gray-800 ${
              selectedOptions.includes(option.value) ? "bg-primary/10" : ""
            }`}
            onClick={() => handleSelect(option.value)}
          >
            <div className="relative flex w-full items-center p-2">
              <div className="mx-2 leading-6 text-gray-800 dark:text-white/90">
                {option.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
};
