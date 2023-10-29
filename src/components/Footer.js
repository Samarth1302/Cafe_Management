import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Footer = () => {
  const router = useRouter();
  const [foot, setFoot] = useState(true);

  useEffect(() => {
    let nonFoot = ["/login", "/signup"];
    if (nonFoot.includes(router.pathname)) {
      setFoot(false);
    }
  }, []);

  return (
    <>
      {foot && (
        <div className="flex flex-col md:flex-row md:justify-start justify-center items-center py-2 shadow-md sticky top-0 z-10 pb-6 bg-slate-400"></div>
      )}
    </>
  );
};

export default Footer;
