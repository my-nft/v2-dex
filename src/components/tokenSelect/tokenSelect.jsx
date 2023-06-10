import { BsFilterCircle } from "react-icons/bs";
import { GoTriangleDown } from "react-icons/go";
import { IoClose } from "react-icons/io5";

const TokenSelectInput = ({
  tokenSelected,
  onTokenOpen,
  onTokenRemove,
  label = "From",
}) => {
  return (
    <div className="flex items-center sm:flex-row flex-col gap-3 min-w-[128px] ">
      {tokenSelected && (
        <div className="flex  gap-3 cursor-pointer w-full relative">
          <div
            className="flex items-center flex-row gap-3 w-full grow "
            onClick={() => {
              onTokenOpen();
            }}
          >
            <img
              src={tokenSelected.image}
              className="w-10 h-10 rounded-full"
              alt=""
            />
            <div className="flex flex-col gap-1 grow">
              <p className="font-kanitLight text-textAccent text-xs ">
                {label}
              </p>
              <p className="font-kanitLight text-white text-sm flex items-center justify-between gap-2 ">
                {tokenSelected.symbol.toUpperCase()}
                <span>
                  <GoTriangleDown />
                </span>
              </p>
            </div>
          </div>
          <IoClose
            className="text-white ml-1 absolute right-0 top-0"
            onClick={() => onTokenRemove()}
          />
        </div>
      )}
      {!tokenSelected && (
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onTokenOpen()}
        >
          <BsFilterCircle className="inline-block w-8 h-8  text-text" />
          <p className="font-kanitLight text-textAccent text-sm ">Select</p>
        </div>
      )}
    </div>
  );
};

export default TokenSelectInput;
