const getMsToNextTick = () => 1000 - new Date().getMilliseconds();

const tick = () => {
  postMessage('tick');
  setTimeout(tick, getMsToNextTick());
};

setTimeout(tick, getMsToNextTick());

export {};
