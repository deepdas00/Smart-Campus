import {
  Plus,
  Minus,
  Star,
  Leaf,
  Flame,
  Clock
} from "lucide-react";

export default function FoodGrid({
  items,
  addToCart,
  removeFromCart,
  getItemQuantity,
}) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden"
          >
            {/* Image */}
            <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-8 flex items-center justify-center">
              <div className="text-8xl">{item.image}</div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {item.name}
                  </h3>

                  <div className="flex items-center space-x-2 mt-1">
                    {item.veg && (
                      <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                        <Leaf className="w-3 h-3" />
                        Veg
                      </span>
                    )}
                    {item.spicy && (
                      <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                        <Flame className="w-3 h-3" />
                        Spicy
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold">
                    {item.rating}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Clock className="w-4 h-4" />
                <span>{item.time}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-orange-600">
                  ₹{item.price}
                </span>

                {getItemQuantity(item.id) === 0 ? (
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
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="font-bold text-orange-700">
                      {getItemQuantity(item.id)}
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
        ))}
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
