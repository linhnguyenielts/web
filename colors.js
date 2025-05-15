function showColorsStyle() {
  const colorSpans = document.querySelectorAll('.colors');
  
  colorSpans.forEach(span => {
    // Dynamically set the inline style based on the attribute values
    const fontWeight = span.getAttribute('font-weight');
    const color = span.getAttribute('color');
    
    // Apply the styles
    if (fontWeight) {
      span.style.fontWeight = fontWeight;  // Apply font-weight
    }
    if (color) {
      span.style.color = color;  // Apply color
    }
  });
}
