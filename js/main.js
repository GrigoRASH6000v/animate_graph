import Graph from "./graph.js";
import { coordinates1, coordinates2 } from "./coordinates.js";

const clickHandler = (e) => {
  graph.render(coordinates2);
};

const graph = new Graph("#canvas", clickHandler, 750, 430);

graph.init();
graph.render(coordinates1);
