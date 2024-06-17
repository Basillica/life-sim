import { Component } from "solid-js";
import * as d3 from "d3";

export const PolarClock: Component = () => {
    const width = 1628;
    const height = 1400;
    const radius = 600;
    const dotRadius = 15;
    const color = d3.scaleSequential([0, 2 * Math.PI], d3.interpolateRainbow);
    const fields = [
        {
            radius: 0.2 * radius,
            interval: d3.timeYear,
            subinterval: d3.timeMonth,
            format: d3.timeFormat("%b"),
            cycle: 0,
            index: 0,
        },
        {
            radius: 0.3 * radius,
            interval: d3.timeMonth,
            subinterval: d3.timeDay,
            format: d3.timeFormat("%d"),
            cycle: 0,
            index: 1,
        },
        {
            radius: 0.4 * radius,
            interval: d3.timeWeek,
            subinterval: d3.timeDay,
            format: d3.timeFormat("%a"),
            cycle: 0,
            index: 2,
        },
        {
            radius: 0.6 * radius,
            interval: d3.timeDay,
            subinterval: d3.timeHour,
            format: d3.timeFormat("%H"),
            cycle: 0,
            index: 3,
        },
        {
            radius: 0.7 * radius,
            interval: d3.timeHour,
            subinterval: d3.timeMinute,
            format: d3.timeFormat("%M"),
            cycle: 0,
            index: 4,
        },
        {
            radius: 0.8 * radius,
            interval: d3.timeMinute,
            subinterval: d3.timeSecond,
            format: d3.timeFormat("%S"),
            cycle: 0,
            index: 5,
        },
    ];

    const svg = d3
        .create("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("text-anchor", "middle")
        .style("display", "block")
        .style("font", "500 14px var(--sans-serif)");

    const field = svg
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .selectAll("g")
        .data(fields)
        .join("g");

    field
        .append("circle")
        .attr("fill", "none")
        .attr("stroke", "currentColor")
        .attr("stroke-width", 1.5)
        .attr("r", (d) => d.radius);

    const fieldTick = field
        .selectAll("g")
        .data((d) => {
            const date = d.interval(new Date(2000, 0, 1));
            d.range = d.subinterval.range(date, d.interval.offset(date, 1));
            return d.range.map((t) => ({ time: t, field: d }));
        })
        .join("g")
        .attr("class", "field-tick")
        .attr("transform", (d, i) => {
            const angle = (i / d.field.range.length) * 2 * Math.PI - Math.PI / 2;
            return `translate(${Math.cos(angle) * d.field.radius},${Math.sin(angle) * d.field.radius})`;
        });

    const fieldCircle = fieldTick
        .append("circle")
        .attr("r", dotRadius)
        .attr("fill", "white")
        .style("color", (d, i) => color((i / d.field.range.length) * 2 * Math.PI))
        .style("transition", "fill 750ms ease-out");

    fieldTick
        .append("text")
        .attr("dy", "0.35em")
        .attr("fill", "#222")
        .text((d) => d.field.format(d.time).slice(0, 2));

    const fieldFocus = field
        .append("circle")
        .attr("r", dotRadius)
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-width", 3)
        .attr("cy", (d) => -d.radius)
        .style("transition", "transform 500ms ease");

    setInterval(() => {
        update(Math.floor((Date.now() + 1) / 1000) * 1000);
    }, 10);

    function update(then) {
        for (const d of fields) {
            const start = d.interval(then);
            const index = d.subinterval.count(start, then);
            d.cycle = d.cycle || 0; // + (index < d.index);
            d.index = index;
        }
        fieldCircle.attr("fill", (d, i) => (i === d.field.index ? "currentColor" : "white"));
        fieldFocus.attr("transform", (d) => `rotate(${(d.index / d.range.length + d.cycle) * 360})`);
        return svg.node();
    }

    return <div style={""}>{svg.node()}</div>;
};
