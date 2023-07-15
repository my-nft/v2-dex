import { ethers } from "ethers";
import routerAbi from "../web3/abi/Router.json";
import tokenAbi from "../web3/abi/Token.json";
import factoryAbi from "../web3/abi/PairFactory.json";
import WETH9Abi from "../web3/abi/WETH9.json";

import {
  prepareWriteContract,
  readContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";
import { getAccount, getNetwork } from "@wagmi/core";
import ZklabV1FactoryAbi from "../web3/abi/ZklabV1Factory.json";
import { mainnetChains } from "./chain";
import { fetchBalance } from '@wagmi/core'

console.log("process.env: ", process.env);


export const routerAddressTestnet =
  process.env.REACT_APP_ROUTER_ADDRESS_TESTNET;
export const routerAddressMainnet =
  process.env.REACT_APP_ROUTER_ADDRESS_MAINNET;

export const wethAddressTestnet = process.env.REACT_APP_WETH_ADDRESS_TESTNET;
export const wethAddressMainnet = process.env.REACT_APP_WETH_ADDRESS_MAINNET;

export const pairFactoryAddressTestnet =
  process.env.REACT_APP_PAIR_FACTORY_ADDRESS_TESTNET;
export const pairFactoryAddressMainnet =
  process.env.REACT_APP_PAIR_FACTORY_ADDRESS_MAINNET;

const { chain: connectedNetwork } = getNetwork();

const slippage = Number(process.env.REACT_APP_SLIPPAGE);

export const getWethAddress = () => {
  return connectedNetwork && !mainnetChains.includes(connectedNetwork.id)
    ? wethAddressTestnet
    : wethAddressMainnet;
};

export const getRouterAddress = () => {
  return connectedNetwork && !mainnetChains.includes(connectedNetwork.id)
    ? routerAddressTestnet
    : routerAddressMainnet;
};

export const getPairFactoryAddress = () => {
  return connectedNetwork && !mainnetChains.includes(connectedNetwork.id)
    ? pairFactoryAddressTestnet
    : pairFactoryAddressMainnet;
};

// deadline de 10minutes
const deadline = 10;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const approveSwapExactTokensForETH = async (amountIn, tokenA) => {
  const amountTokenDesired = await formatAmout(amountIn, tokenA);
  // approve operation
  await callWriteMethod({
    address: tokenA,
    abi: tokenAbi,
    functionName: "approve",
    args: [getRouterAddress(), amountTokenDesired],
  });
  return amountTokenDesired;
};

// swapExactTokensForETH
export const swapExactTokensForETH = async (amountIn, tokenA) => {
  // prepare calls
  const wethAddress = getWethAddress();
  const amountTokenDesired = await formatAmout(amountIn, tokenA);
  const amoutOutMin = await getAmountOutMin(amountIn, tokenA, wethAddress);

  const routes = [tokenA, wethAddress];
  const { address } = getAccount();
  const epoch = getEpochDeadline(deadline);

  // run swapping
  await callWriteMethod({
    address: getRouterAddress(),
    abi: routerAbi,
    functionName: "swapExactTokensForETH",
    args: [amountTokenDesired, amoutOutMin.toString() , routes, address, epoch],
  });
};


// swapExactTokensForETH
export const swapExactTokensForTokens = async (amountIn, tokenA, tokenB) => {

  const amountTokenDesired = await formatAmout(amountIn, tokenA);
  const amountOut = await getAmoutOut(amountIn, tokenA, tokenB);
  const amoutOutMin = 0; //parseInt(amountOut * (100 - slippage) / 100); //getAmoutOutMin(amountOut);

  const routes = [tokenA, tokenB];
  const { address } = getAccount();
  const epoch = getEpochDeadline(deadline);
  // run swapping
  await callWriteMethod({
    address: getRouterAddress(),
    abi: routerAbi,
    functionName: "UNSAFE_swapExactTokensForTokens",
    args: [
      amountTokenDesired, 
      amoutOutMin,
      routes,
      address, 
      epoch,
    ]
  });
};


// WETH => ETH

export const swapWethToEth = async (amount) => {
  console.log("swapWethToEth")
  const wethAddress = getWethAddress();
  const amountTokenDesired = await formatAmout(amount, wethAddress);
  await callWriteMethod({
    address: wethAddress,
    abi: WETH9Abi,
    functionName: "withdraw",
    args: [amountTokenDesired],
  });
} 

// ETH => WETH

export const swapEthToWeth = async (amountIn) => {
  const wethAddress = getWethAddress();
  const amountTokenDesired = await formatAmout(amountIn, wethAddress);
  await callWriteMethod({
    address: wethAddress,
    abi: WETH9Abi,
    functionName: "deposit",
    args: [{value: amountTokenDesired}],
  });
}

// swapExactETHForTokens
export const swapExactETHForTokens = async (amountEth, tokenA) => {
  const amoutOutMin = 0; 
  const wethAddress = getWethAddress();
  const routes = [wethAddress, tokenA];
  const { address } = getAccount();
  const epoch = getEpochDeadline(deadline);

  await callWriteMethod({
    address: getRouterAddress(),
    abi: routerAbi,
    functionName: "swapExactETHForTokens",
    args: [
      amoutOutMin,
      routes,
      address,
      epoch,
      { value: ethers.utils.parseEther(amountEth.toString()) }
    ],
  });
};

// approve liquidity
export const appoveLiquidity = async (amountIn, tokenAddr) => {
  const amountTokenDesired = await formatAmout(amountIn, tokenAddr);
  const routerAddress = getRouterAddress();
  // approve
  await callWriteMethod({
    address: tokenAddr,
    abi: tokenAbi,
    functionName: "approve",
    args: [routerAddress, amountTokenDesired],
  });
};

export const appoveRemoveLiquidity = async (tokenAddr) => {

  const { address } = getAccount();
  const routerAddress = getRouterAddress();

  const pairFactoryAddress = getPairFactoryAddress();
  const wethAddress = getWethAddress();
  console.log("pairFactoryAddress", pairFactoryAddress);

  const pairAddress = await readContract({
    address: pairFactoryAddress,
    abi: factoryAbi,
    functionName: "getPair",
    args: [tokenAddr, wethAddress],
  });

  const liquidity = await readContract({
    address: pairAddress,
    abi: ZklabV1FactoryAbi,
    functionName: "balanceOf",
    args: [address],
  });

  const amountTokenDesired = await formatAmout(liquidity, tokenAddr);

  console.log("liquidity: ", liquidity);
  // approve
  await callWriteMethod({
    address: pairAddress,
    abi: tokenAbi,
    functionName: "approve",
    args: [routerAddress, amountTokenDesired],
  });
};

//ADD LIQUIDITY (TOKEN TO ETH)
export const addLiquidity = async (amountIn, amountEth, tokenAddr) => {
  const amountTokenDesired = await formatAmout(amountIn, tokenAddr); 
  const amountTokenMin = 0;
  const amountETHMin = 0;
  const { address } = getAccount();
  const epoch = getEpochDeadline(deadline);

  const value = await formatAmout(amountEth, getWethAddress());
  console.log("value: ", value); 

  // addLiquidity
  await callWriteMethod({
    address: getRouterAddress(),
    abi: routerAbi,
    functionName: "addLiquidityETH",
    args: [
      tokenAddr,
      // false,
      amountTokenDesired,
      amountTokenMin,
      amountETHMin,
      address,
      epoch,
      { value },
    ],
  });
};

//REMOVE LIQUIDITY (TOKEN TO ETH)
export const removeLiquidity = async (tokenAddr) => {
  const { address } = getAccount();
  const epoch = getEpochDeadline(deadline);
  const amountTokenMin = 0;
  const amountETHMin = 0;
  // removeLiquidity

  const pairFactoryAddress = getPairFactoryAddress();
  const wethAddress = getWethAddress();
  console.log("pairFactoryAddress", pairFactoryAddress);

  const pairAddress = await readContract({
    address: pairFactoryAddress,
    abi: factoryAbi,
    functionName: "getPair",
    args: [tokenAddr, wethAddress],
  });

  console.log("pairAddress", pairAddress);

  const liquidity = await readContract({
    address: pairAddress,
    abi: ZklabV1FactoryAbi,
    functionName: "balanceOf",
    args: [address],
  });

  console.log("liquidity", liquidity);

  console.log("liquidity", liquidity);

  await callWriteMethod({
    address: getRouterAddress(),
    abi: routerAbi,
    functionName: "removeLiquidityETH",
    args: [
      tokenAddr,
      liquidity,
      amountTokenMin,
      amountETHMin,
      address,
      epoch,
    ],
  });
};

export const getAmoutEquivalent = async (
  amountIn,
  tokenOrigin,
  tokenDestination
) => {
  console.log("getAmoutEquivalent");
  const pairFactoryAddress = getPairFactoryAddress();
  console.log("pairFactoryAddress", pairFactoryAddress)

  try {
    const wethAddress = getWethAddress();
    if(tokenOrigin === wethAddress && tokenDestination === wethAddress) {
      return amountIn;
    }
    // GET PAIR
    const pair = await readContract({
      address: pairFactoryAddress,
      abi: factoryAbi,
      functionName: "getPair",
      args: [tokenOrigin, tokenDestination],
    });

    // VERIFY IF PAIR EXISTS
    if (pair === ZERO_ADDRESS) {
      return undefined;
    }

    const amountOut = await getAmoutOut(
      amountIn,
      tokenOrigin,
      tokenDestination
    );

    return await formatAmoutOut(amountOut, tokenDestination);
  } catch (exception) {
    console.error(exception)
    return 0;
  }
};

//GET AMOUNT OUT
export const getAmoutOut = async (amountIn, tokenOrigin, tokenDestination) => {
  const formattedAmountIn = await formatAmout(amountIn, tokenOrigin);
  const amountOut = await readContract({
    address: getRouterAddress(),
    abi: routerAbi,
    functionName: "getAmountsOut",
    args: [formattedAmountIn, [tokenOrigin, tokenDestination]],
  });
  return amountOut[1];
};

const getAmountOutMin = async (amountIn, tokenOrigin, tokenDestination) => {
  const amountOut = await getAmoutOut(amountIn, tokenOrigin, tokenDestination);
  return parseInt(amountOut * (100 - slippage) / 100); //getAmoutOutMin(amountOut);
}

export const getAmountOutMinFormatted = async (amountIn, tokenOrigin, tokenDestination) => {
  try {

    const wethAddress = getWethAddress();
    if(tokenOrigin === wethAddress && tokenDestination === wethAddress) {
      return amountIn;
    }

    const amountOut = await getAmountOutMin(amountIn, tokenOrigin, tokenDestination);
    return await formatAmoutOut(amountOut, tokenDestination);
  } catch (exception) {
    console.error(exception);
    return 0;
  }
}


const formatAmout = async (amountIn, tokenAddress) => {
  console.log("amountIn: ", amountIn);
  const decimals = await readContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "decimals",
  });
  let dec = (parseInt(decimals/2) >= 6) ? parseInt(decimals/2) : 6;
  let dec2 = decimals - dec;
  let str = "";
  for (var i = 0 ; i < dec2 ; i ++){
    str = str + "0";
  }
  // return parseInt(amountIn * 10 ** Number(decimals)).toString();
  const out = parseInt(amountIn * 10 ** Number(dec)).toString() + str;
  // return ethers.utils.hexlify(ethers.utils.toUtf8Bytes(out));
  return out;
};

