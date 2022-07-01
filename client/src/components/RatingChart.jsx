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
        title: {
            display: true,
            text: 'Rating',
        },
        chartAreaBorder: {
            borderColor: "black",
            borderWidth: 2
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
            title: {
                display: true,
                text: "Rating Score"
            },
            suggestedMin: 1000,
            suggestedMax: 2000,
            ticks: {
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
            label: "Rating",
            data: props.user.contest_history.map((c) => c.rating_after),
            borderWidth: 3,
            borderColor: "rgb(237, 194, 64)",
            backgroundColor: "white",
            pointStyle: "circle",
            pointRadius: 5,
            pointBackgroundColor: "rgb(255, 255, 255)",
            pointBorderColor: "rgb(237, 194, 64)",

        }]
    };

    return (
        <div>
            <Line height="150px" data={chartData} options={options} plugins={[chartAreaBorder]} id="myChart" />
        </div>
    );
}

export default RatingChart;
