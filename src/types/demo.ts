export const DemoSource = `
<div id="top" role="document">
  <header>
    <h3>{{person.name}}</h3>
    <h4>{{person.profession}}</h4>
  </header>
  <nav>
    <ul>
      <li @each="const hobby with index of person.hobbies" class="text-red">
        {{index + 1}}: {{hobby}}
      </li>
    </ul>
  </nav>
</div>
`;

export const DemoJson = `
{
  "person": {
    "name": "John Doe",
    "profession": "Software Developer",
    "hobbies": ["reading", "music", "golf"]
  }
}
`;
