import { Link } from "react-router-dom";
import { ArrowRight, LucideIcon } from "lucide-react";

interface Props {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  colorClass: string;
}

export function QuickActionCard({ title, description, icon: Icon, path, colorClass }: Props) {
  return (
    <Link to={path} className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all flex flex-col items-start text-left h-full">
       <div className={`size-12 rounded-2xl flex items-center justify-center mb-4 ${colorClass}`}>
         <Icon className="size-6" />
       </div>
       <h3 className="font-bold text-gray-900 mb-1.5 group-hover:text-brand-yellow transition-colors">{title}</h3>
       <p className="text-xs font-medium text-gray-500 flex-1 leading-relaxed">{description}</p>
       <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-brand-black uppercase tracking-wide">
         Let's go <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
       </div>
    </Link>
  );
}
