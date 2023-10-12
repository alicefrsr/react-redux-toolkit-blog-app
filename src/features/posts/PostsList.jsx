import { useSelector } from 'react-redux';
// import { selectAllPosts, getPostsStatus, getPostsError } from './postsSlice';
// optimisation:
import { selectPostIds, getPostsStatus, getPostsError } from './postsSlice';
import PostsExcerpt from './PostsExcerpt';

const PostsList = () => {
  // console.log('PostsList');

  // const posts = useSelector(selectAllPosts);
  const orderedPostIds = useSelector(selectPostIds);

  const postStatus = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);

  let content;
  if (postStatus === 'loading') {
    content = <p>&#34;Loading...&#34;</p>;
  } else if (postStatus === 'succeeded') {
    // const orderedPosts = posts
    //   .slice()
    //   .sort((a, b) => b.date.localeCompare(a.date));
    // content = orderedPosts.map((post) => (
    //   <PostsExcerpt key={post.id} post={post} />
    // )); // --> doing this in the createEntityAdapter

    content = orderedPostIds.map((postId) => (
      <PostsExcerpt key={postId} postId={postId} />
    ));
  } else if (postStatus === 'failed') {
    content = <p>{error}</p>;
  }

  return <section>{content}</section>;
};
export default PostsList;
