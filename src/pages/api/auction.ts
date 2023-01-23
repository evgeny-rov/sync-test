// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

interface Bidder {
  id: number;
  name: string;
}

export interface Data {
  activeBidderId: number;
  activeBidderTicksLeft: number;
  bidders: Bidder[];
}

// one tick is 1000 ms or 1 second

const BIDDERS_COUNT = 4;
const BIDDER_TURN_TICKS = 120;
const BIDDER_TURN_MINUTES = BIDDER_TURN_TICKS / 60;

export async function getAuctionData() {
  const currentTime = new Date();
  const activeBidderId = Math.floor(
    (currentTime.getMinutes() / BIDDER_TURN_MINUTES) % BIDDERS_COUNT
  );

  const activeBidderMinutesLeft =
    BIDDER_TURN_MINUTES - (currentTime.getMinutes() % BIDDER_TURN_MINUTES);
  const activeBidderDeadline = new Date();
  activeBidderDeadline.setMinutes(currentTime.getMinutes() + activeBidderMinutesLeft);
  activeBidderDeadline.setSeconds(0);

  const activeBidderTicksLeft = (activeBidderDeadline.getTime() - currentTime.getTime()) / 1000;

  const bidders = Array(BIDDERS_COUNT)
    .fill(null)
    .map((_, idx) => ({
      id: idx,
      name: `Person - ${idx}`,
    }));

  return { bidders, activeBidderId, activeBidderTicksLeft };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const auctionData = await getAuctionData();
  res.status(200).json(auctionData);
}
