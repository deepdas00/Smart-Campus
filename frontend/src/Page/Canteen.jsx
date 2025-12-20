import React, { useState } from "react";
import {
  AlertCircle,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Check,
  Clock,
  ChefHat,
  Search,
  Filter,
  Star,
  Leaf,
  Flame,
  Award,
} from "lucide-react";
import CollegeInfo from "../Components/CollegeInfo";
import logo from "../assets/logo.png";
import profile from "../assets/profile.png";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";
import ProfileSidebar from "../Components/ProfileSidebar";
import FoodGrid from "../Components/Canteen/FoodGrid";
import SearchAndCategory from "../Components/Canteen/SearchAndCategory";

export default function Canteen() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderReceived, setOrderReceived] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Items", icon: "🍽️" },
    { id: "breakfast", name: "Breakfast", icon: "🌅" },
    { id: "lunch", name: "Lunch", icon: "🍛" },
    { id: "snacks", name: "Snacks", icon: "🍟" },
    { id: "beverages", name: "Beverages", icon: "☕" },
    { id: "desserts", name: "Desserts", icon: "🍰" },
  ];

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const menuItems = [
    {
      id: 1,
      name: "Masala Dosa",
      price: 60,
      category: "breakfast",
      rating: 4.5,
      image: "🥞",
      veg: true,
      spicy: true,
      time: "15 min",
    },
    {
      id: 2,
      name: "Idli Sambar",
      price: 40,
      category: "breakfast",
      rating: 4.3,
      image: "🍚",
      veg: true,
      spicy: false,
      time: "10 min",
    },
    {
      id: 3,
      name: "Poha",
      price: 35,
      category: "breakfast",
      rating: 4.0,
      image: "🍛",
      veg: true,
      spicy: true,
      time: "10 min",
    },
    {
      id: 4,
      name: "Veg Thali",
      price: 120,
      category: "lunch",
      rating: 4.7,
      image: "🍱",
      veg: true,
      spicy: false,
      time: "20 min",
    },
    {
      id: 5,
      name: "Paneer Butter Masala",
      price: 140,
      category: "lunch",
      rating: 4.6,
      image: "🍛",
      veg: true,
      spicy: true,
      time: "25 min",
    },
    {
      id: 6,
      name: "Chole Bhature",
      price: 80,
      category: "lunch",
      rating: 4.4,
      image: "🫓",
      veg: true,
      spicy: true,
      time: "15 min",
    },
    {
      id: 7,
      name: "Samosa",
      price: 20,
      category: "snacks",
      rating: 4.2,
      image: "🥟",
      veg: true,
      spicy: true,
      time: "5 min",
    },
    {
      id: 8,
      name: "Vada Pav",
      price: 25,
      category: "snacks",
      rating: 4.1,
      image: "🍔",
      veg: true,
      spicy: true,
      time: "5 min",
    },
    {
      id: 9,
      name: "Pav Bhaji",
      price: 70,
      category: "snacks",
      rating: 4.5,
      image: "🍲",
      veg: true,
      spicy: true,
      time: "15 min",
    },
    {
      id: 10,
      name: "Masala Chai",
      price: 15,
      category: "beverages",
      rating: 4.6,
      image: "☕",
      veg: true,
      spicy: false,
      time: "5 min",
    },
    {
      id: 11,
      name: "Cold Coffee",
      price: 50,
      category: "beverages",
      rating: 4.4,
      image: "🧋",
      veg: true,
      spicy: false,
      time: "5 min",
    },
    {
      id: 12,
      name: "Fresh Juice",
      price: 40,
      category: "beverages",
      rating: 4.3,
      image: "🥤",
      veg: true,
      spicy: false,
      time: "5 min",
    },
    {
      id: 13,
      name: "Gulab Jamun",
      price: 30,
      category: "desserts",
      rating: 4.5,
      image: "🍡",
      veg: true,
      spicy: false,
      time: "2 min",
    },
    {
      id: 14,
      name: "Ice Cream",
      price: 40,
      category: "desserts",
      rating: 4.4,
      image: "🍨",
      veg: true,
      spicy: false,
      time: "2 min",
    },
  ];

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const existingItem = cart.find((cartItem) => cartItem.id === itemId);
    if (existingItem.quantity === 1) {
      setCart(cart.filter((cartItem) => cartItem.id !== itemId));
    } else {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    }
  };

  const getItemQuantity = (id) => {
    const item = cart.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const placeOrder = () => {
    const order = {
      id: `ORD${Date.now().toString().slice(-6)}`,
      items: cart,
      total: getTotalPrice(),
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      qrCode: `QR${Date.now().toString().slice(-8)}`,
    };
    setOrderDetails(order);
    setOrderPlaced(true);
    setCart([]);
    setShowCart(false);
  };

  const simulateQRScan = () => {
    setOrderReceived(true);
    setTimeout(() => {
      setOrderReceived(false);
      setOrderPlaced(false);
      setOrderDetails(null);
    }, 5000);
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to={"/"} className="flex items-center space-x-2">
                <img
                  src={logo}
                  alt="Smart Campus Logo"
                  className="w-13.5 h-13.5 rounded-full object-cover bg-white/60 backdrop-blur border border-white/40 shadow"
                />
                <span className="text-xl font-bold bg-blue-700  bg-clip-text text-transparent">
                  Smart Campus
                </span>
              </Link>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-gray-700 pt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Open</span>
                <span className="text-gray-400">|</span>
                <span>7 AM – 9 PM</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCart(true)}
                className="relative px-4 py-2 bg-blue-600 text-white rounded-lg hover:shadow-lg transition flex items-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline">Cart</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-blue-900 text-white rounded-full text-xs flex items-center justify-center font-bold">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              <span className="text-gray-600 hidden sm:inline cursor-pointer hover:text-blue-500">
                Logout
              </span>
              <Link className="flex items-center space-x-2">
                <img
                  src={profile}
                  alt="Profile"
                  onClick={() => setShowProfileMenu(true)}
                  className="w-13.5 h-13.5 rounded-full object-cover bg-white/60 backdrop-blur border border-white/40 shadow"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Profile side menu bar */}
      <ProfileSidebar
        isOpen={showProfileMenu}
        onClose={() => setShowProfileMenu(false)}
      />

      {/*Banner*/}
      <CollegeInfo />

      {/* Success Message */}
      {orderReceived && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-bounce">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Order Received!
            </h2>
            <p className="text-gray-600 mb-4">
              Your food is being prepared. Please collect from the counter.
            </p>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold">
                Token: {orderDetails?.id}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order Success & QR Code */}
      {orderPlaced && !orderReceived && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Order Placed!</h2>
                <button
                  onClick={() => setOrderPlaced(false)}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-orange-100 mt-2">
                Show this QR code at the counter
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-br from-gray-100 to-white rounded-xl p-6 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="text-6xl mb-4">📱</div>
                  <div className="bg-white p-4 rounded-lg shadow-inner mb-4">
                    <div className="text-4xl font-bold text-gray-800">
                      {orderDetails?.qrCode}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    QR Code for Order #{orderDetails?.id}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-semibold">{orderDetails?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-semibold">{orderDetails?.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-semibold">
                    {orderDetails?.items.length}
                  </span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-gray-200">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-orange-600">
                    ₹{orderDetails?.total}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {orderDetails?.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-sm text-gray-600"
                  >
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={simulateQRScan}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg transition"
              >
                Simulate QR Scan (Demo)
              </button>

              <p className="text-xs text-center text-gray-500">
                Estimated preparation time: 15-20 minutes
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
            <div className="flex flex-col h-full">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Your Cart</h2>
                  <button
                    onClick={() => setShowCart(false)}
                    className="text-white hover:bg-white/20 rounded-full p-2 transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-orange-100 mt-2">{getTotalItems()} items</p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🛒</div>
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 rounded-xl p-4 flex items-center space-x-4"
                    >
                      <div className="text-4xl">{item.image}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-orange-600 font-bold">
                          ₹{item.price}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-gray-200 p-6 space-y-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Subtotal:</span>
                    <span className="font-bold">₹{getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>GST (5%):</span>
                    <span>₹{Math.round(getTotalPrice() * 0.05)}</span>
                  </div>
                  <div className="flex justify-between text-xl border-t border-gray-200 pt-4">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-orange-600">
                      ₹{getTotalPrice() + Math.round(getTotalPrice() * 0.05)}
                    </span>
                  </div>
                  <button
                    onClick={placeOrder}
                    className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg font-semibold hover:shadow-xl transition"
                  >
                    Place Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter */}
        <SearchAndCategory
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Menu Items Grid */}
        <FoodGrid
          items={filteredItems}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          getItemQuantity={getItemQuantity}
        />

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">
              No items found matching your search
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
