import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";

export function Blog() {
  const articles = [
    { id: 1, title: "How to Safely Rent Power Tools", category: "Safety", date: "Oct 12, 2026", image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&q=80" },
    { id: 2, title: "The Ultimate Guide to Camping Gear", category: "Guide", date: "Oct 10, 2026", image: "https://images.unsplash.com/photo-1504280390225-b07facb2b622?w=500&q=80" },
    { id: 3, title: "Why Circular Economy Matters", category: "Community", date: "Oct 8, 2026", image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=500&q=80" },
    { id: 4, title: "Top 10 Party Items to Rent", category: "Tips", date: "Oct 5, 2026", image: "https://images.unsplash.com/photo-1496337589254-7e19d01cec44?w=500&q=80" },
  ];

  return (
    <div className="pt-32 pb-24 bg-[#FDF8F2] min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-black text-brand-black mb-6 tracking-tight">Lendly Blog</h1>
        <p className="text-xl font-medium text-gray-600 mb-16 max-w-2xl">Educational resources, community updates, and tips for safe borrowing and lending.</p>

        {/* Featured Article */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-16 grid md:grid-cols-2 group hover:shadow-md transition-shadow">
          <div className="h-64 md:h-full overflow-hidden">
             <img src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&q=80" alt="Featured" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="p-10 md:p-16 flex flex-col justify-center">
             <span className="px-3 py-1 bg-brand-yellow/20 text-brand-black font-bold text-xs uppercase tracking-wider rounded-lg w-fit mb-4">Featured</span>
             <h2 className="text-3xl font-black text-brand-black mb-4 leading-tight">Mastering the Art of Neighborhood Lending</h2>
             <p className="text-gray-600 mb-8 font-medium">Discover how sharing resources with your neighbors not only saves money but builds a stronger, more resilient community.</p>
             <button className="flex items-center gap-2 font-bold text-brand-black hover:text-brand-yellow transition-colors w-fit">
               Read Article <ArrowRight className="size-4" />
             </button>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {articles.map(article => (
            <div key={article.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-shadow flex flex-col">
               <div className="h-48 overflow-hidden">
                 <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               </div>
               <div className="p-6 flex-1 flex flex-col">
                 <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-brand-yellow uppercase tracking-wider">{article.category}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-xs font-medium text-gray-500 flex items-center gap-1"><Calendar className="size-3" /> {article.date}</span>
                 </div>
                 <h3 className="text-lg font-bold text-brand-black mb-4 leading-tight group-hover:text-brand-yellow transition-colors">
                   {article.title}
                 </h3>
                 <div className="mt-auto">
                   <button className="font-bold text-sm flex items-center gap-1 text-gray-800 hover:text-brand-yellow transition-colors">
                     Read more <ArrowRight className="size-3" />
                   </button>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
