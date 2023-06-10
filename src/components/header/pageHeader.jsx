import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const PageHeader = () => {
  const [locationParts, setLocationParts] = useState({
    main: "Launchpad",
    sub: "SWAP",
  });
  const { pathname } = useLocation();

  useEffect(() => {
    switch (pathname) {
      case "/":
        setLocationParts({
          main: "DEX",
          sub: "Swap",
        });
        break;
      case "/liquidity":
        setLocationParts({
          main: "DEX",
          sub: "Liquidity",
        });
        break;

      default:
        setLocationParts({
          main: "DEX",
          sub: "Swap",
        });
        break;
    }
  }, [pathname]);

  return (
    <div className=" flex items-center justify-center   mx-auto pt-6 flex-wrap gap-6 sm:justify-between  relative z-[7] w-11/12">
      <div className="flex items-center gap-2 text-text font-kanitLight text-base">
        <p>{locationParts.main}</p>
        <span>/</span>
        <p className="text-textAccent font-semibold">
          {locationParts.sub.toUpperCase()}
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
