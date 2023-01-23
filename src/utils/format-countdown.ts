export default function formatCountdown(ticks: number) {
  const pad = (num: number) => {
    return `${num}`.padStart(2, '0');
  };

  let minutes = Math.floor(ticks / 60);
  let seconds = Math.floor(ticks % 60);

  return `${pad(minutes)}:${pad(seconds)}`;
}
