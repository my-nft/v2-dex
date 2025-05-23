import zklabLogo from "./assets/img/ZKLAB_logo.png";
import { getWethAddress, wethAddress, wethAddressMainnet, wethAddressTestnet } from "./web3/web3Interactor";

export const ChartHistory = [
  [1676332800000, 0.488458006151832],
  [1676419200000, 0.769012004049167],
  [1676505600000, 0.739955713082799],
  [1676592000000, 0.795199157769017],
  [1676678400000, 0.686849530986],
  [1676764800000, 0.59034944479],
  [1676851200000, 0.597176521942],
  [1676937600000, 0.464189733029264],
  [1677024000000, 0.56574078698978],
  [1677110400000, 0.637632900512],
  [1677196800000, 0.71171927155872],
  [1677283200000, 0.56078941415615],
  [1677369600000, 0.420989545427063],
  [1677456000000, 0.47300937899657],
  [1677542400000, 0.534604054918836],
  [1677628800000, 0.5611770498],
  [1677715200000, 0.61119483550417],
  [1677801600000, 0.7802121343093],
  [1677888000000, 0.655152375],
  [1677974400000, 0.43999566147475],
  [1678060800000, 0.4456590651],
  [1678147200000, 0.594591489514],
  [1678233600000, 0.47114836224],
  [1678320000000, 0.4898380139536],
  [1678406400000, 0.5669698530603],
  [1678492800000, 0.64369395605],
  [1678579200000, 0.4978897594],
  [1678665600000, 0.574577203741],
  [1678752000000, 0.5439327961375],
  [1678838400000, 0.7986105],
  [1678877461000, 0.9111441102526],
];

export const UsedCoins = [
  {
    id: "ethereum Testnet",
    symbol: "eth testnet",
    name: "Ethereum Testnet",
    smartContractAddress: wethAddressTestnet,
    image:
      "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    constract_address: "",
    current_price: 1686.92,
    market_cap: 202398712773,
    market_cap_rank: 2,
    fully_diluted_valuation: 202398712773,
    total_volume: 19379218298,
    high_24h: 1778.85,
    low_24h: 1666.34,
    price_change_24h: -52.11044643409082,
    price_change_percentage_24h: -2.99652,
    market_cap_change_24h: -6112139028.700806,
    market_cap_change_percentage_24h: -2.93133,
    circulating_supply: 120456426.863651,
    total_supply: 120456426.863651,
    max_supply: null,
    ath: 4878.26,
    ath_change_percentage: -65.52034,
    ath_date: "2021-11-10T14:24:19.604Z",
    atl: 0.432979,
    atl_change_percentage: 388373.38552,
    atl_date: "2015-10-20T00:00:00.000Z",
    roi: {
      times: 89.5250152822146,
      currency: "btc",
      percentage: 8952.501528221459,
    },
    last_updated: "2023-03-15T12:56:31.156Z",
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    smartContractAddress: wethAddressMainnet,
    isMainnet : true,
    image:
      "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    constract_address: "",
    current_price: 1686.92,
    market_cap: 202398712773,
    market_cap_rank: 2,
    fully_diluted_valuation: 202398712773,
    total_volume: 19379218298,
    high_24h: 1778.85,
    low_24h: 1666.34,
    price_change_24h: -52.11044643409082,
    price_change_percentage_24h: -2.99652,
    market_cap_change_24h: -6112139028.700806,
    market_cap_change_percentage_24h: -2.93133,
    circulating_supply: 120456426.863651,
    total_supply: 120456426.863651,
    max_supply: null,
    ath: 4878.26,
    ath_change_percentage: -65.52034,
    ath_date: "2021-11-10T14:24:19.604Z",
    atl: 0.432979,
    atl_change_percentage: 388373.38552,
    atl_date: "2015-10-20T00:00:00.000Z",
    roi: {
      times: 89.5250152822146,
      currency: "btc",
      percentage: 8952.501528221459,
    },
    last_updated: "2023-03-15T12:56:31.156Z",
  },
  {
    id: "Test Token",
    symbol: "TT1",
    name: "Test Token",
    isMainnet: true,
    smartContractAddress: '0x0Dc4C1ea1f9566bCA5A500Dbf8149C47E446D09d',
    image:
      "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
    current_price: 1.002,
    market_cap: 38473369602,
    market_cap_rank: 5,
    fully_diluted_valuation: 38473369602,
    total_volume: 7704331110,
    high_24h: 1.011,
    low_24h: 0.993303,
    price_change_24h: 0.00562542,
    price_change_percentage_24h: 0.56442,
    market_cap_change_24h: -1160965878.1140594,
    market_cap_change_percentage_24h: -2.92919,
    circulating_supply: 38436872128.2209,
    total_supply: 38436872128.2209,
    max_supply: null,
    ath: 1.17,
    ath_change_percentage: -15.22826,
    ath_date: "2019-05-08T00:40:28.300Z",
    atl: 0.877647,
    atl_change_percentage: 13.27149,
    atl_date: "2023-03-11T08:02:13.981Z",
    roi: null,
    last_updated: "2023-03-15T12:56:27.223Z",
  },
  {
    id: "Test Token 2",
    symbol: "TT2",
    name: "Test Token",
    isMainnet: true,
    smartContractAddress: '0x30432465CD88349cF2Cc971f252436F10062F11b',
    image:
      "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
    current_price: 1.002,
    market_cap: 38473369602,
    market_cap_rank: 5,
    fully_diluted_valuation: 38473369602,
    total_volume: 7704331110,
    high_24h: 1.011,
    low_24h: 0.993303,
    price_change_24h: 0.00562542,
    price_change_percentage_24h: 0.56442,
    market_cap_change_24h: -1160965878.1140594,
    market_cap_change_percentage_24h: -2.92919,
    circulating_supply: 38436872128.2209,
    total_supply: 38436872128.2209,
    max_supply: null,
    ath: 1.17,
    ath_change_percentage: -15.22826,
    ath_date: "2019-05-08T00:40:28.300Z",
    atl: 0.877647,
    atl_change_percentage: 13.27149,
    atl_date: "2023-03-11T08:02:13.981Z",
    roi: null,
    last_updated: "2023-03-15T12:56:27.223Z",
  },

];
