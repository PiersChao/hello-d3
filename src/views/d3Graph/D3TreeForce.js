import D3GraphBase from './Base'

class D3TreeForce extends D3GraphBase {
  constructor(props) {
    super(props)
    const config = {
      width: 954,
      height: 600,
      cRadius: 12, // 子节点圆半径
      pRadius: 3.5 // 父节点圆半径
    }
    this.config = config
    const zoom = this.d3.zoom().scaleExtent([0.5, 40]).on('zoom', this.zoomed.bind(this))
    this.svg = this.d3.create('svg')
      .attr('viewBox', [-config.width / 2, -config.height / 2, config.width, config.height])
      .call(zoom)
    this.mainGroup = this.svg.append('g')
    this.appendArrow(this.mainGroup)
  }
  // 缩放
  zoomed() {
    this.mainGroup.attr('transform', this.d3.event.transform)
  }
  // 渲染
  drawTree(data) {
    const root = this.d3.hierarchy(data)

    const pathGroup = this.mainGroup.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opcity', 0.6)
    const circleGroup = this.mainGroup.append('g')
      .attr('fill', '#fff')
      .attr('stroke', '#000')
      .attr('stroke-width', 1.5)
    const textGroup = this.mainGroup.append('g')
      .attr('font-size', '5')
    const update = () => {
      const links = root.links()
      const nodes = root.descendants()
      const simulation = this.d3.forceSimulation(nodes)
        .force('link', this.d3.forceLink(links).id(d => d.id).distance(10).strength(0.4))
        .force('change', this.d3.forceManyBody().strength(-50))
        .force('collide', this.d3.forceCollide(12).strength(0.5))
        .force('x', this.d3.forceX())
        .force('y', this.d3.forceY())
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
            .attr('r', d => !d.children && !d._children ? this.config.cRadius : this.config.pRadius),
          update => update
            .attr('fill', d => d.children ? '#c6dbef' : (d._children ? '#3082bd' : '#fd8d3c'))
            .attr('stroke', '#3082bd')
            .attr('r', d => !d.children && !d._children ? this.config.cRadius : this.config.pRadius),
          exit => exit.remove()
        )
        .on('click', click)
        .call(this.drag(simulation))
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
        .call(this.drag(simulation))
        .on('mouseover', d => {
          console.log(this.d3.event)
        })
      simulation.on('tick', () => {
        path
          .attr('d', d => {
            const path = this.d3.path()
            path.moveTo(d.source.x, d.source.y)
            path.lineTo(d.target.x, d.target.y)
            return path
          })
          .attr('id', (d, index) => 'path' + index)
        node
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
        circleText
          .attr('x', d => d.children ? d.x + this.config.pRadius : d.x - this.config.cRadius / 2)
          .attr('y', d => d.y)
      })
    }
    const click = d => {
      if (!this.d3.event.defaultPrevented) {
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
    update()
    return this.svg.node()
  }
  // 拖拽
  drag(simulation) {
    const dragstarted = (d) => {
      if (!this.d3.event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    const dragged = (d) => {
      d.fx = this.d3.event.x
      d.fy = this.d3.event.y
    }

    const dragended = (d) => {
      if (!this.d3.event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    return this.d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
  }
}

export default D3TreeForce
