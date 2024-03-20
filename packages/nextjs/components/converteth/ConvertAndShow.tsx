"use client";

import { useState } from "react";

const MAJOR_COINS = ["BTC", "ETH", "OP", "MATIC", "MKR"];

export const ConvertAndShow = ({ data }: { data: any }) => {
  const [amount, setAmount] = useState<any>("1");
  const [selectedCurrency, setSelectedCurrency] = useState("BTC");
  const [displayedCoins, setDisplayedCoins] = useState<string[]>(MAJOR_COINS);
  const [addCoinValue, setAddCoinValue] = useState("");

  const prices = data.reduce((acc: any, curr: any) => {
    acc[curr.symbol] = curr.quote.USD.price;
    return acc;
  }, {});

  const convertedAmounts = displayedCoins.reduce((acc: any, curr) => {
    if (curr !== selectedCurrency) {
      acc[curr] = ((amount * prices[selectedCurrency]) / prices[curr]).toFixed(2);
    }
    return acc;
  }, {});

  const addCoinToShow = (symbol: string) => {
    if (!displayedCoins.includes(symbol)) {
      setDisplayedCoins(prevCoins => [...prevCoins, symbol]);
      setAddCoinValue("");
    }
  };

  const coinsToAdd = data.filter((coin: any) => !displayedCoins.includes(coin.symbol));

  return (
    <div className="flex w-full">
      <div className="shrink max-w-xs">
        <div className="flex flex-col items-center bg-gray-200 p-5 font-mono text-gray-800 border-2 border-black m-5 shadow-lg">
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="mb-4 p-2 border-2 border-black bg-white text-black w-full"
          />
          <select
            value={selectedCurrency}
            onChange={e => setSelectedCurrency(e.target.value)}
            className="mb-4 p-2 bg-white text-black font-mono border-2 border-black w-full"
          >
            {data.map((crypto: any) => (
              <option key={crypto.id} value={crypto.symbol}>
                {crypto.symbol}
              </option>
            ))}
          </select>
          <select
            value={addCoinValue}
            onChange={e => addCoinToShow(e.target.value)}
            className="mb-4 p-2 bg-white text-black font-mono border-2 border-black w-full"
            defaultValue=""
          >
            <option value="" disabled>
              Add Coin to Show
            </option>
            {coinsToAdd.map((crypto: any) => (
              <option key={crypto.id} value={crypto.symbol}>
                {crypto.symbol}
              </option>
            ))}
          </select>
        </div>
        <div className="font-mono text-black p-2 m-5 text-center border-2 border-black bg-gray-200">
          {selectedCurrency}: ${prices[selectedCurrency]}
        </div>
      </div>

      <div className="flex-1 flex flex-wrap overflow-y-auto justify-center">
        {amount > 0 &&
          displayedCoins.map(
            symbol =>
              convertedAmounts[symbol] && (
                <div
                  key={symbol}
                  className="font-mono text-black p-2 m-5 border-2 border-black bg-gray-200 text-center flex-none w-32 h-32 flex items-center justify-center"
                >
                  <p>
                    {symbol}: {convertedAmounts[symbol]}
                  </p>
                </div>
              ),
          )}
      </div>
    </div>
  );
};
