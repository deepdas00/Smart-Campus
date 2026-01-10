import { Search } from "lucide-react";

export default function SearchAndCategory({
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div className="mb-6 sm:mb-8">
      {/* 🔍 SEARCH */}
      <div className="relative mb-4 sm:mb-6">
        <Search
          className="
            absolute left-3 sm:left-4 top-1/2 -translate-y-1/2
            w-4 h-4 sm:w-5 sm:h-5
            text-gray-400
          "
        />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for food items..."
          className="
            w-full
            pl-10 sm:pl-12
            pr-3 sm:pr-4
            py-3 sm:py-4
            text-sm sm:text-base
            bg-white
            rounded-lg sm:rounded-xl
            border-2 border-gray-200
            focus:border-orange-500
            focus:ring-2 focus:ring-orange-200
            outline-none transition
          "
        />
      </div>

      {/* 🍽 CATEGORY PILLS */}
      <div
        className="
          flex gap-2 sm:gap-3
          overflow-x-auto
          pb-1 sm:pb-2
          no-scrollbar
        "
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`
              flex items-center gap-1.5 sm:gap-2
              px-4 sm:px-6
              py-2 sm:py-3
              rounded-lg sm:rounded-xl
              text-xs sm:text-sm
              font-medium
              whitespace-nowrap
              transition
              ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md sm:shadow-lg"
                  : "bg-white border-2 border-gray-200 hover:bg-gray-50"
              }
            `}
          >
            <span className="text-sm sm:text-base">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
