import PostAuthor from './PostAuthor';
import TimeAgo from './TimeAgo';
import ReactionButtons from './ReactionButtons';
import { Link } from 'react-router-dom';
// --> Optimisation: one simple way to do it:
// memoize entire component to prevent 100 renders each time we click on 1 reaction btn

// --> Optimisation: different way: state normalisation (recommended approach in docs for storing data) 2.36
import { useSelector } from 'react-redux';
import { selectPostById } from './postsSlice';
// let
// let PostsExcerpt = ({ post }) => {
// const PostsExcerpt = ({ post }) => {
// optimisation with createEntityAdapter now takes in {postId}
const PostsExcerpt = ({ postId }) => {
  // console.log('PostsExcerpt');
  const post = useSelector((state) => selectPostById(state, postId));
  return (
    <article>
      <h2 className='post-title'>{post.title}</h2>
      <p className='excerpt'>{post.body.substring(0, 75)}...</p>
      <p className='postCredit'>
        <Link to={`post/${post.id}`}>View Post</Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactionButtons post={post} />
    </article>
  );
};

// memoisation : will not re-render if the prop { post } it receives does not change
// PostsExcerpt = React.memo(PostsExcerpt);

export default PostsExcerpt;
