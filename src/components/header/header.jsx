import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/img/logo.png";

import { useEffect, useLayoutEffect, useState } from "react";
import swapIcon from "../../assets/img/swap.png";
import liquidityIcon from "../../assets/img/liquidity.png";
import { Web3Button } from "@web3modal/react";
import { BiMenu } from "react-icons/bi";

const Header = () => {
  const [collapse, setCollapse] = useState(true);

  const location = useLocation();

  useEffect(() => {
    setCollapse(false);
  }, [location]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setCollapse(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  useEffect(() => {
    if (collapse) {
      window.scrollTo(0, 0);
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [collapse]);

  return (
    <div>
      <div
        className={` relative z-50 bg-pageBackground  mb-4  flex  border-b border-border `}
      >
        <div className="pl-5 self-center md:py-0 py-5 md:block flex items-center justify-between md:w-auto w-full md:pr-0 pr-8">
          <Link to="/" className="my-[5px] px-2 w-full block">
            <img src={logo} alt="dex logo" className="max-h-[50px] " />
          </Link>
          <div>
            <BiMenu
              className="text-3xl cursor-pointer fill-white md:hidden block"
              onClick={() => setCollapse(!collapse)}
            />
          </div>
        </div>
        <div
          className={`flex w-full px-8  md:pt-0 pt-8 md:items-center md:relative fixed md:flex-row md:min-h-0 min-h-[100vh] flex-col md:pb-0 pb-12 md:top-0 top-24 md:bg-transparent bg-pageBackground md:left-0 transition-all ease-in-out duration-200 ${
            collapse ? "left-0" : "-left-[150%]"
          } `}
        >
          <Link
            to={"/"}
            className="h-full flex items-center px-4 md:py-8 py-4 transition-all duration-200 ease-in-out hover:bg-linkHover border border-transparent hover:border-linkHoverBorder text-link"
          >
            <img
              src={swapIcon}
              alt=""
              className="inline-block w-5 object-contain h-5 mr-2"
            />
            Swap
          </Link>
          <Link
            to={"/liquidity"}
            className="h-full flex items-center px-4 md:py-8 py-4 transition-all duration-200 ease-in-out hover:bg-linkHover border border-transparent hover:border-linkHoverBorder text-link"
          >
            <img
              src={liquidityIcon}
              alt=""
              className="inline-block w-5 object-contain h-5 mr-2"
            />
            Liquidity
          </Link>
          <div className="md:ml-auto md:mt-0 mt-8 w-max ">
            <Web3Button balance="show" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
