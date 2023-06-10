import { MdClose } from "react-icons/md";
// import { mainnetChains, zkSyncMainetChain } from "../../web3/chain";
import { mainnetChains, sepoliaChain } from "../../web3/chain";
import TokenItem from "./TokenItem";



const TokenSelect = ({
  shouldShow,
  closePopup = () => {},
  setFromToken,
  setToToken,
  selectTarget,
  options = [],
  ignoreToken = null,
  // chain = zkSyncMainetChain
  chain = sepoliaChain
}) => {

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
        <div className="flex items-center justify-between p-6 border-b border-white mb-4">
          <p className="font-kanitLight text-white text-xl">SELECT TOKEN</p>
          <MdClose
            className="w-6 h-6 text-text cursor-pointer"
            onClick={() => closePopup()}
          />
        </div>
        <div className="font-kanitLight text-text p-6 flex flex-col gap-5">
          {
            /*
            <div>
              <p className="text-lg">Commong bases</p>
              <div className="flex flex-wrap gap-6 mt-4 mb-8"></div>
            </div>
            */
          }
 
          <div>
            <p className="text-lg">Token List</p>
            <div className="flex flex-col max-h-[60vh] overflow-y-auto">
              {options
                .filter(option => chain && ((mainnetChains.includes(chain.id) && option.isMainnet) || (!mainnetChains.includes(chain.id) && !option.isMainnet)))
                .sort((a, b) => a.symbol.localeCompare(b.symbol))
                .map((coin, index) => <TokenItem coin={coin} 
                setFromToken={setFromToken}
                ignoreToken={ignoreToken}
                selectTarget={selectTarget}
                setToToken={setToToken}
                closePopup={closePopup}
                index={index} 
                key={index} />)}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-[rgba(0,0,0,.3)]"></div>
    </div>
  );
};

export default TokenSelect;
