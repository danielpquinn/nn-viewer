class Individual {

  constructor() {
    this.fitness = 0;
    this.neuralNetwork = new NeuralNetwork(
      Settings.numberOfInputs,
      Settings.numberOfLayers,
      Settings.numberOfNeuronsPerLayer,
      Settings.numberOfOutPuts
    );
  }
}
