import Head from 'next/head';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { calcRemainingTurnTime, getCurrentTurn, getActiveBidderId } from '@/utils/bidding';
import formatCountdown from '@/utils/format-countdown';
import type { InferGetServerSidePropsType } from 'next';

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Home({ data }: PageProps) {
  const [countdownTime, setCountdownTime] = useState<number | null>(null);

  useEffect(() => {
    const clockWorker = new Worker(new URL('@/workers/clock-worker.ts', import.meta.url));

    clockWorker.addEventListener('message', () => {
      setCountdownTime(calcRemainingTurnTime(data.biddingStartedAt, data.biddingTurnDuration));
    });

    setCountdownTime(calcRemainingTurnTime(data.biddingStartedAt, data.biddingTurnDuration));

    return () => clockWorker.terminate();
  }, [data]);

  const currentTurn = getCurrentTurn(data.biddingStartedAt, data.biddingTurnDuration);
  const activeBidderId = getActiveBidderId(currentTurn, data.bidders.length);
  const biddingStartedDate = new Date(data.biddingStartedAt).toLocaleString('ru-RU');

  if (!countdownTime) return <p>Loading...</p>;

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-10 text-neutral-900">
        <h1 className="text-3xl mb-10 font-bold">Торги от - {biddingStartedDate}</h1>
        <ul className="flex flex-wrap gap-4">
          {data.bidders.map((bidder) => (
            <li key={bidder.name} className="grid grid-rows-2 gap-4">
              <div>
                {bidder.id === activeBidderId && (
                  <div className="bg-red-100 w-full h-full flex gap-2 justify-center items-center rounded-md">
                    <span className="font-bold text-red-800">{formatCountdown(countdownTime)}</span>
                    <span>⌛</span>
                  </div>
                )}
              </div>

              <div
                className={clsx(
                  'bg-gray-100 rounded-md p-5 text-gray-400 transition-colors',
                  bidder.id === activeBidderId && 'text-current bg-red-100'
                )}
              >
                <span className="capitalize font-bold">{bidder.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

export const getServerSideProps = async () => {
  const BIDDERS_COUNT = 4;
  const BIDDER_TURN_DURATION_MS = 1000 * 60 * 2;

  // Arbitrary date when bidding started
  const biddingStartedDate = new Date(2023, 0, 1);

  const bidders = Array(BIDDERS_COUNT)
    .fill(null)
    .map((_, idx) => ({
      id: idx,
      name: `Участник - ${idx + 1}`,
    }));

  return {
    props: {
      data: {
        biddingStartedAt: biddingStartedDate.getTime(),
        biddingTurnDuration: BIDDER_TURN_DURATION_MS,
        bidders,
      },
    },
  };
};
