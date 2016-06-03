import $ from 'jquery';

// Mouse position in pixels.
export function mousePos(event, targetElement) {
  let $targetElement = $(targetElement);
  let parentX = $targetElement.offset().left;
  let parentY = $targetElement.offset().top;
  return {x: event.pageX - parentX, y: event.pageY - parentY};
}

// Normalized mouse position [-1, 1].
export function mousePosNormalized(event, targetElement) {
  let pos = mousePos(event, targetElement);
  let $targetElement = $(targetElement);
  let parentWidth = $targetElement.width();
  let parentHeight = $targetElement.height();
  pos.x =  (pos.x / parentWidth) * 2 - 1;
  pos.y = -(pos.y / parentHeight) * 2 + 1;
  return pos;
}

// Accepts hash like with rgb values and positions between [0, 1], e.g.:
// {
//   0.1: [120, 120, 120],
//   0.5: [255, 50, 50],
//   0.8: [0, 255, 255]
// }
// Returns a function that accepts value between [0, 1] and returns interpolated color (rgb string).
export function colorInterpolation(colors) {
  const sortedPositions = Object.keys(colors).map(v => parseFloat(v)).sort();
  function rgbToString(rgb) {
    return 'rgb(' + rgb.join(', ') + ')';
  }
  return function(t) {
    let i = 0;
    while (t > sortedPositions[i] && i < sortedPositions.length) {
      i++;
    }
    if (t === sortedPositions[i]) return rgbToString(colors[sortedPositions[i]]);
    const leftIdx = i - 1 >= 0 ? i - 1 : sortedPositions.length - 1;
    const rightIdx = i < sortedPositions.length ? i : 0;
    let leftPos = sortedPositions[leftIdx];
    let rightPos = sortedPositions[rightIdx];
    const leftColor = colors[leftPos];
    const rightColor = colors[rightPos];
    // Special case when t value is between the last and first position.
    if (leftPos > rightPos) {
      rightPos += 1;
    }
    if (t < leftPos) {
      t += 1;
    }
    const ratio = (t - leftPos) / (rightPos - leftPos);
    const result = [];
    for (let j = 0; j < 3; j++) {
      const left = leftColor[j];
      const right = rightColor[j];
      result.push(Math.round(left < right ? left + (right - left) * ratio : left - (left - right) * ratio));
    }
    return rgbToString(result);
  };
}
