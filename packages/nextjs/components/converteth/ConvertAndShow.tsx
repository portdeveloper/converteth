"use client";

import { useState } from "react";
import Image from "next/image";

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

  const [inputTextResponse, setInputTextResponse] = useState<string>();
  const [inputTextClassName, setInputTextClassName] = useState<string>();

  function onSubmit(event: any) {
    event.preventDefault();
    const target = event.target;
    console.log(target.input.value);

    let isPresent = false;

    for (let i = 0; i < data.length; i++) {
      if (data[i].symbol === target.input.value) {
        isPresent = true;
        break;
      }
    }

    if (!isPresent) {
      setInputTextClassName("text-red-600");
      setInputTextResponse(`${target.input.value} is not a supported token!`);
      return;
    }

    if (displayedCoins.includes(target.input.value)) {
      setInputTextClassName("text-red-600");
      setInputTextResponse(`${target.input.value} is already being tracked!`);
      return;
    }

    setInputTextClassName("text-green-600");
    setInputTextResponse(`Succesfully added ${target.input.value}!`);
    setDisplayedCoins(prevCoins => [...prevCoins, target.input.value]);
  }

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

            <form onSubmit={onSubmit} className="border-2 border-black flex flex-col p-2 m-2">
              <p className="text-center">Add coin</p>
              <input
                name="input"
                type="text"
                className="m-1 p-2 bg-white text-black font-mono botder-2 border-black"
              ></input>
              <button className="m-1 bg-white border-2 border-black">Add</button>
              <p className={inputTextClassName}>{inputTextResponse}</p>
            </form>
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
                      className="font-mono text-black p-2 border-2 border-black bg-gray-200 text-center m-5 flex items-center justify-center"
                      style={{ width: "8rem", height: "8rem" }}
                    >
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
