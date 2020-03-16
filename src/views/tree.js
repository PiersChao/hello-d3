/* eslint-disable indent */
/* eslint-disable handle-callback-err */
/* eslint-disable no-unused-vars */
import * as d3 from 'd3'
import data from './data.json'

const config = {
    width: 954,
    height: 600,
    cRadius: 12, // 子节点圆半径
    pRadius: 3.5 // 父节点圆半径
}
const { cRadius, pRadius } = config
// 定义svg 和 箭头
const arrowPath = 'M2,2 L10,6 L2,10 L4,6 L2,2'
const zoom = d3.zoom().scaleExtent([0.5, 40]).on('zoom', zoomed)
const svg = d3.create('svg')
    .attr('viewBox', [-config.width / 2, -config.height / 2, config.width, config.height])
    .call(zoom)
const g = svg.append('g')
g.append('marker')
    .attr('id', 'arrow')
    .attr('markerUnits', 'strokeWidth')
    .attr('markerWidth', '7')
    .attr('markerHeight', '7')
    .attr('viewBox', '0 0 12 12')
    .attr('refX', '-4.5')
    .attr('refY', '6')
    .attr('orient', 'auto')
    .append('path')
    .attr('d', arrowPath)
    .attr('fill', '#999')
    .attr('transform', 'rotate(180,6,6)')
const drawTree = () => {
    const root = d3.hierarchy(data)

    const pathGroup = g.append('g')
        .attr('stroke', '#999')
        .attr('stroke-opcity', 0.6)
    const circleGroup = g.append('g')
        .attr('fill', '#fff')
        .attr('stroke', '#000')
        .attr('stroke-width', 1.5)
    const textGroup = g.append('g')
        .attr('font-size', '5')

    update()
    function update() {
        const links = root.links()
        const nodes = root.descendants()
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(10).strength(0.4))
            .force('change', d3.forceManyBody().strength(-50))
            .force('collide', d3.forceCollide(12).strength(0.5))
            .force('x', d3.forceX())
            .force('y', d3.forceY())
        const path = pathGroup
            .selectAll('path')
            .data(links)
            .join('path')
            .attr('marker-start', 'url(#arrow)')
        const node = circleGroup
            .selectAll('circle')
            .data(nodes)
            .join(
                enter => enter
                    .append('circle')
                    .style('cursor', 'pointer')
                    .attr('fill', d => d.children ? '#c6dbef' : (d._children ? '#3082bd' : '#fd8d3c'))
                    .attr('stroke', '#3082bd')
                    .attr('r', d => !d.children && !d._children ? cRadius : pRadius),
                update => update
                    .attr('fill', d => d.children ? '#c6dbef' : (d._children ? '#3082bd' : '#fd8d3c'))
                    .attr('stroke', '#3082bd')
                    .attr('r', d => !d.children && !d._children ? cRadius : pRadius),
                exit => exit.remove()
            )
            .on('click', click)
            .call(drag(simulation))
        node.append('title')
            .attr('fill', 'red')
            .attr('font-size', '20')
            .text(d => d.data.name)
        const circleText = textGroup
            .selectAll('text')
            .data(nodes)
            .join('text')
            .style('cursor', 'pointer')
            .attr('fill', d => (!!d.children || !!d._children) ? 'blue' : '#000')
            .text(d => d.data.name)
            .call(drag(simulation))
            .on('mouseover', d => {
                console.log(d3.event)
            })
        simulation.on('tick', () => {
            path
                .attr('d', d => {
                    const path = d3.path()
                    path.moveTo(d.source.x, d.source.y)
                    path.lineTo(d.target.x, d.target.y)
                    return path
                })
                .attr('id', (d, index) => 'path' + index)
            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
            circleText
                .attr('x', d => d.children ? d.x + pRadius : d.x - cRadius / 2)
                .attr('y', d => d.y)
        })
    }

    function click(d, i) {
        if (!d3.event.defaultPrevented) {
            if (d.children) {
                d._children = d.children
                d.children = undefined
            } else {
                d.children = d._children
                d._children = undefined
            }
        }
        update()
    }
}

function drag(simulation) {
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
    }

    function dragged(d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0)
        d.fx = null
        d.fy = null
    }

    return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
}

function zoomed(transform) {
    g.attr('transform', d3.event.transform)
}
drawTree()

export default svg.node()
