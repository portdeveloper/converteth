import type { NextPage } from "next";
import { ConvertAndShow } from "~~/components/converteth/ConvertAndShow";

async function getData() {
  const api_key = process.env.NEXT_PUBLIC_CMC_API_KEY; // Store API key in .env.local file without NEXT_PUBLIC_ prefix
  const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";

  if (!api_key) {
    throw new Error("API key is undefined. Make sure NEXT_PUBLIC_CMC_API_KEY is set in your environment variables.");
  }

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "X-CMC_PRO_API_KEY": api_key,
    },
    next: { revalidate: 30 },
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

const Home: NextPage = async () => {
  const data = await getData();

  return (
    <>
      <div className="flex items-center justify-center flex-col flex-grow">
        <ConvertAndShow data={data.data} />
      </div>
    </>
  );
};

export default Home;
