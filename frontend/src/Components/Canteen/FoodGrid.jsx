import { Plus, Minus, Star, Leaf, Flame, Clock, Wine } from "lucide-react";

export default function FoodGrid({
  items,
  addToCart,
  removeFromCart,
  getItemQuantity,
}) {
  return (
    <>
      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6">
        {items.map((item) => {
          const isUnavailable =
            item.isAvailable === false || item.quantityAvailable === 0;
          const quantity = getItemQuantity(item._id);

          return (
            <div
              key={item._id}
              className={`
                relative bg-white
                rounded-xl sm:rounded-2xl
                shadow-md sm:shadow-lg
                transition overflow-hidden
                ${
                  isUnavailable
                    ? "opacity-75 grayscale-[0.5]"
                    : "hover:shadow-xl hover:-translate-y-1"
                }
              `}
            >
              {/* SOLD OUT OVERLAY */}
              {isUnavailable && (
                <div className="absolute inset-0 z-30 flex items-center justify-center">
                  <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
                  <div className="relative z-10 bg-white/90 border-2 border-red-400 px-4 py-2 rounded-xl -rotate-12 shadow-xl">
                    <p className="text-red-600 text-sm sm:text-xl font-black uppercase tracking-widest">
                      🚫 Sold Out
                    </p>
                    <p className="text-[10px] text-red-400 text-center font-bold">
                      Check later
                    </p>
                  </div>
                </div>
              )}

              {/* IMAGE */}
              <div
                className={`
                  relative flex items-center justify-center
                  min-h-[100px] sm:min-h-[300px]
                  bg-slate-950 rounded-lg sm:rounded-xl
                  overflow-hidden
                `}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className={`
                    h-40 sm:h-56 w-full object-contain
                    drop-shadow-[0_25px_25px_rgba(0,0,0,0.6)]
                    transition-transform duration-500
                    ${
                      !isUnavailable
                        ? "group-hover:scale-110 group-hover:-rotate-3"
                        : "opacity-40"
                    }
                  `}
                />
              </div>

              {/* CONTENT */}
              <div className="p-3 sm:p-5">
                {/* TITLE + RATING */}
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3
                      className={`
                        text-xs sm:text-xl font-bold
                        ${isUnavailable ? "text-gray-500" : "text-gray-900"}
                      `}
                    >
                      {item.name}
                    </h3>

                    {/* FOOD TYPE */}
                    <div className="flex gap-2 mt-1">
                      {item.foodType === "veg" && (
                        <span className="flex items-center gap-1 text-[8px] sm:text-xs px-2 py-0.5 rounded bg-green-50 text-green-600">
                          <Leaf className="sm:w-3 w-2 sm:h-3 h-2" /> Veg
                        </span>
                      )}
                      {item.foodType === "non-veg" && (
                        <span className="flex items-center gap-1 text-[8px] sm:text-xs px-2 py-0.5 rounded bg-red-50 text-red-600">
                          <Flame className="sm:w-3 w-2 sm:h-3 h-2" /> Non-Veg
                        </span>
                      )}
                      {item.foodType === "beverage" && (
                        <span className="flex items-center gap-1 text-[8px] sm:text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-600">
                          <Wine className="sm:w-3 w-2 sm:h-3 h-2" /> Drink
                        </span>
                      )}
                    </div>
                  </div>

                  {/* RATING */}
                  <div className="hidden sm:flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{item.rating}</span>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <p className="text-xs sm:text-sm text-gray-400 italic line-clamp-2 mb-3">
                  {item.description}
                </p>

                {/* STOCK + TIME */}
                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`
                      text-[8px] font-semibold px-3 py-1 rounded-full border
                      ${
                        isUnavailable
                          ? "bg-red-50 text-red-600 border-red-200"
                          : item.quantityAvailable <= 5
                          ? "bg-orange-50 text-orange-600 border-orange-200"
                          : "bg-green-50 text-green-600 border-green-200"
                      }
                    `}
                  >
                    {isUnavailable
                      ? "Out of stock"
                      : `Available: ${item.quantityAvailable}`}
                  </span>

                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="sm:w-4 w-3 h-3 sm:h-4" />
                    {item.time}
                  </div>
                </div>

                {/* PRICE + ACTION */}
                <div className="flex items-center justify-between">
                  <span
                    className={`
                      text-xs sm:text-2xl font-bold
                      ${isUnavailable ? "text-gray-400" : "text-orange-600"}
                    `}
                  >
                    ₹{item.price}
                  </span>

                  {quantity === 0 ? (
                    <button
                      onClick={() => addToCart(item)}
                      disabled={isUnavailable}
                      className="
                        px-3 sm:px-6
                        py-1 sm:py-2
                        text-sm sm:text-base
                        bg-gradient-to-r from-orange-600 to-red-600
                        text-white rounded-lg font-semibold
                        flex items-center gap-1 sm:gap-2
                        disabled:opacity-50
                      "
                    >
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      Add
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-orange-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>

                      <span className="font-bold text-sm sm:text-base text-orange-700">
                        {quantity}
                      </span>

                      <button
                        onClick={() => addToCart(item)}
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {items.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg">
            No items found matching your search
          </p>
        </div>
      )}
    </>
  );
}
