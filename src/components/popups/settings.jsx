import { MdClose } from "react-icons/md";

const SettingsPopup = ({ shouldShow, closePopup = () => {} }) => {
  return (
    <div
      className={`fixed left-0 top-0 h-screen w-full transition-all duration-300 ease-in-out ${
        shouldShow ? "z-50 opacity-100" : "-z-10 opacity-0"
      }`}
    >
      <div
        className={`absolute z-[51] top-20 left-1/2 -translate-x-1/2  transition-all delay-150 duration-200 ease-in-out bg-pageBackground rounded-lg max-w-[500px] w-4/5 ${
          shouldShow ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white mb-8">
          <p className="font-kanitLight text-white text-xl">SETTING (Soon)</p>
          <MdClose
            className="w-6 h-6 text-text cursor-pointer"
            onClick={() => closePopup()}
          />
        </div>
        <div className="font-kanitLight text-text p-6 flex flex-col gap-5">
          <div>
            <p className="text-sm mb-2">Slippage(%)</p>
            <input
              type="number"
              disabled
              placeholder={process.env.REACT_APP_SLIPPAGE}
              className=" text-white  text-lg w-full outline-none py-2 pl-6 pr-2 rounded-3xl bg-inputs flex items-center "
            />
          </div>
          <div>
            <p className="text-sm mb-2">Deadline(mins)</p>
            <input
              type="number"
              placeholder="20min"
              disabled
              className=" text-white  text-lg w-full outline-none py-2 pl-6 pr-2 rounded-3xl bg-inputs flex items-center "
            />
          </div>
          <div>
            <p className="text-sm mb-2">Max hops</p>
            <input
              type="number"
              placeholder="3"
              disabled
              className=" text-white  text-lg w-full outline-none py-2 pl-6 pr-2 rounded-3xl bg-inputs flex items-center "
            />
          </div>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <button
              className="py-2 px-2 w-full bg-buttonAccent text-black disabled:opacity-50 rounded-md hover:bg-buttonAccentHover transition-all duration-200 ease-in-out"
              disabled
            >
              Reset to defaults
            </button>
            <button disabled className="py-2 px-2 w-full bg-buttonAccent text-black disabled:opacity-50 rounded-md hover:bg-buttonAccentHover transition-all duration-200 ease-in-out">
              Save Settings
            </button>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,.3)]"></div>
    </div>
  );
};

export default SettingsPopup;
