"use client";

import { useState } from "react";
import Image from "next/image";
import ClipboardJS from "clipboard";

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

export const ConvertAndShow = ({ data }: ConvertAndShowProps) => {
  const [amount, setAmount] = useState("1");
  const [selectedCurrency, setSelectedCurrency] = useState("BTC");
  const [displayedCoins, setDisplayedCoins] = useState(MAJOR_COINS);

  const prices = data.reduce((acc: Record<string, number>, curr: CryptoData) => {
    acc[curr.symbol] = curr.quote.USD.price;
    return acc;
  }, {} as Record<string, number>);

  const convertedAmounts = displayedCoins.reduce((acc: Record<string, string>, curr: string) => {
    if (curr !== selectedCurrency && prices[selectedCurrency] && prices[curr]) {
      acc[curr] = ((parseFloat(amount) * prices[selectedCurrency]) / prices[curr]).toFixed(2);
    }
    return acc;
  }, {} as Record<string, string>);

  const addCoinToShow = (symbol: string) => {
    if (!displayedCoins.includes(symbol)) {
      setDisplayedCoins(prevCoins => [...prevCoins, symbol]);
    }
  };

  const coinsToAdd = data.filter(coin => !displayedCoins.includes(coin.symbol));
  new ClipboardJS(".btn");
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
              objectFit="contain"
              className="absolute -top-36 left-0"
            />
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
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
            <label>add coin to show</label>
            <select
              onChange={e => addCoinToShow(e.target.value)}
              className="p-2 bg-white text-black font-mono border-2 border-black "
              defaultValue=""
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
                      className="font-mono relative text-black p-2 border-2 border-black bg-gray-200 text-center m-5 flex items-center justify-center"
                      style={{ width: "8rem", height: "8rem" }}
                    >
                      <p>
                        <span id="number">{convertedAmounts[symbol]}</span> {symbol}
                      </p>
                      <button
                        data-clipboard-target="#number"
                        onClick={() => {
                          navigator.clipboard.writeText(convertedAmounts[symbol]);
                        }}
                        className="btn absolute top-0 right-0 h-3 max-h-[40px] w-3 max-w-[40px] select-none text-center bg-transparent rounded-none border-none align-middle font-sans text-xs font-medium uppercase text-white transition-all"
                        type="button"
                      >
                        <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                            className="w-4 h-4 text-black"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                            ></path>
                          </svg>
                        </span>
                      </button>
                    </div>
                  ),
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
