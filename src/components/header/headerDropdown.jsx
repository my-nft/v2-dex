import { useState } from "react";
import { Link } from "react-router-dom";
import useOutsideClick from "../../hooks/useOutsideClick";
import { GoTriangleDown } from "react-icons/go";

const HeaderDropdown = ({
  title,
  options = [],
  isSelfLink = false,
  linkPath = "",
}) => {
  const [open, setOpen] = useState(false);

  const outsideClickRef = useOutsideClick(() => setOpen(false));

  return (
    <div
      ref={outsideClickRef}
      onClick={() => setOpen(!open)}
      className="text-white relative  mxl:hover:bg-accentHover cursor-pointer py-4 mxl:h-full px-8 mxl:w-auto w-full "
    >
      {isSelfLink ? (
        <Link
          to={linkPath}
          className="flex items-center justify-center mxl:h-full"
        >
          <p>{title}</p>
        </Link>
      ) : (
        <div className="flex items-center justify-center mxl:h-full">
          <p>{title}</p>
          {options.length > 0 && (
            <GoTriangleDown
              className={`ml-3 transition-all duration-200 ease-in-out ${
                open && "rotate-180"
              }`}
            />
          )}
        </div>
      )}
      <div
        className={`mxl:absolute relative left-0 overflow-hidden bg-container z-30 mxl:top-full w-full mxl:w-[160px]  transition-all duration-200 ease-in-out mxl:text-start text-center ${
          open ? "max-h-[320px]" : "max-h-0"
        }`}
      >
        {options.map((option, index) => (
          <div
            className="px-4 py-4 font-kanitExtraLight text-xs text-text bg-accent hover:bg-accentHover w-full"
            key={index}
          >
            <Link to={`${option.link}`}>
              <p>{option.text}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeaderDropdown;
