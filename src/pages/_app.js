import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  const [cart, setCart] = useState({});
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState({ value: null });
  const [key, setKey] = useState();
  const router = useRouter();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setProgress(40);
    });
    router.events.on("routeChangeComplete", () => {
      setProgress(100);
    });
    try {
      if (localStorage.getItem("cart")) {
        setCart(JSON.parse(localStorage.getItem("cart")));
        saveCart(JSON.parse(localStorage.getItem("cart")));
      }
    } catch (error) {
      console.error(error);
      localStorage.clear();
    }
    const myUser = JSON.parse(localStorage.getItem("myUser"));
    if (myUser) {
      setUser({ value: myUser.token, email: myUser.email });
    }
    setKey(Math.random());
  }, [router.query]);

  const logout = () => {
    localStorage.removeItem("myUser");
    setUser({ value: null });
    setKey(Math.random());
    router.push("/");
  };
  const saveCart = (myCart) => {
    localStorage.setItem("cart", JSON.stringify(myCart));
    let subt = 0;
    let keys = Object.keys(myCart);
    for (let i = 0; i < keys.length; i++) {
      subt += myCart[keys[i]].price * myCart[keys[i]].qty;
    }
    setTotal(subt);
  };

  const addtoCart = (itemId, qty, price, iName) => {
    if (Object.keys(cart).length == 0) {
      setKey(Math.random());
    }
    let newCart = cart;
    if (itemId in cart) {
      newCart[itemId].qty += 1;
    } else {
      newCart[itemId] = { qty: 1, price, iName, size, type };
    }
    setCart(newCart);
    saveCart(newCart);
  };

  const removefromCart = (itemId, qty, price, iName) => {
    let newCart = cart;
    if (itemId in cart) {
      newCart[itemId].qty -= 1;
    }
    if (newCart[itemId].qty <= 0) {
      delete newCart[itemId];
    }
    setCart(newCart);
    saveCart(newCart);
  };

  const clearCart = () => {
    setCart({});
    saveCart({});
  };

  const buyNow = (itemId, qty, price, iName) => {
    let newCart = {};
    newCart[itemId] = { qty: 1, price, iName };
    setCart(newCart);
    saveCart(newCart);
    if (user.value) {
      router.push("/checkout");
    } else {
      toast.error("Please Login to buy a product", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  return (
    <>
      <LoadingBar
        color="#FFFF00"
        progress={progress}
        waitingTime={300}
        onLoaderFinished={() => setProgress(0)}
      />
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {key && (
        <Navbar
          user={user}
          key={key}
          cart={cart}
          addtoCart={addtoCart}
          removefromCart={removefromCart}
          clearCart={clearCart}
          total={total}
          logout={logout}
        />
      )}
      <Component
        cart={cart}
        addtoCart={addtoCart}
        removefromCart={removefromCart}
        clearCart={clearCart}
        total={total}
        buyNow={buyNow}
        {...pageProps}
      />
      <Footer />
    </>
  );
}
