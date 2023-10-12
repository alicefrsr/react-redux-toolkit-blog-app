import { useSelector } from 'react-redux';
import { selectUserById } from './usersSlice';
import { selectPostsByUser } from '../posts/postsSlice';
import { Link, useParams } from 'react-router-dom';

const UserPage = () => {
  const { userId } = useParams();
  const user = useSelector((state) => selectUserById(state, Number(userId)));

  //   const postsForUser = useSelector((state) => {
  // const allPosts = selectAllPosts(state);
  // return allPosts.filter((post) => post.userId === Number(userId));
  //   });
  // --> Optimisation: pb with filter is that useSelector will run every time an action is dispatched, and filter returns a new array every time, which triggers unnecessary renders. Solution: we can create a memoized selector 'selectPostsByUser' with  createSelector
  const postsForUser = useSelector((state) =>
    selectPostsByUser(state, Number(userId))
  );

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link className='post-link' to={`/post/${post.id}`}>
        {post.title}
      </Link>
    </li>
  ));

  return (
    <section>
      <h2 className='section-title'>{user?.name}</h2>

      <ol>{postTitles}</ol>
    </section>
  );
};

export default UserPage;
