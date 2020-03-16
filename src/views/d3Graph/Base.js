import * as d3 from 'd3'

const arrowPath = 'M2,2 L10,6 L2,10 L4,6 L2,2'
class D3GraphBase {
  constructor() {
    this.d3 = d3
  }
  // 添加箭头
  appendArrow(node) {
    const g = node.append('g')
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
    return g
  }
}

export default D3GraphBase
