
const formatMinutes = (t) => {
    const minutes = Math.floor(t / 60000);
    const seconds = Math.floor((t - minutes * 60000) / 1000);
    let str = "";
    if (minutes < 10) str += "0";
    str += minutes.toString() + ":";
    if (seconds < 10) str += "0";
    str += seconds.toString();

    return str;
}

export default formatMinutes;