import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import RouteLoader from "@/components/Loader";
import "@/styles/globals.css";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";

export default function App({ Component, pageProps }) {
  const [cart, setCart] = useState({});
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState({});
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
      const storedCart = JSON.parse(localStorage.getItem("myCart"));
      if (storedCart) {
        setCart(storedCart);
        computeTotal(storedCart);
      }
    } catch (error) {
      localStorage.removeItem("myCart");
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
        localStorage.removeItem("myUser");
      }
    }
    setKey(Math.random());

    const handleStorageChange = (event) => {
      if (event.key === "myCart") {
        try {
          const storedCart = JSON.parse(event.newValue);
          setCart(storedCart);
          computeTotal(storedCart);
        } catch (error) {
          localStorage.removeItem("myCart");
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [router.query]);

  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_BACKEND_URI,
  });
  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });

  const computeTotal = (cart) => {
    let subt = 0;
    if (!cart) return subt;
    let keys = Object.keys(cart);
    for (let i = 0; i < keys.length; i++) {
      subt += cart[keys[i]].price * cart[keys[i]].qty;
    }
    setTotal(subt);
  };

  const logout = () => {
    localStorage.removeItem("myUser");
    setUser({});
    setKey(Math.random());
    router.push(process.env.NEXT_PUBLIC_HOST);
  };

  const saveCart = (cart) => {
    localStorage.setItem("myCart", JSON.stringify(cart));
    computeTotal(cart);
  };

  const addtoCart = (itemId, name, qty, price) => {
    if (Object.keys(cart).length === 0) {
      setKey(Math.random());
    }
    const newCart = { ...cart };
    if (itemId in cart) {
      newCart[itemId].qty += qty;
    } else {
      newCart[itemId] = { name, qty: qty, price };
    }
    setCart(newCart);
    saveCart(newCart);
  };

  const removefromCart = (itemId, qty) => {
    if (!cart) return;
    const newCart = { ...cart };
    if (itemId in cart) {
      newCart[itemId].qty -= qty;
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

  return (
    <>
      <LoadingBar
        color="#FFFF00"
        progress={progress}
        waitingTime={300}
        onLoaderFinished={() => setProgress(0)}
      />
      <RouteLoader />
      <ToastContainer
        position="top-left"
        limit={1}
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
      <ApolloProvider client={client}>
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
          user={user}
          cart={cart}
          addtoCart={addtoCart}
          removefromCart={removefromCart}
          clearCart={clearCart}
          total={total}
          {...pageProps}
        />
      </ApolloProvider>
      <Footer />
    </>
  );
}