const formatAmoutOut = async (amoutOut, tokenDestAddress) => {
  const decimals = await readContract({
    address: tokenDestAddress,
    abi: tokenAbi,
    functionName: "decimals",
  });
  return amoutOut / 10 ** Number(decimals);
};

const getAllowance = async (tokenAddress) => {
  const { address } = getAccount();
  const allowance = await readContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "allowance",
    args: [address, getRouterAddress()],
  });
  return allowance;
};

export const shouldApprove = async (tokenA, tokenB, amoutA, amoutB) => {
  const wethAddress = getWethAddress();
  const tokenAddress = tokenA === wethAddress ? tokenB : tokenA;
  const tokenAmount = tokenA === wethAddress ? amoutB : amoutA;
  const allowance = await getAllowance(tokenAddress);
  const formattedAllowance = await formatAmoutOut(allowance, tokenAddress);
  return formattedAllowance < tokenAmount;
};

export const getLiquidityEquivalent = async (amountIn, tokenA, tokenB) => {
  try {

    const pairFactoryAddress = getPairFactoryAddress();
    // GET PAIR
    console.table({ tokenA, tokenB });
    const pairAddress = await readContract({
      address: pairFactoryAddress,
      abi: factoryAbi,
      functionName: "getPair",
      args: [tokenA, tokenB],
    });

    // VERIFY IF PAIR EXISTS
    if (pairAddress === ZERO_ADDRESS) {
      return undefined;
    }

    const reserves = await readContract({
      address: pairAddress,
      abi: ZklabV1FactoryAbi,
      functionName: "getReserves",
    });

    const token0 = await readContract({
      address: pairAddress,
      abi: ZklabV1FactoryAbi,
      functionName: "token0",
    });

    let ratio; 
    if(token0 === tokenA) {
      const format1 = await formatAmoutOut(reserves[1], tokenB);   
      const format2 = await formatAmoutOut(reserves[0], tokenA);
      ratio = format1 / format2;
    } else {
      const format1 = await formatAmoutOut(reserves[0], tokenB);   
      const format2 = await formatAmoutOut(reserves[1], tokenA);
      ratio = format1 / format2;
    }

    let value = amountIn * ratio;

    console.log("value", value);

    return value;
  } catch (exception) {
    console.error(exception);
    return 0;
  }
};

