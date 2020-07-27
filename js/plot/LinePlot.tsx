import React, { useRef, useState } from "react";
import { Colour, ColourMap, colourString } from "../colour/definition";
import { Optional } from "../data";
import { roundFloat } from "../number";
import * as styles from "./LinePlot.styles";

function formatTooltipValue(value?: number, precision: number = 8): string {
  if (value === undefined || value === null) {
    return "-";
  }
  const stringRepr = value.toString();
  const split = stringRepr.split(".");
  // Floats that have more than precision number of digits after the decimal
  // point are truncated.
  if (split.length > 1 && split[1].length > precision) {
    return value.toFixed(precision);
  }
  return stringRepr;
}

function pickLabels(
  uniqueValues: Set<number>,
  num: number = 6,
  forceContinous: boolean = false
): Array<number> {
  const uniqueSorted = [...uniqueValues].sort((a, b) => a - b);
  const labels = [];
  if (!forceContinous && uniqueSorted.every((x) => Number.isInteger(x))) {
    if (uniqueSorted.length <= num) {
      return uniqueSorted;
    } else {
      // The first one is always used
      labels.push(uniqueSorted[0]);
      const remaining = uniqueSorted.length - 2;
      const needed = num - 2;
      // Choose m elements uniformly from n (where n is the number of remaining
      // values, since the first and the last are fixed)
      // Based on https://stackoverflow.com/a/9873804
      for (let i = 0; i < needed; i++) {
        const index =
          i * Math.floor(remaining / needed) +
          Math.floor(remaining / (2 * needed));
        // + 1 because the first element was excluded when calculating the index
        labels.push(uniqueSorted[index + 1]);
      }
      // The last one is always used
      labels.push(uniqueSorted[uniqueSorted.length - 1]);
    }
  } else {
    const min = uniqueSorted[0];
    const max = uniqueSorted[uniqueSorted.length - 1];
    if (min === max) {
      return [min];
    }
    const step = (max - min) / (num - 1);
    for (let i = 0; i < num; i++) {
      labels.push(min + i * step);
    }
  }
  return labels;
}

export type TooltipValues = {
  name: string;
  colour?: Colour;
  value?: number;
};

export type Tooltip = {
  x: number;
  y: Array<TooltipValues>;
};

export type LinePoint = {
  x: number;
  y: number;
};

export type LineData = {
  name: string;
  colour: Colour;
  points: Array<LinePoint>;
};

type Props = {
  data: Array<LineData>;
  colours?: ColourMap;
  numLabels?: number;
  offsetBottom?: number;
  offsetLeft?: number;
  xLength?: number;
  yLength?: number;
  horizontalGuide?: boolean;
  verticalGuide?: boolean;
};

