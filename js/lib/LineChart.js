class LineChart {
  constructor (context, x, y, width, height) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  getMinMax(numbers) {
    let max = -Infinity;
    let min = Infinity;

    for (let i = 0; i < numbers.length; i += 1) {
      if (numbers[i] > max) {
        max = numbers[i];
      }
      if (numbers[i] < min) {
        min = numbers[i];
      }
    }

    return { max, min };
  }

  draw(lineData) {
    const { max, min } = this.getMinMax(lineData);
    this.context.strokeStyle = "#000000";
    this.context.moveTo(this.x, this.y + this.height);
    const step = this.width / lineData.length;
    for (let i = 0; i < lineData.length; i += 1) {
      const x = this.x + i * step;
      const y = (lineData[i] - min) / (max - min);
      const transformedY = this.y + this.height - y * this.height;
      this.context.lineTo(x, transformedY);
    }
    this.context.stroke();
    const y = (lineData[lineData.length] - min) / (max - min);
    const transformedY = this.y + this.height - y * this.height;
    this.context.fillText(lineData[lineData.length - 1].toFixed(2), this.x + this.width, transformedY);
  }
}