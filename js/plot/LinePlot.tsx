import React from "react";
import Chart from "react-apexcharts";
import * as styles from "./LinePlot.styles";
import * as icons from "./icons";

function formatAxisValues(value: number): string {
  const stringRepr = value.toString();
  const split = stringRepr.split(".");
  // Floats that have more than 4 digits after the decimal point are
  // trimmed to 4 places.
  if (split.length > 1 && split[1].length > 4) {
    return value.toFixed(4);
  }
  return stringRepr;
}

function formatTooltipValues(value?: number): string {
  if (value === undefined || value === null) {
    return "-";
  }
  return value.toString();
}

export type LineData = {
  name: string;
  data: Array<Array<number | null>>;
};

type Props = {
  data: Array<LineData>;
  colours: Array<string>;
  title: string;
};

export const LinePlot: React.FC<Props> = ({ data, colours, title }) => {
  const options = {
    colors: colours,
    chart: {
      toolbar: {
        show: true,
        tools: {
          download: icons.download,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: icons.resetZoom
        },
        autoSelected: "zoom"
      },
      zoom: {
        enabled: true,
        type: "xy",
        autoScaleYaxis: false,
        zoomedArea: {
          fill: {
            color: "#90CAF9",
            opacity: 0.4
          },
          stroke: {
            color: "#0D47A1",
            opacity: 0.4,
            width: 1
          }
        }
      }
    },
    stroke: {
      show: true,
      curve: "straight",
      lineCap: "butt",
      width: 2,
      dashArray: 0
    },
    markers: {
      hover: {
        size: 0
      }
    },
    xaxis: {
      tooltip: {
        enabled: false
      },
      labels: {
        formatter: formatAxisValues
      },
      crosshairs: {
        show: false
      }
    },
    yaxis: {
      tooltip: {
        enabled: false
      },
      labels: {
        formatter: formatAxisValues
      },
      crosshairs: {
        show: false
      }
    },
    legend: {
      show: false
    },
    tooltip: {
      shared: true,
      marker: {
        show: true
      },
      x: {
        show: true,
        formatter: (n?: number) => `Step ${formatTooltipValues(n)}`
      },
      y: {
        formatter: formatTooltipValues
      },
      style: {
        fontSize: "0.7rem"
      },
      fixed: {
        enabled: true,
        position: "topLeft",
        offsetY: 290
      }
    }
  };

  return (
    <div className={styles.container}>
      <span className={styles.title}>{title}</span>
      <Chart
        options={options}
        series={data}
        type="line"
        width={400}
        height={300}
      />
    </div>
  );
};
