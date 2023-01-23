export default function formatCountdown(milliseconds: number) {
  const asSeconds = milliseconds / 1000;

  const minutes = Math.floor(asSeconds / 60);
  const seconds = Math.floor(asSeconds % 60);

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
