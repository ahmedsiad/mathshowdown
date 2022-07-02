import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from "react-chartjs-2";
import annotationPlugin from "chartjs-plugin-annotation";
import "chartjs-adapter-date-fns";
import getRank from "../utils/Ranks";

ChartJS.register(
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    annotationPlugin,
    Filler
);

const options = {
    plugins: {
        legend: {
            position: 'top',
        },
        chartAreaBorder: {
            borderColor: "black",
            borderWidth: 2
        },
        tooltip: {
            displayColors: false,
            callbacks: {
                label: (context) => {
                    let delta = context.raw - context.dataset.rating_before[context.dataIndex];
                    delta = (delta >= 0) ? "+" + delta.toString() : delta;
                    return `= ${context.raw} (${delta}), ${getRank(context.raw).toLowerCase()}`;
                },
                afterLabel: (context) => {
                    return `Rank: ${context.dataset.ranks[context.dataIndex]}`;
                },
                footer: (context) => {
                    return context[0].dataset.contest_titles[context[0].dataIndex];
                }
            }
        },
        annotation: {
            annotations: {
                newbie: {
                    type: "box",
                    drawTime: "beforeDraw",
                    adjustScaleRange: false,
                    yMin: 1200,
                    borderWidth: 0,
                    backgroundColor: "rgba(204, 204, 204)"
                },
                pupil: {
                    type: "box",
                    drawTime: "beforeDraw",
                    adjustScaleRange: false,
                    yMax: 1200,
                    yMin: 1500,
                    borderWidth: 0,
                    backgroundColor: "rgba(119, 255, 119)"
                },
                expert: {
                    type: "box",
                    drawTime: "beforeDraw",
                    adjustScaleRange: false,
                    yMax: 1500,
                    yMin: 1800,
                    borderWidth: 0,
                    backgroundColor: "rgba(170, 170, 255)"
                },
                candidateMaster: {
                    type: "box",
                    drawTime: "beforeDraw",
                    adjustScaleRange: false,
                    yMax: 1800,
                    yMin: 2000,
                    borderWidth: 0,
                    backgroundColor: "rgba(255, 136, 255)"
                },
                master: {
                    type: "box",
                    drawTime: "beforeDraw",
                    adjustScaleRange: false,
                    yMax: 2000,
                    yMin: 2200,
                    borderWidth: 0,
                    backgroundColor: "rgba(255, 187, 85)"
                },
                grandmaster: {
                    type: "box",
                    drawTime: "beforeDraw",
                    adjustScaleRange: false,
                    yMax: 2200,
                    borderWidth: 0,
                    backgroundColor: "rgba(255, 51, 51)"
                }
            }
        }
    },
    scales: {
        x: {
            type: "time",
            display: true,
            ticks: {
                maxTicksLimit: 10
            }
        },
        y: {
            suggestedMin: 1000,
            suggestedMax: 2000,
            ticks: {
                stepSize: 100,
                callback: val => ([1200, 1500, 1800, 2000, 2200].includes(val)) ? val : null
            }
        }
    }
};

const chartAreaBorder = {
    id: 'chartAreaBorder',
    beforeDraw(chart, args, options) {
        const { ctx, chartArea: { left, top, width, height } } = chart;
        ctx.save();
        ctx.strokeStyle = options.borderColor;
        ctx.lineWidth = options.borderWidth;
        ctx.strokeRect(left, top, width, height);
        ctx.restore();
    }
};

const RatingChart = (props) => {
    const chartData = {
        labels: props.user.contest_history.map((c) => c.start_time),
        datasets: [{
            label: props.user.username,
            data: props.user.contest_history.map((c) => c.rating_after),
            contest_titles: props.user.contest_history.map((c) => c.title),
            ranks: props.user.contest_history.map((c) => c.rank),
            rating_before: props.user.contest_history.map((c) => c.rating_before),
            borderWidth: 3,
            borderColor: "rgb(30, 30, 30)",
            backgroundColor: "white",
            pointStyle: "circle",
            pointRadius: 5,
            pointBackgroundColor: "white",
            pointBorderColor: "rgb(30, 30, 30)",

        }]
    };

    return (
        <div>
            <Line height="150px" data={chartData} options={options} plugins={[chartAreaBorder]} id="myChart" />
        </div>
    );
}

export default RatingChart;
