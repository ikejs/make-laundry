$(document).ready(() => {


  // SECONDS AND MINUTES
  let reservedFor = "5:00";
  const interval = setInterval(function() {
    const timer = reservedFor.split(':');
    let minutes = parseInt(timer[0], 10);
    let seconds = parseInt(timer[1], 10);
    --seconds;
    if ((minutes==0) && (seconds < 1))  {
      window.location = '/account/machines'
    }
    minutes = (seconds < 0) ? --minutes : minutes;
    seconds = (seconds < 0) ? 59 : seconds;
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    $('#reserved-for').text(`Reserved for ${minutes}:${seconds}`);
    reservedFor = minutes + ':' + seconds;
  }, 1000);


  // MOCK DATA - UPSTAIRS DRYER (MINUTES AND HOURS)
  let upstairsTopDryerTimer = "6:58";
  const upstairsTopDryerInterval = setInterval(function() {
    const timer = upstairsTopDryerTimer.split(':');
    let hours = parseInt(timer[0], 10);
    let minutes = parseInt(timer[1], 10);
    --minutes;
    hours = (minutes < 0) ? --hours : hours;
    minutes = (minutes < 0) ? 59 : minutes;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    $('#upstairsTopDryerTime').text(`${hours}:${minutes}`);
    upstairsTopDryerTimer = hours + ':' + minutes;
  }, 1000 * 60);



  // MOCK DATA - UPSTAIRS WASHER #2 (MINUTES AND HOURS)
  let upstairsWasher2Timer = "23:14";
  const upstairsWasher2Interval = setInterval(function() {
    const timer = upstairsWasher2Timer.split(':');
    let hours = parseInt(timer[0], 10);
    let minutes = parseInt(timer[1], 10);
    --minutes;
    hours = (minutes < 0) ? --hours : hours;
    minutes = (minutes < 0) ? 59 : minutes;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    $('#upstairsWasher2Time').text(`${hours}:${minutes}`);
    upstairsWasher2Timer = hours + ':' + minutes;
  }, 1000 * 60);




});
