"use client";

import { useEffect, useState, useMemo } from "react";

import Image from "next/image";
import { useLocalStorage } from "usehooks-ts";

const MAJOR_COINS = ["BTC", "ETH", "OP", "MATIC", "MKR"];

interface CryptoQuote {
  price: number;
}

interface CryptoData {
  id: string;
  symbol: string;
  quote: { USD: CryptoQuote };
}

interface ConvertAndShowProps {
  data: CryptoData[];
}

const LOCAL_STORAGE_KEY = "cryptoPreferences";

export const ConvertAndShow = ({ data }: ConvertAndShowProps) => {
  const [localStoredvalue, setLocalStoredvalue] = useLocalStorage(
    LOCAL_STORAGE_KEY,
    {
      baseCurrency: "BTC",
      displayedCoins: MAJOR_COINS,
      amount: "1",
    },
    {
      initializeWithValue: true,
    },
  );
  const [amount, setAmount] = useState(localStoredvalue.amount);
  const [selectedCurrency, setSelectedCurrency] = useState(localStoredvalue.baseCurrency);
  const [displayedCoins, setDisplayedCoins] = useState(localStoredvalue.displayedCoins);

  const prices = useMemo(() => {
    return data.reduce((acc: Record<string, number>, curr: CryptoData) => {
      acc[curr.symbol] = curr.quote.USD.price;
      return acc;
    }, {});
  }, [data]);

  const convertedAmounts = useMemo(() => {
    return displayedCoins.reduce((acc: Record<string, string>, curr: string) => {
      if (curr !== selectedCurrency && prices[selectedCurrency] && prices[curr]) {
        acc[curr] = ((parseFloat(amount) * prices[selectedCurrency]) / prices[curr]).toFixed(2);
      }
      return acc;
    }, {});
  }, [amount, selectedCurrency, displayedCoins, prices]);

  const addCoinToShow = (symbol: string) => {
    if (!displayedCoins.includes(symbol)) {
      setDisplayedCoins(prevCoins => [...prevCoins, symbol]);
    }
  };

  const removeCoinToShow = (symbol: string) => {
    setDisplayedCoins(prevCoins => prevCoins.filter(coin => coin !== symbol));
  };

  const coinsToAdd = data
    .filter(coin => !displayedCoins.includes(coin.symbol))
    .sort((a, b) => a.symbol.localeCompare(b.symbol));

  // Effect to update LocalStorage when preferences change
  useEffect(() => {
    setLocalStoredvalue({ baseCurrency: selectedCurrency, displayedCoins, amount });
  }, [selectedCurrency, displayedCoins, amount, setLocalStoredvalue]);

  return (
    <div className="container mx-auto px-4 mt-8">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="bg-gray-200 relative p-5 mt-16 font-mono text-gray-800 border-2 border-black my-5 shadow-lg flex flex-col justify-end">
            <Image
              src="/converteth.svg"
              alt="converteth"
              width={300}
              height={150}
              className="absolute -top-36 left-0"
            />
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min="0"
              placeholder="Enter amount"
              className="p-2 z-50 border-2 border-black bg-white text-black mb-4 mt-16"
            />
            <select
              value={selectedCurrency}
              onChange={e => setSelectedCurrency(e.target.value)}
              className="p-2 bg-white text-black font-mono border-2 border-black mb-4"
            >
              {data.map(crypto => (
                <option key={crypto.id} value={crypto.symbol}>
                  {crypto.symbol}
                </option>
              ))}
            </select>

            <div className="text-black p-2 text-center border-2 border-black bg-gray-200 mb-4">
              {selectedCurrency}: ${prices[selectedCurrency]}
            </div>
            <select
              onChange={e => addCoinToShow(e.target.value)}
              className="p-2 bg-white text-black font-mono border-2 border-black "
              value={""}
            >
              <option value="" disabled>
                Add coin to show
              </option>
              {coinsToAdd.map(crypto => (
                <option key={crypto.id} value={crypto.symbol}>
                  {crypto.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col items-center">
          {amount && (
            <p className="font-bold text-lg m-0">
              {amount} {selectedCurrency} is...
            </p>
          )}
          <div className="flex flex-wrap justify-center items-center">
            {Number(amount) > 0 &&
              displayedCoins.map(
                symbol =>
                  convertedAmounts[symbol] && (
                    <div
                      key={symbol}
                      className="relative font-mono h-32 w-32 text-black p-2 border-2 border-black bg-gray-200 text-center m-5 flex flex-col items-center justify-center"
                    >
                      <button
                        onClick={() => removeCoinToShow(symbol)}
                        className="absolute right-2 top-0 text-xl hover:text-red-500"
                      >
                        X
                      </button>
                      <p>
                        {convertedAmounts[symbol]} {symbol}
                      </p>
                    </div>
                  ),
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
