import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <h1>Redux Blog </h1>
      <nav>
        <ul>
          <li>
            <NavLink to='about'>About </NavLink>
          </li>

          <li>
            <NavLink to='/'>Posts</NavLink>
          </li>
          <li>
            <NavLink to='/user'>Users</NavLink>
          </li>
          <li>
            <NavLink to='post'>Add a Post </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
