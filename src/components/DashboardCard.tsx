import { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

interface Props {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function DashboardCard({ title, subtitle, children, className, action, icon }: Props) {
  const hasHeader = title || icon || action;

  return (
    <div className={cn("bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col", className)}>
      {hasHeader && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && <div className="text-gray-400 bg-gray-50 p-2 rounded-xl">{icon}</div>}
            {title && (
              <div>
                <h3 className="font-bold text-gray-900">{title}</h3>
                {subtitle && <p className="text-sm font-medium text-gray-500 mt-0.5">{subtitle}</p>}
              </div>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
