const state = [];
let globalIndex = 0;
console.log(kasper);

function useState(initialState) {
  const localIndex = globalIndex;
  if (typeof state[localIndex] === "undefined")
    state[localIndex] = initialState;

  globalIndex += 1;
  return [state[localIndex], (newState) => (state[localIndex] = newState)];
}

function renderz(component) {
  component();
  globalIndex = 0;
}

function ComponentA() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Abc");

  console.log(count);
  console.log(name);
  setCount(count + 1);
  setName(name + name);
}

function ComponentB() {
  const [count, setCount] = useState(100);
  const [name, setName] = useState("Xyz");

  console.log(count);
  console.log(name);
  setCount(count + 1);
  setName(name + name);
}
/*
render(ComponentA);
render(ComponentB);
render(ComponentA);
render(ComponentB);
*/
