class NeuralNetwork {

  constructor(numberOfInputs, numberOfLayers, numberOfNeuronsPerLayer, numberOfOutputs) {
    this.layers = [];
    this.numberOfInputs = numberOfInputs;
    this.numberOfLayers = numberOfLayers;
    this.numberOfNeuronsPerLayer = numberOfNeuronsPerLayer;
    this.numberOfOutputs = numberOfOutputs;
    this.initialize();
  }

  initialize() {
    const maxHeight = Math.max(this.numberOfInputs, this.numberOfNeuronsPerLayer, this.numberOfOutputs) * Settings.neuronSpacing;
    const inputLayerOffsetY = (maxHeight - this.numberOfInputs * Settings.neuronSpacing) / 2;
    const layerOffsetY = (maxHeight - this.numberOfNeuronsPerLayer * Settings.neuronSpacing) / 2;
    const outputLayerOffsetY = (maxHeight - this.numberOfOutputs * Settings.neuronSpacing) / 2;

    const inputLayer = new Layer();
    inputLayer.bias = Math.random() * 2 - 1;
    this.layers.push(inputLayer);
    for (let neuronIndex = 0; neuronIndex < this.numberOfInputs; neuronIndex += 1) {
      inputLayer.addNeuron(new Neuron(Settings.activationFunction, inputLayer.bias, 0, neuronIndex * Settings.neuronSpacing + inputLayerOffsetY));
    }

    // Layers
    for (let layerIndex = 1; layerIndex < this.numberOfLayers + 1; layerIndex += 1) {
      const layer = new Layer();
      layer.bias = Math.random() * 2 - 1;
      for (let neuronIndex = 0; neuronIndex < this.numberOfNeuronsPerLayer; neuronIndex += 1) {
        layer.addNeuron(new Neuron(Settings.activationFunction, layer.bias, layerIndex * Settings.neuronSpacing, neuronIndex * Settings.neuronSpacing + layerOffsetY));
      }
      this.layers.push(layer);
      this.connectLayers(this.layers[this.layers.length - 1], this.layers[this.layers.length - 2]);
    }

    const outputLayer = new Layer();
    outputLayer.bias = Math.random() * 2 - 1;
    for (let neuronIndex = 0; neuronIndex < this.numberOfOutputs; neuronIndex += 1) {
      outputLayer.addNeuron(new Neuron(Settings.outputActivationFunction, outputLayer.bias, (this.numberOfLayers + 1) * Settings.neuronSpacing, neuronIndex * Settings.neuronSpacing + outputLayerOffsetY));
    }
    this.layers.push(outputLayer);
    this.connectLayers(outputLayer, this.layers[this.layers.length - 2]);
  }

  connectLayers(layer1, layer2) {
    for (let neuronIndex = 0; neuronIndex < layer1.neurons.length; neuronIndex += 1) {
      const neuron = layer1.neurons[neuronIndex];
      for (let otherNeuronIndex = 0; otherNeuronIndex < layer2.neurons.length; otherNeuronIndex += 1) {
        const otherNeuron = layer2.neurons[otherNeuronIndex];
        neuron.addConnection(otherNeuron);
      }
    }
  }

  getOutput(inputs) {
    for (let i = 0; i < inputs.length; i += 1) {
      this.layers[0].neurons[i].output = inputs[i];
    }
    for (let i = 1; i < this.layers.length; i += 1) {
      this.layers[i].neurons.forEach(n => n.updateOutput());
    }
    return this.layers[this.layers.length - 1].neurons.map(n => n.output);
  }

  draw(context) {
    for (let i = 0; i < this.layers.length; i += 1) {
      for (let j = 0; j < this.layers[i].neurons.length; j += 1) {
        const top = 30;
        const neuron = this.layers[i].neurons[j];
        context.strokeStyle = "#000000";
        context.beginPath();
        context.arc(neuron.x, neuron.y + top, Settings.neuronSize / 2, 0, Math.PI * 2);
        context.stroke();
        for (let k = 0; k < neuron.connections.length; k += 1) {
          const connection = neuron.connections[k];
          const otherNeuron = connection.neuron;
          const color = Math.round((connection.weight + 1) / 2 * 256).toString(16);
          context.strokeStyle = `#${color}${color}${color}`;
          context.beginPath();
          context.moveTo(neuron.x, neuron.y + top);
          context.lineTo(otherNeuron.x, otherNeuron.y + top);
          context.stroke();
        }
        context.strokeStyle = "#000000";
        context.fillText(neuron.output.toFixed(2), neuron.x, neuron.y + top - Settings.neuronSize);
      }
    }
  }

  getWeights() {
    const weights = [];
    for (let i = 0; i < this.layers.length; i += 1) {
      const layer = this.layers[i];
      for (let j = 0; j < layer.neurons.length; j += 1) {
        const neuron = layer.neurons[j];
        for (let k = 0; k < neuron.connections.length; k += 1) {
          const connection = neuron.connections[k];
          weights.push(connection.weight);
        }
      }
    }
    return weights;
  }

  setWeights(weights) {
    let currentWeight = 0;
    for (let i = 0; i < this.layers.length; i += 1) {
      const layer = this.layers[i];
      for (let j = 0; j < layer.neurons.length; j += 1) {
        const neuron = layer.neurons[j];
        for (let k = 0; k < neuron.connections.length; k += 1) {
          const connection = neuron.connections[k];
          connection.weight = weights[currentWeight];
          currentWeight += 1;
        }
      }
    }
  }
}
