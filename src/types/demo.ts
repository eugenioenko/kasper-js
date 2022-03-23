export const DemoSource = `
<div id="top" role="document">
  <header>
    <h1>{{person.name}}</h1>
    <h3>{{person.profession}}</h3>
  </header>
  <nav>
    <ul>
      <li each="hobby of person.hobbies">
        {{hobby}}
      </li>
    </ul>
  </nav>
</div>
`;

export const DemoJson = `
{
  "person": {
    "name": "First Name Last Name",
    "profession": "Software Developer"
  }
}
`;
