import { Cross, LucideIcon, X } from "lucide-react";
import React from "react";
import Button from "../ui/button/Button";
import ReactDOM from "react-dom";

type ActionType = {
  icon?: LucideIcon;
  label: string;
  variant?: "primary" | "outline";
  action: () => void;
  className?: string;
  btnProps?: { [key: string]: string };
};
type BaseDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  size?: "sm" | "md" | "lg" | "xl" | "fullscreen";
  title?: string;
  children?: React.ReactNode;
  actions?: ActionType[];
};

const BaseDialog: React.FC<BaseDialogProps> = ({
  open,
  setOpen,
  title,
  size = "md",
  children,
  actions = [],
}) => {
  if (!open) return null;
  let isActionsExist = Array.isArray(actions) && actions?.length > 0;
  let dialogClassSizewise = {
    sm: "w-full max-w-2xl",
    md: "w-full max-w-3xl",
    lg: "w-full max-w-4xl",
    xl: "w-full max-w-6xl",
    fullscreen: "w-screen",
  };
  let dialogClass = dialogClassSizewise?.[size];
  let contentHeightReduction = isActionsExist ? 140 : 80;
  if(size === "fullscreen") contentHeightReduction -= 20;

  return ReactDOM.createPortal(
    <div className="fixed top-0 inset-0 z-999 m-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded-2xl shadow-xl overflow-hidden ${dialogClass}`}>
        {/* Header */}
        {title && (
          <div className="flex justify-between items-center border-b px-4 h-[60px]">
            <h2 className="text-lg font-semibold text-black">{title}</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-800"
            >
              <X />
            </button>
          </div>
        )}

        {/* Content */}
        <div
          className="overflow-y-scroll"
          style={{ maxHeight: `calc(100vh - ${contentHeightReduction}px)` }}
        >
          {children}
        </div>

        {/* Footer */}
        {isActionsExist && (
          <div className="flex justify-end space-x-2 p-2 border-t h-[60px]">
            {actions.map((item) => (
              <Button
                variant={item?.variant ?? "primary"}
                onClick={item?.action}
                className={`${item?.className}`}
                {...(item?.btnProps ?? {})}
              >
                {item?.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default BaseDialog;