const getEpochDeadline = (deadline) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + Number(deadline));
  return date.getTime();
};

const callWriteMethod = async ({ address, abi, functionName, args }) => {
  const config = await prepareWriteContract({
    address,
    abi,
    functionName,
    args,
  });
  const { hash } = await writeContract(config);
  return await waitForTransaction({ hash });
};

export const getTokensLiquidity = async (token0, token1) => {
  console.log("getTokensLiquidity");

  const { address } = getAccount();

  const pairAddress = await readContract({
    address: getPairFactoryAddress(),
    abi: factoryAbi,
    functionName: "getPair",
    args: [token0, token1],
  });

  if (pairAddress === ZERO_ADDRESS) {
    return undefined;
  }

  const userBalance = await readContract({
    address: pairAddress,
    abi: ZklabV1FactoryAbi,
    functionName: "balanceOf",
    args: [address],
  });

  const totalSupply = await readContract({
    address: pairAddress,
    abi: ZklabV1FactoryAbi,
    functionName: "totalSupply",
  });

  const ratio = userBalance / totalSupply;

  const tokenOInBlc = await readContract({
    address: pairAddress,
    abi: ZklabV1FactoryAbi,
    functionName: "token0",
  });

  // get reserve
  const reserves = await readContract({
    address: pairAddress,
    abi: ZklabV1FactoryAbi,
    functionName: "getReserves",
  });

  let ratio0;
  let ratio1;

  if (token0 === tokenOInBlc) {
    ratio0 = await formatAmoutOut(reserves[0] * ratio, token0);
    ratio1 = await formatAmoutOut(reserves[1] * ratio, token1);
  } else {
    ratio0 = await formatAmoutOut(reserves[0] * ratio, token1);
    ratio1 = await formatAmoutOut(reserves[1] * ratio, token0);
  }

  return {
    ratio0,
    ratio1,
  };
};


export const getBalance = async (coin) => {
  const {address} = getAccount();
  const tokenAddress = coin?.smartContractAddress;

  if(address && coin) {
    console.log("Looking for balance for token", tokenAddress);
    
    if(coin?.symbol.toLowerCase() === "weth") {
      let balanceWeth = await readContract({
        address: getWethAddress(),
        abi: WETH9Abi,
        functionName: "balanceOf",
        args: [address]
      });

      balanceWeth = await formatAmoutOut(balanceWeth, tokenAddress);

      return {formatted : balanceWeth};
    } else if(tokenAddress === getWethAddress()) {
      return await fetchBalance({
        address    
      });
    } else {
      return await fetchBalance({
        address,
        token: tokenAddress
      });
    } 
  }
}
