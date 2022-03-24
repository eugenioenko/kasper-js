export const DemoSource = `
<div id="top" role="document">
  <header>
    <h3>{{person.name}}</h3>
    <h4>{{person.profession}}</h4>
    <p @if="person.age > 21">Age is greater than 21</p>
    <p @elseif="person.age == 21">Age is equal to 21</p>
    <p @elseif="person.age < 21">Age is less than 21</p>
    <p @else>Age is impossible</p>
  </header>
  <h4>Hobbies ({{person.hobbies.length}}):</h4>
  <ul>
    <li @each="const hobby with index of person.hobbies" class="text-red">
      {{index + 1}}: {{hobby}}
    </li>
  </ul>
  <div>100 + 20 / (10 * (10 -20) + 4) = {{100 + 20 / (10 * (10 -20) + 4)}}</div>
  <div  class="sdf-v-margin">
    <button
      @on:click="alert('Hello World'); console.log(100 / 2.5 + 15)"
    >
      CLICK ME
    </button>
  </div>
</div>
`;

export const DemoJson = `
{
  "person": {
    "name": "John Doe",
    "profession": "Software Developer",
    "age": 20,
    "hobbies": ["reading", "music", "golf"]
  }
}
`;
