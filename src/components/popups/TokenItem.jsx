import { useEffect } from "react";
import { useState } from "react";
import { getBalance } from "../../web3/web3Interactor";

const TokenItem = ({
  coin,
  index,
  selectTarget,
  setFromToken,
  setToToken,
  ignoreToken,
  closePopup,
}) => {
  const [balance, setBalance] = useState(0);
  const init = async () => {
    const btmp = await getBalance(coin);
    console.log(btmp);
    try {
      setBalance(Number.parseFloat(btmp?.formatted).toFixed(4));
    } catch (error) {}
  };
  useEffect(() => {
    init();
  }, [coin]);

  if (ignoreToken && coin.symbol === ignoreToken.symbol) return null;
  return (
    <div
      key={index}
      className="flex flex-row gap-4 py-4 items-center pr-3 cursor-pointer"
      onClick={() => {
        if (selectTarget === "from") setFromToken(coin);
        else setToToken(coin);
        closePopup();
      }}
    >
      <img src={coin.image} className="object-contain w-8 h-8" alt="" />
      <p>{coin.symbol.toUpperCase()}</p>
      <span className="ml-auto">{isNaN(balance) ? "-" : balance}</span>
    </div>
  );
};

export default TokenItem;
