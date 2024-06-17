import { Component } from "solid-js";
import * as d3 from "d3";

export const PlotWithOffset: Component = () => {
    var count = 0;

    function uid(name) {
        return new Id("O-" + (name == null ? "" : name + "-") + ++count);
    }

    function Id(id) {
        const loc = document.location;
        this.id = id;
        this.href = new URL(`#${id}`, loc.toString()) + "";
    }

    Id.prototype.toString = function () {
        return "url(" + this.href + ")";
    };

    const width = 928;
    const height = 500;
    const marginTop = 20;
    const marginRight = 30;
    const marginBottom = 30;
    const marginLeft = 40;
    let temperatures = [];
    for (let index = 0; index < 100; index++) {
        var d = new Date();
        d.setDate(d.getDate() + index);
        temperatures.push({
            date: d,
            temperature: Math.random(),
        });
    }

    const x = d3
        .scaleUtc()
        .domain(d3.extent(temperatures, (d) => d.date))
        .range([marginLeft, width - marginRight]);

    const y = d3
        .scaleLinear()
        .domain(d3.extent(temperatures, (d) => d.temperature))
        .nice()
        .range([height - marginBottom, marginTop]);

    const line = d3
        .line()
        .curve(d3.curveStep)
        .defined((d) => !isNaN(d.temperature))
        .x((d) => x(d.date))
        .y((d) => y(d.temperature));

    const threshold = d3.median(temperatures, (d) => d.temperature);

    const svg = d3
        .create("svg")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height)
        .attr("style", "max-width: 100%; height: auto;");

    const gradient = uid("context");

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(
            d3
                .axisBottom(x)
                .ticks(width / 80)
                .tickSizeOuter(0)
        )
        .call((g) => g.select(".domain").remove());

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
            g
                .select(".tick:last-of-type text")
                .clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text("°F")
        );

    svg.append("linearGradient")
        .attr("id", gradient.id)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", height)
        .selectAll("stop")
        .data([
            { offset: y(threshold) / height, color: "red" },
            { offset: y(threshold) / height, color: "black" },
        ])
        .join("stop")
        .attr("offset", (d) => d.offset)
        .attr("stop-color", (d) => d.color);

    svg.append("path")
        .datum(temperatures)
        .attr("fill", "none")
        .attr("stroke", gradient)
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

    return <div>{svg.node()}</div>;
};
