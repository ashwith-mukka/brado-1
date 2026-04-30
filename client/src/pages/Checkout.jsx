import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, shippingAddress, saveShippingAddress, clearCart, itemsPrice, shippingPrice, taxPrice, totalPrice } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: shippingAddress.fullName || user?.name || '',
    phone: shippingAddress.phone || '',
    address: shippingAddress.address || '',
    city: shippingAddress.city || '',
    state: shippingAddress.state || '',
    pincode: shippingAddress.pincode || '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [user, cartItems, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    saveShippingAddress(formData);

    const res = await loadRazorpay();

    if (!res) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // 1. Create order on backend
      const { data: orderResponse } = await axios.post('/payment/order', {
        amount: totalPrice,
      }, config);


      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: 'Brado Store',

        description: 'Payment for your order',
        image: 'https://img.icons8.com/color/96/shopping-cart.png',
        order_id: orderResponse.id,
        handler: async (response) => {
          try {
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: {
                orderItems: cartItems,
                shippingAddress: formData,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
              }
            };

            const { data: verifyRes } = await axios.post('/payment/verify', verifyData, {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });

            
            if (verifyRes.order) {
              clearCart();
              toast.success('Payment successful! Order placed.');
              navigate(`/order-success/${verifyRes.order._id}`);
            }
          } catch (err) {
            console.error('Verification Error:', err);
            toast.error(err.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: formData.fullName,
          email: user.email,
          contact: formData.phone,
        },
        notes: {
          address: formData.address,
        },
        theme: {
          color: '#16a34a',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
      paymentObject.on('payment.failed', function (response) {
        toast.error('Payment failed: ' + response.error.description);
      });

    } catch (error) {
      const message = error.response?.data?.message || error.message;
      console.error('Detailed Payment Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      if (error.response?.status === 401) {
        toast.error('Session expired. Please log out and login again.');
      } else {
        toast.error(`Payment Error: ${message}`);
      }
    } finally {
      setLoading(false);
    }


  };

  return (
    <div className="py-12">
      <h1 className="text-4xl font-black text-gray-900 mb-10 tracking-tight">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Shipping Form */}
        <div className="lg:col-span-8">
          <form onSubmit={submitHandler} id="checkout-form" className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-gray-900">Shipping Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="400001"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Street Address</label>
                <textarea
                  name="address"
                  required
                  rows="3"
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all resize-none"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Flat No, Building, Street Name"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Maharashtra"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-gray-900 rounded-3xl p-8 sticky top-24 shadow-2xl shadow-gray-200 text-white">
            <h2 className="text-2xl font-black mb-8">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              {cartItems.map(item => (
                <div key={item.product} className="flex justify-between text-sm">
                  <span className="text-gray-400 line-clamp-1 flex-1 pr-4">{item.name} x {item.qty}</span>
                  <span className="font-bold">₹{(item.qty * item.price).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-8 pt-6 border-t border-gray-800">
              <div className="flex justify-between text-gray-400 font-medium">
                <span>Items Total</span>
                <span className="text-white">₹{itemsPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-medium">
                <span>Shipping</span>
                <span className="text-white">₹{shippingPrice}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-medium">
                <span>Tax (5%)</span>
                <span className="text-white">₹{taxPrice}</span>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-6 mb-10">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-400 font-medium">Grand Total</p>
                  <p className="text-3xl font-black text-white">₹{totalPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className={`w-full font-black py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-green-900/20 flex items-center justify-center gap-3 ${
                loading ? 'bg-green-800 cursor-wait' : 'bg-green-600 hover:bg-green-500 active:scale-95'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  Pay with Razorpay
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
            
            <div className="mt-8 flex items-center justify-center gap-4 opacity-50 grayscale">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-4" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

