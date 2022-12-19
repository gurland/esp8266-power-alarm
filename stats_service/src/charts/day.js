import {asciichart} from 'asciichart'

function generateAsciiChartForOneDay(statsData, startTimestamp, chartWidth) {
  // TODO: Add working algorithm
  const endTimestamp = startTimestamp + 86400;
  const dayData = statsData.filter((statsEntry) => {
    return (startTimestamp < statsEntry[0]) && (statsEntry[0] < endTimestamp)
  }).map(
    statsEntry => [statsEntry[0]-startTimestamp, statsEntry[1]]
  );

  let s0 = new Array (chartWidth);

  const interval = Math.floor(86400 / chartWidth);
  const expectedEnabledPowerStatuses = interval / 60;

  for (let i = 0; i < chartWidth; i++) {

  }
}