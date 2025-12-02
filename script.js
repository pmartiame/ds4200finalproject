// D3 Sunburst Visualization
const data = [
    {"season":"Fall","genre":"Alternative","count":9718},
    {"season":"Fall","genre":"Classical","count":29795},
    {"season":"Fall","genre":"Electronic","count":44337},
    {"season":"Fall","genre":"Folk","count":25860},
    {"season":"Fall","genre":"Hip-Hop","count":70123},
    {"season":"Fall","genre":"Indie","count":69553},
    {"season":"Fall","genre":"Jazz","count":41067},
    {"season":"Fall","genre":"Metal","count":44243},
    {"season":"Fall","genre":"Pop","count":101944},
    {"season":"Fall","genre":"Rock","count":71564},
    {"season":"Spring","genre":"Alternative","count":10518},
    {"season":"Spring","genre":"Classical","count":25517},
    {"season":"Spring","genre":"Electronic","count":46490},
    {"season":"Spring","genre":"Folk","count":21383},
    {"season":"Spring","genre":"Hip-Hop","count":73076},
    {"season":"Spring","genre":"Indie","count":57478},
    {"season":"Spring","genre":"Jazz","count":38032},
    {"season":"Spring","genre":"Metal","count":45932},
    {"season":"Spring","genre":"Pop","count":105582},
    {"season":"Spring","genre":"Rock","count":77613},
    {"season":"Summer","genre":"Alternative","count":10951},
    {"season":"Summer","genre":"Classical","count":23132},
    {"season":"Summer","genre":"Electronic","count":68345},
    {"season":"Summer","genre":"Folk","count":21990},
    {"season":"Summer","genre":"Hip-Hop","count":91040},
    {"season":"Summer","genre":"Indie","count":60052},
    {"season":"Summer","genre":"Jazz","count":37460},
    {"season":"Summer","genre":"Metal","count":49640},
    {"season":"Summer","genre":"Pop","count":132843},
    {"season":"Summer","genre":"Rock","count":81025},
    {"season":"Winter","genre":"Alternative","count":9665},
    {"season":"Winter","genre":"Classical","count":32201},
    {"season":"Winter","genre":"Electronic","count":35035},
    {"season":"Winter","genre":"Folk","count":19722},
    {"season":"Winter","genre":"Hip-Hop","count":58307},
    {"season":"Winter","genre":"Indie","count":52473},
    {"season":"Winter","genre":"Jazz","count":44188},
    {"season":"Winter","genre":"Metal","count":44137},
    {"season":"Winter","genre":"Pop","count":85214},
    {"season":"Winter","genre":"Rock","count":71929}
];

// Process data into hierarchical structure
const hierarchy = {
    name: "Music",
    children: []
};

const seasons = [...new Set(data.map(d => d.season))];
seasons.forEach(season => {
    const seasonData = data.filter(d => d.season === season);
    hierarchy.children.push({
        name: season,
        children: seasonData.map(d => ({
            name: d.genre,
            value: d.count
        }))
    });
});

// Chart dimensions
const width = 700;
const height = 700;
const radius = Math.min(width, height) / 2;

// Color scale
const color = d3.scaleOrdinal()
    .domain(['Winter', 'Spring', 'Summer', 'Fall'])
    .range(['#4A90E2', '#7ED321', '#F5A623', '#D0021B']);

// Create SVG
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width/2},${height/2})`);

// Create hierarchy
const root = d3.hierarchy(hierarchy)
    .sum(d => d.value);

// Create partition layout
const partition = d3.partition()
    .size([2 * Math.PI, radius]);

partition(root);

// Create arc generator
const arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .innerRadius(d => d.y0)
    .outerRadius(d => d.y1);

// Create tooltip
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Draw arcs
svg.selectAll("path")
    .data(root.descendants().filter(d => d.depth > 0))
    .enter()
    .append("path")
    .attr("d", arc)
    .style("fill", d => {
        if (d.depth === 1) return color(d.data.name);
        return d3.color(color(d.parent.data.name)).brighter(0.5);
    })
    .style("stroke", "white")
    .style("stroke-width", 2)
    .style("cursor", "pointer")
    .on("mouseover", function(event, d) {
        d3.select(this)
            .style("opacity", 0.8);

        tooltip.transition()
            .duration(200)
            .style("opacity", 0.9)
            .style("display", "block");

        const label = d.depth === 1 ? d.data.name : 
                      `${d.parent.data.name} - ${d.data.name}`;
        const value = d.value ? d.value.toLocaleString() : "";

        tooltip.html(`${label}<br/>${value} plays`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
        d3.select(this)
            .style("opacity", 1);

        tooltip.transition()
            .duration(500)
            .style("opacity", 0)
            .style("display", "none");
    });

// Add labels for seasons
svg.selectAll("text")
    .data(root.descendants().filter(d => d.depth === 1))
    .enter()
    .append("text")
    .attr("transform", function(d) {
        const angle = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const radius = (d.y0 + d.y1) / 2;
        return `rotate(${angle - 90}) translate(${radius},0) rotate(${angle < 180 ? 0 : 180})`;
    })
    .attr("dy", "0.35em")
    .attr("text-anchor", d => {
        const angle = (d.x0 + d.x1) / 2;
        return angle < Math.PI ? "start" : "end";
    })
    .text(d => d.data.name)
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("fill", "white");

// Center label
svg.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .style("fill", "#333")
    .text("2024");

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});