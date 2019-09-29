
class NeuralNetworkViewer {

  constructor(canvasId) {
    this.canvasId = canvasId;
    this.canvas = document.getElementById(this.canvasId);
    this.context = this.canvas.getContext("2d");
    this.population = new Population(Settings.populationSize);
    this.lineChart = new LineChart(this.context, 0, 200, this.canvas.width , 100);
    this.fitnesses = [];
    this.trainingOnes = mnist[1].range(0, 99);
    this.testOnes = mnist[1].range(100, 200);
    this.trainingTwos = mnist[2].range(0, 99);
    this.testTwos = mnist[2].range(100, 200);
    this.trainingThrees = mnist[3].range(0, 99);
    this.testThrees = mnist[3].range(100, 200);
  }

  start() {
    let generation = 0;
    const loop = () => {
      this.generation();
      generation += 1;
      if (generation < Settings.generations) {
        setTimeout(loop, 1);
      } else {
        console.log("done");
        console.log(this.getAccuracy());
      }
    }
    console.log(this.getAccuracy());
    loop();
  }

  generation() {
    const newIndividuals = [];
    this.population.individuals.forEach(individual => {
      individual.fitness = 0;
      for (let i = 0; i < this.trainingOnes.length; i += 1) {
        const output = individual.neuralNetwork.getOutput(this.trainingOnes[i]);
        if (output[0] < -0.33) {
          individual.fitness += 1;
        }
      }
      for (let i = 0; i < this.trainingTwos.length; i += 1) {
        const output = individual.neuralNetwork.getOutput(this.trainingTwos[i]);
        if (output[0] >= -0.33 < 0.33) {
          individual.fitness += 1;
        }
      }
      for (let i = 0; i < this.trainingThrees.length; i += 1) {
        const output = individual.neuralNetwork.getOutput(this.trainingThrees[i]);
        if (output[0] > 0.33) {
          individual.fitness += 1;
        }
      }
    });
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.population.individuals.sort((a, b) => a.fitness < b.fitness ? 1 : -1);
    const fittestIndividual = this.population.individuals[0];
    const misses = [];
    for (let i = 0; i < this.trainingOnes.length; i += 1) {
      const output = fittestIndividual.neuralNetwork.getOutput(this.trainingOnes[i]);
      if (output[0] >= 0.33) {
        misses.push(this.trainingOnes[i]);
      }
    }
    for (let i = 0; i < this.trainingTwos.length; i += 1) {
      const output = fittestIndividual.neuralNetwork.getOutput(this.trainingTwos[i]);
      if ((output[0] < -0.33) || output[0] > 0.33) {
        misses.push(this.trainingTwos[i]);
      }
    }
    for (let i = 0; i < this.trainingThrees.length; i += 1) {
      const output = fittestIndividual.neuralNetwork.getOutput(this.trainingThrees[i]);
      if (output[0] < 0.33) {
        misses.push(this.trainingThrees[i]);
      }
    }
    for (let i = 0; i < misses.length; i += 1) {
      mnist.draw(misses[i], this.context, i * 24, 0);
    }
    fittestIndividual.neuralNetwork.draw(this.context);
    this.fitnesses.push(fittestIndividual.fitness);
    this.lineChart.draw(this.fitnesses);
    for (let i = 0; i < Settings.populationSize; i += 1) {
      const individual1 = this.selectIndividual();
      const individual2 = this.selectIndividual();
      const newIndividual = this.breed(individual1, individual2);
      newIndividuals.push(newIndividual);
    }
    this.population.individuals = newIndividuals;
  }

  getAccuracy() {
    const neuralNetwork = this.population.individuals[0].neuralNetwork;
    let numCorrect = 0;
    const totalTests = this.testOnes.length + this.testTwos.length + this.testThrees.length;

    for (let i = 0; i < this.testOnes.length; i += 1) {
      const output = neuralNetwork.getOutput(this.testOnes[i]);
      if (output <= -0.33) {
        numCorrect += 1;
      }
    }
    for (let i = 0; i < this.testTwos.length; i += 1) {
      const output = neuralNetwork.getOutput(this.testTwos[i]);
      if (output > -0.33 < 0.33) {
        numCorrect += 1;
      }
    }
    for (let i = 0; i < this.testThrees.length; i += 1) {
      const output = neuralNetwork.getOutput(this.testThrees[i]);
      if (output > 0.33) {
        numCorrect += 1;
      }
    }
    return numCorrect / totalTests;
  }

  breed(individual1, individual2) {
    const weights1 = individual1.neuralNetwork.getWeights();
    const weights2 = individual2.neuralNetwork.getWeights();
    const crossoverPoint = Math.round(Math.random() * weights1);
    const newWeights = [ ...weights1.slice(0, crossoverPoint), ...weights2.slice(crossoverPoint) ];
    const numWeightsToMutate = Math.floor(Settings.mutationFactor * newWeights.length);
    for (let i = 0; i < numWeightsToMutate; i += 1) {
      const weightToMutate = Math.floor(Math.random() * newWeights.length);
      newWeights[weightToMutate] += Math.random() * 2 - 1;
    }
    const newIndividual = new Individual();
    newIndividual.neuralNetwork.setWeights(newWeights);
    return newIndividual;
  }

  selectIndividual() {
    const index = Math.floor(Math.random() * Math.random() * Settings.populationSize);
    return this.population.individuals[index];
  }
  

}