export const LinePlot: React.FC<Props> = ({
  data,
  colours,
  offsetBottom = 10,
  offsetLeft = 20,
  numLabels = 6,
  xLength = 150,
  yLength = 100,
  horizontalGuide = true,
  verticalGuide = false,
}) => {
  const [tooltip, setTooltip] = useState<Optional<Tooltip>>(undefined);
  const [hovered, setHovered] = useState<Optional<string>>(undefined);
  const svgRef = useRef<SVGSVGElement>(null);

  const plotElements = [];
  const uniqueXs: Set<number> = new Set();
  const uniqueYs: Set<number> = new Set();
  const xyMap: Map<number, Array<TooltipValues>> = new Map();
  let minX: number | undefined = undefined;
  let maxX: number | undefined = undefined;
  let minY: number | undefined = undefined;
  let maxY: number | undefined = undefined;
  for (const d of data) {
    for (const { x, y } of d.points) {
      uniqueXs.add(x);
      uniqueYs.add(y);
      const xyEntry = xyMap.get(x);
      const yDetails: TooltipValues = { name: d.name, value: y };
      if (colours !== undefined) {
        yDetails.colour = colours.get(d.name);
      }
      if (xyEntry === undefined) {
        xyMap.set(x, [yDetails]);
      } else {
        xyEntry.push(yDetails);
        // Sort for the tooltips
        xyEntry.sort((a, b) => {
          if (a.value === undefined && b.value === undefined) {
            return 0;
          } else if (a.value === undefined) {
            return -1;
          } else if (b.value === undefined) {
            return 1;
          } else {
            return b.value - a.value;
          }
        });
      }
      if (minX === undefined || x < minX) {
        minX = x;
      }
      if (maxX === undefined || x > maxX) {
        maxX = x;
      }
      if (minY === undefined || y < minY) {
        minY = y;
      }
      if (maxY === undefined || y > maxY) {
        maxY = y;
      }
    }
  }

  let updateTooltip = (_clientX: number, _clientY: number) => {};
  const svgWidth = xLength + offsetLeft + styles.labelSize;
  const svgHeight = yLength;

  // The X axis is usually the steps, hence the labels may be seen as discrete,
  // whereas the Y axis is forced to be continuous.
  const labelsX = pickLabels(uniqueXs, numLabels, false);
  const labelsY = pickLabels(uniqueYs, numLabels, true);
  const labelsXSvg = [];
  const labelsYSvg = [];
  const verticalGuideLines = [];
  const horizontalGuideLines = [];
  if (
    minX !== undefined &&
    maxX !== undefined &&
    minY !== undefined &&
    maxY !== undefined
  ) {
    // If the min and max are the same value, there is only one point on that
    // axis. In order to display it nicely, it is centred.
    const startX = minX === maxX ? minX - minX : minX;
    const startY = minY === maxY ? minY - minY : minY;
    const endX = minX === maxX ? minX + minX : maxX;
    const endY = minY === maxY ? minY + minY : maxY;
    const rangeX = endX - startX;
    const rangeY = endY - startY;
    for (const d of data) {
      // Sort by x to have the data points in order to get a continuous line
      const points = d.points
        .sort((a, b) => a.x - b.x)
        .map(({ x, y }) => {
          // The points are normalised in order to display them in a fixed grid
          // Also the coordinates are upside-down, as the origin of the SVG is
          // at the top left.
          const coordX = xLength * ((x - startX) / rangeX) + offsetLeft;
          const coordY = (yLength - offsetBottom) * (1 - (y - startY) / rangeY);
          return { coordX, coordY };
        });
      if (points.length === 1) {
        const { coordX, coordY } = points[0];
        const colour = colourString(d.colour);
        plotElements.push(
          <circle
            cx={coordX}
            cy={coordY}
            r={1}
            stroke={colour}
            fill={colour}
            className={styles.plotElement}
            key={d.name}
          />
        );
      } else if (points.length >= 2) {
        plotElements.push(
          <polyline
            points={points
              .map(({ coordX, coordY }) => `${coordX},${coordY}`)
              .join(" ")}
            stroke={colourString(d.colour)}
            className={styles.plotElement}
            onMouseEnter={() => {
              setHovered(d.name);
            }}
            onMouseLeave={() => {
              setHovered(undefined);
            }}
            key={d.name}
          />
        );
      }
    }
    for (const labelX of labelsX) {
      const coordX = xLength * ((labelX - startX) / rangeX) + offsetLeft;
      labelsXSvg.push(
        <text
          x={coordX}
          y={yLength - offsetBottom + styles.labelSize + 2}
          key={`label-x-${labelX}`}
        >
          {roundFloat(labelX, 4)}
        </text>
      );
      if (verticalGuide) {
        verticalGuideLines.push(
          <line
            x1={coordX}
            y1={0}
            x2={coordX}
            y2={yLength - offsetBottom}
            className={styles.guide}
            key={`guide-vertical-${labelX}`}
          />
        );
      }
    }
    for (const labelY of labelsY) {
      const coordY =
        (yLength - offsetBottom) * (1 - (labelY - startY) / rangeY);
      labelsYSvg.push(
        <text
          x={offsetLeft - 2}
          // The label is centred based on the font, therefore it needs to be
          // shifted down by labelSize / 2
          y={coordY + styles.labelSize / 2}
          key={`label-y-${labelY}`}
        >
          {roundFloat(labelY, 4)}
        </text>
      );
      if (horizontalGuide) {
        horizontalGuideLines.push(
          <line
            x1={offsetLeft}
            y1={coordY}
            x2={xLength + offsetLeft}
            y2={coordY}
            className={styles.guide}
            key={`guide-horizontal-${labelY}`}
          />
        );
      }
    }
    const xyKeysSorted = [...xyMap.keys()].sort((a, b) => a - b);
    updateTooltip = (clientX: number, clientY: number) => {
      if (svgRef.current !== null && setTooltip !== undefined) {
        const {
          left,
          top,
          width,
          height,
        } = svgRef.current.getBoundingClientRect();
        const x = clientX - left;
        const y = clientY - top;
        const coordX = svgWidth * (x / width);
        // Shifted down by labelSize, since the SVG element starts before the
        // actual coordinate system.
        const coordY = svgHeight * (y / height) - styles.labelSize;
        // Only show update the tooltip if the cursor is in the actual graph
        if (coordX >= offsetLeft && coordY <= svgHeight - offsetBottom) {
          const xValue = ((coordX - offsetLeft) / xLength) * rangeX + startX;
          let xClosest = xyKeysSorted[0];
          let distanceClosest = Math.abs(xValue - xClosest);
          for (let i = 1; i < xyKeysSorted.length; i++) {
            const current = xyKeysSorted[i];
            const distance = Math.abs(xValue - current);
            if (distance <= distanceClosest) {
              xClosest = current;
              distanceClosest = distance;
            } else {
              // The x values are sorted, therefore once the distance starts to
              // increase, it means that the closest value was already seen
              // and the rest can be ignored.
              break;
            }
          }
          // This should never the undefined, since xClosest was among the keys
          // of the hashmap.
          const yValues = xyMap.get(xClosest);
          if (yValues !== undefined) {
            setTooltip({ x: xClosest, y: yValues });
          }
        } else {
          // Outside of the graph, so no tooltip.
          setTooltip(undefined);
        }
      }
    };
  }

  return (
    <div className={styles.container}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 -${styles.labelSize} ${svgWidth} ${svgHeight}`}
        className={styles.svg}
        onMouseMove={(e) => {
          updateTooltip(e.clientX, e.clientY);
        }}
        onMouseLeave={() => {
          if (setTooltip !== undefined) {
            setTooltip(undefined);
          }
        }}
        ref={svgRef}
      >
        <g className={styles.grid}>
          <line
            x1={offsetLeft}
            y1={0}
            x2={offsetLeft}
            y2={yLength - offsetBottom}
            className={styles.axis}
          />
          <line
            x1={offsetLeft}
            y1={yLength - offsetBottom}
            x2={xLength + offsetLeft}
            y2={yLength - offsetBottom}
            className={styles.axis}
          />
          {verticalGuideLines}
          {horizontalGuideLines}
        </g>
        <g className={styles.labelsX}>{labelsXSvg}</g>
        <g className={styles.labelsY}>{labelsYSvg}</g>
        {plotElements}
      </svg>
      <div className={styles.sidebar}>
        {tooltip !== undefined && (
          <div className={styles.tooltip}>
            <div className={styles.tooltipTitle}>Step {tooltip.x}</div>
            <div className={styles.tooltipList}>
              {tooltip.y.map((y) => (
                <div className={styles.tooltipEntry} key={`entry-${y.name}`}>
                  {y.colour && (
                    <span
                      className={styles.tooltipColour}
                      style={{ background: colourString(y.colour) }}
                    />
                  )}
                  <div className={styles.tooltipEntryText}>
                    <span
                      className={
                        y.name === hovered
                          ? styles.tooltipLabelHovered
                          : styles.tooltipLabel
                      }
                    >
                      {y.name}
                    </span>
                    <span
                      className={
                        y.name === hovered
                          ? styles.tooltipValueHovered
                          : styles.tooltipValue
                      }
                    >
                      {formatTooltipValue(y.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
