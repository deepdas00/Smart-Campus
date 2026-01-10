import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
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
// import CollegeInfo from "../Components/CollegeInfo";
import logo from "../assets/logo.png";
import profile from "../assets/profile.png";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";
import ProfileSidebar from "../Components/ProfileSidebar";
import FoodGrid from "../Components/Canteen/FoodGrid";
import SearchAndCategory from "../Components/Canteen/SearchAndCategory";
import Navbar from "../Components/Navbar/Navbar";
import { Toaster } from "react-hot-toast";

export default function Canteen() {
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderReceived, setOrderReceived] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [qrCodeForDetails, setQrCodeForDetails] = useState(null);
  const [razorpayPaymentId, setRazorpayPaymentId] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [transactionCode, setTransactionCode] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isCanteenOpen, setIsCanteenOpen] = useState(null); // null = loading
  const [quantity, setQuantity] = useState(null); // null = loading
  const categories = [
    // "snacks", "meal", "drink", "sweet"
    { id: "all", name: "All Items", icon: "🍽️" },
    { id: "meal", name: "meal", icon: "🍛" },
    { id: "snacks", name: "Snacks", icon: "🍟" },
    { id: "drink", name: "drink", icon: "☕" },
    { id: "sweet", name: "sweet", icon: "🍰" },
  ];

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;




  const fetchCanteenStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/canteen/canteenStatus`, {
          withCredentials: true,
        });

     

        // assuming backend returns { data: { isActive: true/false } }
        setIsCanteenOpen(res.data?.data);

      
      } catch (err) {
        console.error("Failed to fetch canteen status", err);
        setIsCanteenOpen(false); // safest fallback
      }
    };

    const [canteenPolicy, setCanteenPolicy] = useState(null);

const fetchCanteenPolicy = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/v1/canteen/fetchpolicy`, {
        withCredentials: true,
      });
 
      setCanteenPolicy(res.data?.data || ""); // default to 5 if not provided
    } catch (err) {
      console.error("Failed to fetch canteen policy", err);
      setCanteenPolicy(""); // safest fallback
    }
  };


  useEffect(() => {
    
    fetchCanteenStatus();
    fetchCanteenPolicy();

    const intervalId = setInterval(fetchCanteenStatus, 5 * 60 * 1000);

    // 🧹 Cleanup
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API_URL}/api/v1/canteen/foods`,
          { withCredentials: true } // if auth cookies are used
        );

        setMenuItems(res.data.data.foods); // adjust if response structure differs
      } catch (err) {
        setError("Failed to load food menu");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const addToCart = (item) => {
    if (!isCanteenOpen) {
      toast.error("Canteen is currently closed");
      return;
    }
    setCart((prev) => ({
      ...prev,
      [item._id]: {
        ...item,
        quantity: (prev[item._id]?.quantity || 0) + 1,
      },
    }));
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      if (!prev[id]) return prev;

      const newQty = prev[id].quantity - 1;

      if (newQty <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [id]: { ...prev[id], quantity: newQty },
      };
    });
  };

  const orderItemsNow = Object.values(cart).map((item) => ({
    foodId: item._id,
    quantity: item.quantity,
  }));

  const getItemQuantity = (itemId) => cart[itemId]?.quantity || 0;

  // Helper to calculate total items in cart
  const getTotalItems = () => {
    return Object.values(cart).reduce(
      (total, item) => total + item.quantity,
      0
    );
  };

  const getTotalPrice = () => {
    return Object.values(cart).reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const placeOrder = async () => {


    
      fetchCanteenStatus()


      
    if (!isCanteenOpen) {
      toast.error("Canteen is currently closed");
    
      return;
    }

    try {
      if (Object.keys(cart).length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      toast.loading("Placing your order...", { id: "place-order" });

      const items = Object.values(cart).map((item) => ({
        foodId: item._id,
        quantity: item.quantity,
      }));



      const res = await axios.post(
        `${API_URL}/api/v1/canteen/orders`,
        { items },
        { withCredentials: true }
      );

    

      toast.success("Order created! Redirecting to payment…", {
        id: "place-order",
      });

      const { orderId } = res.data.data;

      await startPayment(orderId);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to place order", {
        id: "place-order",
      });
    }
    finally {
  isCanteenOpen(null); // still runs
}

  };

  const startPayment = async (orderId) => {
    const res = await axios.post(
      `${API_URL}/api/v1/canteen/orders/${orderId}/pay`,
      {},
      { withCredentials: true }
    );

    const { razorpayOrderId, amount, currency, key } = res.data.data;

    openRazorpay({
      razorpayOrderId,
      amount,
      currency,
      key,
      orderId,
    });
  };

  const openRazorpay = ({ razorpayOrderId, amount, currency, key }) => {
    const options = {
      key,
      amount,
      currency,
      order_id: razorpayOrderId,
      name: "College Canteen",
      description: "Food Order Payment",

      handler: async (response) => {
        await verifyPayment(response);
        setCart({});
        setShowCart(false);
        setOrderPlaced(true);
      },

      theme: { color: "#16a34a" },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", () => {
      toast.error("Payment failed");
    });

    rzp.open();
  };

  const verifyPayment = async (response) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      response;

    

    const res = await axios.post(
      `${API_URL}/api/v1/canteen/orders/verify-payment`,
      {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
      { withCredentials: true }
    );

   

    const {
      qrCode,
      razorpayPaymentId,
      orderId,
      transactionCode,
      orderStatus,
      paymentStatus,
      items,
      totalAmount,
      createdAt,
    } = res.data.data;

    setQrCodeForDetails(qrCode);
    setRazorpayPaymentId(razorpayPaymentId);
    setOrderId(orderId);
    setTransactionCode(transactionCode)
    setOrderStatus(orderStatus);
    setPaymentStatus(paymentStatus);

    // ✅ THIS WAS MISSING
    setOrderDetails({
      items,
      total: totalAmount,
      time: new Date(createdAt).toLocaleTimeString(),
    });

  

    setCart({});
    setShowCart(false);
    setOrderPlaced(true);

    toast.success("Payment successful!");
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
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Header */}
      <Navbar
        onCartClick={() => setShowCart(true)}
        cartCount={getTotalItems()}
      />

      <Toaster position="top-right" />

      {/* Profile side menu bar */}
      <ProfileSidebar
        isOpen={showProfileMenu}
        onClose={() => setShowProfileMenu(false)}
      />

      {/*Banner*/}
      {/* <CollegeInfo /> */}

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
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full ">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3">
              <div className="flex items-center justify-between ">
                <h2 className="text-2xl font-bold">Order Placed!</h2>
                <button
                  onClick={() => setOrderPlaced(false)}
                  className="text-white hover:bg-white/20 rounded-full p-1 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-orange-100">
                Show this QR code at the counter
              </p>
            </div>

            <div className="px-6 py-3 space-y-4">
              <div className="bg-gradient-to-br from-gray-100 to-white rounded-xl p-6 py-2 border-2 border-dashed border-gray-300 bg">
                <div className="text-center">
                  {qrCodeForDetails && (
                    <img
                      src={qrCodeForDetails}
                      alt="Order QR Code"
                      className="w-56 h-56 mx-auto rounded-xl border-4 border-green-500 shadow-lg"
                    />
                  )}

                  <div className=" px-2 pt-2 rounded-lg  mb-2">
                    <div
                      className={`text-2xl font-bold ${
                        paymentStatus === "paid"
                          ? "text-green-800"
                          : paymentStatus === "failed"
                          ? "text-red-700"
                          : "text-orange-600"
                      }`}
                    >
                      {paymentStatus?.toUpperCase()}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    QR Code for Order #{orderId}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 py-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-semibold">{transactionCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Status:</span>
                  <span className="font-semibold">{orderStatus === "order_receive" ? "Order Placed" : orderStatus}
</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-semibold">{orderDetails?.time}</span>
                </div>
                

                <div className="flex justify-between text-lg pt-2 border-t border-gray-200">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-orange-600">
                    ₹{orderDetails?.total}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {Object.values(orderDetails?.items || {}).map((item, idx) => (
                  <div
                    key={item._id || idx}
                    className="flex justify-between text-sm text-gray-600"
                  >
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-center text-gray-500 md:mt mt-[-3px]">
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
              {/* Header */}
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

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {Object.keys(cart).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🛒</div>
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  Object.entries(cart).map(([id, item]) => (
                    <div
                      key={id}
                      className="bg-gray-50 rounded-xl p-4 flex items-center space-x-4"
                    >
                      <div className="text-4xl">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl"
                        />
                      </div>
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
                          onClick={() => removeFromCart(id)}
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

              {/* Cart Totals */}
              {Object.keys(cart).length > 0 && (
                <div className="border-t border-gray-200 p-6 space-y-4">
                  <div className="flex justify-between text-xl border-t border-gray-200 pt-4">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-orange-600">
                      ₹{getTotalPrice()}
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
        <div className="flex justify-between items-center w-full px-5 pb-4">
          <div className="">
            <div className="flex items-center gap-2 text-xs text-gray-700 pt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Open</span>
              <span className="text-gray-400">|</span>
              <span>{canteenPolicy?.openingTime}  –  {canteenPolicy?.closingTime}</span>
            </div>
          </div>

          {/* <div className="flex items-center space-x-4">
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
          </div> */}
        </div>

        <SearchAndCategory
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <div className="relative">
          {/* 🔵 CLOSED OVERLAY */}
          {isCanteenOpen === false && (
            <div className="absolute inset-0 z-20 bg-blue-900/40 backdrop-blur-sm flex items-center justify-center rounded-xl">
              <div className="text-center text-white px-6">
                <AlertCircle className="w-12 h-12 mx-auto mb-3" />
                <h2 className="text-xl font-bold">Canteen Closed</h2>
                <p className="text-sm text-blue-100">
                  Please come back during working hours
                </p>
              </div>
            </div>
          )}

          {/* Menu Items Grid */}
          <FoodGrid
            items={filteredItems}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            getItemQuantity={getItemQuantity}
          />
        </div>
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
