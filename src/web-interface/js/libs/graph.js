
const width = 150;
const height = 150;
const margin = { top: 15, bottom: 15, left: 15, right: 15 };



function createOrGetSvg() {
    const preCreatedSvg = document.getElementById("container").getElementsByTagName('svg');
    if (preCreatedSvg.length == 0 || preCreatedSvg == undefined) {
        return d3.select("#container")
            .append('svg')
            .attr('height', height)
            .attr('width', width)
            .attr('viewBox', [0, 0, width + margin.bottom + margin.top, height]);
    }
    return d3.select('#container').select('svg');

}



function setAxis(svg) {
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


function displayHistogram(data, ...colors) {
    const svg = createOrGetSvg();

    svg.selectAll("*").remove();
    let x = setAxis(svg);

    let dataValues = [];

    Array.from(colors).forEach(color => {
        dataValues = dataValues.concat(Object.values(data[color]['values']).flat())
    }
    );
    const maxValue = d3.max(dataValues);


    const y = d3.scaleLinear()
        .domain([0, maxValue])
        .range([height - margin.bottom, margin.top]);

    Array.from(colors).forEach(color => {
        svg.append('g')
            .selectAll('rect')
            .data(data[color]['values'])
            .join('rect')
            .attr('x', (d, i) => x(i))
            .attr('y', d => y(d))
            .attr('height', d => y(0) - y(d))
            .attr('width', (width - margin.left - margin.right) / 255)
            .attr('fill', data[color]['css'])
            .attr('id', color)
    });
}

export { displayHistogram };





