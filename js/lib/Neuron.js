class Neuron {

  constructor(activationFunction, bias, x, y) {
    this.activationFunction = activationFunction;
    this.bias = bias;
    this.x = x;
    this.y = y;
    this.connections = [];
    this.output = 0;
  }

  sigmoid(input) {
    return (1 / (1 + Math.pow(Math.E + Settings.sigmoidSteepness, -input))) * 2 - 1;
  }

  relu(input) {
    return Math.max(0, input);
  }

  addConnection(neuron) {
    this.connections.push(new Connection(neuron));
  }

  updateOutput() {
    let sum = 0;
    for (let connectionIndex = 0; connectionIndex < this.connections.length; connectionIndex += 1) {
      const connection = this.connections[connectionIndex];
      sum += connection.neuron.output * connection.weight;
    }
    // sum += this.bias;
    switch (this.activationFunction) {
      case "sigmoid":
        this.output = this.sigmoid(sum);
        break;
      default:
        this.output = this.relu(sum);
        break;
    }
  }
}
