
const width = 300;
const height = 300;
const margin = { top: 50, bottom: 50, left: 50, right: 50 };

const svg = d3.select("#container")
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .attr('viewBox', [0, 0, width, height]);


function setAxis() {
    const x = d3.scaleLinear()
        .domain([0, 255])
        .range([margin.left, width - margin.right]);

    svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x)
            .tickValues(d3.range(0, 256, 50))
            .tickFormat(d => d));
    return x;
}


function displayHistogram(data) {
    svg.selectAll("*").remove();
    let x = setAxis();

    const maxValue = d3.max([
        Object.values(data.red['values']).flat(),
        Object.values(data.green['values']).flat(),
        Object.values(data.blue['values']).flat()
    ].flat());

    const y = d3.scaleLinear()
        .domain([0, maxValue])
        .range([height - margin.bottom, margin.top]);

    Object.keys(data).forEach(item => {
        svg.append('g')
            .selectAll('rect')
            .data(data[item]['values'])
            .join('rect')
            .attr('x', (d, i) => x(i))
            .attr('y', d => y(d))
            .attr('height', d => y(0) - y(d))
            .attr('width', (width - margin.left - margin.right) / 255)
            .attr('fill', data[item]['css'])
            .attr('id', item)
    });
}

export { displayHistogram };





