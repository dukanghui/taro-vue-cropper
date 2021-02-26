export default function getStyle(style, filter = []) {
  const noNeedUnit = ['color', 'backgroundColor', 'textAlign', 'opacity', 'fontWeight', 'borderColor'] // 'lineHeight',
  const result = {}
  Object.keys(style).forEach(key => {
    if (!filter.includes(key)) {
      if (key === 'rotate') {
        result.transform = key + '(' + style[key] + 'deg)'
      } else if (key === 'font') {
        result['font-family'] = style[key]
      } else {
        result[key] = style[key]
        if (!noNeedUnit.includes(key)) {
          result[key] += 'px'
        }
      }
    }
  })
  return result
}
