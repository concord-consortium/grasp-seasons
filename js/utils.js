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
