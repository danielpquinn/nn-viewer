class Population {
  constructor(size) {
    this.size = size;
    this.individuals = [];
    for (let i = 0; i < this.size; i += 1) {
      this.individuals.push(new Individual());
    }
  }
}
