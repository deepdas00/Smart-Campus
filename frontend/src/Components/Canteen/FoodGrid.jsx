import { Plus, Minus, Star, Leaf, Flame, Clock } from "lucide-react";

export default function FoodGrid({
  items,
  addToCart,
  removeFromCart,
  getItemQuantity,
}) {
  console.log("quan", items);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const isUnavailable =
            item.isAvailable === false || item.quantityAvailable === 0; // Adjust based on your data key
          const quantity = getItemQuantity(item._id);
          console.log(quantity);

          return (
            <div
              key={item._id}
              className={`relative bg-white rounded-2xl shadow-lg transition overflow-hidden ${
                isUnavailable
                  ? "opacity-75 grayscale-[0.5]"
                  : "hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              {/* Modern Unavailable Overlay Badge */}
              {isUnavailable && (
                <div className="absolute inset-0 z-30 flex items-center justify-center p-4">
                  {/* Background Glass Blur - Only blurs what's behind it */}
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-[3px] z-0" />

                  {/* The Badge */}
                  <div
                    className="
                      relative
                      z-10
                      transform -rotate-12 
                      scale-110
                      bg-white/90 
                      backdrop-blur-xl
                      border-2 border-red-500/30
                      px-6 py-3
                      rounded-2xl
                      shadow-[0_20px_50px_rgba(0,0,0,0.2)]
                      flex flex-col items-center justify-center
                      animate-in fade-in zoom-in duration-300
                     "
                  >
                    {/* Subtle Inner Glow */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/10 to-transparent" />

                    <span
                      className="
                         text-red-600 
                         text-3xl 
                         font-black 
                         uppercase 
                         tracking-[0.15em] 
                         flex items-center gap-3
                        drop-shadow-sm
                        "
                    >
                      <span className="animate-pulse">🚫</span>
                      Sold Out
                    </span>

                    {/* Optional Subtext to make it look professional */}
                    <span className="text-red-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                      Check back later
                    </span>
                  </div>
                </div>
              )}

              {/* Image Section */}
              <div
                className={`relative group overflow-hidden p- flex flex-col items-center justify-center min-h-[300px] transition-all duration-500 rounded-xl ${
                  isUnavailable
                    ? "bg-slate-200 grayscale cursor-not-allowed"
                    : "bg-slate-950 hover:shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)]"
                }`}
              >
                {/* Dynamic Animated Background (Glow) */}
                {!isUnavailable && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute -inset-[100%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#1e40af_50%,#000000_100%)]" />
                  </div>
                )}

                {/* Technical Grid Overlay */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />

                {/* The "Floating" Book Container */}
                <div
                  className={`relative  transition-all duration-500 ease-out transform 
    ${
      !isUnavailable
        ? "group-hover:scale-110 group-hover:-rotate-3 group-hover:translate-y-[-10px]"
        : ""
    }`}
                >
                  {/* Real-time Reflection/Sheen */}
                  {!isUnavailable && (
                    <div className="absolute inset-0  opacity-0 group-hover:opacity-30 transition-opacity group-hover:translate-x-[100%] duration-1000" />
                  )}

                  <img
                    src={item?.image}
                    alt={item.name}
                    className={`w-full h-56 object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)] ${
                      isUnavailable ? "opacity-40" : "opacity-100"
                    }`}
                  />
                </div>

                {/* Border Light (Glow effect on hover) */}
                {!isUnavailable && (
                  <div className="absolute inset-0 border border-blue-500/0 group-hover:border-blue-500/50 rounded-xl transition-colors pointer-events-none" />
                )}
              </div>

              {/* Content Section */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3
                      className={`text-xl font-bold ${
                        isUnavailable ? "text-gray-500" : "text-gray-900"
                      }`}
                    >
                      {item.name}
                    </h3>

                    <div className="flex items-center space-x-2 mt-1">
                      {item.foodType === "veg" && (
                        <span
                          className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                            isUnavailable
                              ? "bg-gray-100 text-gray-400"
                              : "text-green-600 bg-green-50"
                          }`}
                        >
                          <Leaf className="w-3 h-3" />
                          Veg
                        </span>
                      )}
                      {item.foodType === "non-veg" && (
                        <span
                          className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                            isUnavailable
                              ? "bg-gray-100 text-gray-400"
                              : "text-red-600 bg-red-50"
                          }`}
                        >
                          <Flame className="w-3 h-3" />
                          Spicy
                        </span>
                      )}
                    </div>

                    <p
                      title={item.description}
                      className="text-gray-400 text-sm mt-2 line-clamp-2 italic"
                    >
                      {item.description}
                    </p>
                  </div>

                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded ${
                      isUnavailable
                        ? "bg-gray-100 text-gray-400"
                        : "bg-yellow-50 text-gray-900"
                    }`}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        isUnavailable
                          ? "text-gray-300"
                          : "text-yellow-500 fill-current"
                      }`}
                    />
                    <span className="text-sm font-semibold">{item.rating}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full border
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
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <Clock className="w-4 h-4" />
                    <span>{isUnavailable ? "Unavailable" : item.time}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-2xl font-bold ${
                      isUnavailable ? "text-gray-400" : "text-orange-600"
                    }`}
                  >
                    ₹{item.price}
                  </span>

                  {/* Dynamic Footer Button Section */}
                  {getItemQuantity(item._id) === 0 ? (
                    <button
                      onClick={() => addToCart(item)}
                      className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-lg">
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="font-bold text-orange-700">
                        {getItemQuantity(item._id)}
                      </span>

                      <button
                        onClick={() => addToCart(item)}
                        className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
