import { useEffect, useState } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";
import { BiChevronDown } from "react-icons/bi";

const Select = ({ options, defaultValue, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(false);

  useEffect(() => {
    let match = options.find((option) => option.value === defaultValue);
    if (match) {
      setValue(match);
    } else {
      setValue(options[0]);
    }
  }, [defaultValue, options]);

  const outsideClickRef = useOutsideClick(() => {
    setIsOpen(false);
  });

  return (
    <div ref={outsideClickRef} className="relative xs:w-auto w-full">
      <div
        className="px-4 py-3 rounded-md bg-buttons  min-w-[136px] flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p>{value}</p>
        <BiChevronDown
          className={`w-5 h-5 transition-all duration-300 ease-in-out text-text ${
            isOpen && "rotate-180"
          }`}
        />
      </div>
      <div
        className={`absolute top-full z-50 bg-buttons border  rounded-md w-full left-0 transition-all ease-in-out duration-200 overflow-hidden ${
          isOpen
            ? "max-h-[420px] border-gray-400"
            : "max-h-0 border-transparent invisible"
        }`}
      >
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => {
              setValue(option);
              setIsOpen(false);
            }}
            className="px-3 py-2 bg-buttons hover:bg-buttonsHover relative"
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Select;
