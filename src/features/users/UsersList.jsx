import { useSelector } from 'react-redux';
import { selectAllUsers } from './usersSlice';
import { Link } from 'react-router-dom';

const UsersList = () => {
  const users = useSelector(selectAllUsers);

  const renderedUsers = users.map((user) => (
    <li key={user.id}>
      <Link className='user-link' to={`/user/${user.id}`}>
        {user.name}
      </Link>
    </li>
  ));

  return (
    <section>
      <h2 className='section-title'>Users</h2>
      <ul>{renderedUsers}</ul>
    </section>
  );
};

export default UsersList;
