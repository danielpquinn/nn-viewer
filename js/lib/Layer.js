class Layer {
  constructor() {
    this.bias = 0;
    this.neurons = [];
  }

  addNeuron(neuron) {
    this.neurons.push(neuron);
  }
}