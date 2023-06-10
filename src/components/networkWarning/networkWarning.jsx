import { ReactComponent as WarningIcon } from "../../assets/img/warning.svg";

const NetworkWarning = ({ switchChain = () => {} }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-[1000]">
      <div className="absolute top-0 left-0 w-full h-full bg-pageBackground opacity-60 shadow-box"></div>
      <div className="mx-auto w-4/5 rounded-xl bg-gradientBlue max-w-[560px] mt-16 relative z-[1001] p-px">
        <div className=" sm:px-12 px-6 pt-8  pb-12 shadow-box h-max rounded-xl bg-gradientContainer text-center">
          <WarningIcon className="w-16 h-16 mx-auto " />
          <h3 className="text-2xl text-white font-semibold mt-3">
            Oops, looks like you're on the wrong network.
          </h3>
          <p className="text-white mt-2">
            <span className="opacity-50">Please switch to </span>
            <span className="font-semibold">Sepolia network</span>
            <span className="opacity-50"> to use this website.</span>
          </p>
          <button
            onClick={(e) => switchChain(e)}
            className="bg-gradientBlue text-black text-lg cursor-pointer sm:px-12 px-8 py-3 rounded-full mt-8 font-semibold"
          >
            Switch networks
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkWarning;
