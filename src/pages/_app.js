import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloProvider,
} from "@apollo/client";

export default function App({ Component, pageProps }) {
  const [cart, setCart] = useState({});
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState({ value: null });
  const [key, setKey] = useState();
  const router = useRouter();

  const [progress, setProgress] = useState(0);

  const client = new ApolloClient({
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_BACKEND_URI,
    }),
    cache: new InMemoryCache(),
  });
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

    const token = JSON.parse(localStorage.getItem("myUser"));
    if (token) {
      try {
        const decodedToken = jwt.verify(
          token,
          process.env.NEXT_PUBLIC_JWT_SECRET
        );
        setUser(decodedToken);
      } catch (error) {
        console.error("Error decoding JWT token:", error);
        localStorage.removeItem("myUser");
      }
    }
    setKey(Math.random());
  }, [router.query]);

  const logout = () => {
    localStorage.removeItem("myUser");
    setUser({ value: null });
    setKey(Math.random());
    router.push(process.env.NEXT_PUBLIC_HOST);
  };
  const saveCart = ({ myCart }) => {
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
    if (user.email) {
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
      <ApolloProvider client={client}>
        <Component
          cart={cart}
          addtoCart={addtoCart}
          removefromCart={removefromCart}
          clearCart={clearCart}
          total={total}
          buyNow={buyNow}
          {...pageProps}
        />
      </ApolloProvider>
      <Footer />
    </>
  );
}
