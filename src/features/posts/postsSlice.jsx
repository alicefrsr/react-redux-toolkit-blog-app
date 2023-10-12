import {
  createSlice,
  // nanoid,
  createAsyncThunk,
  createSelector,
  createEntityAdapter, // optimisation
} from '@reduxjs/toolkit';
import { sub } from 'date-fns';
import axios from 'axios';

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

// optimisation:
const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

// remote data -- object: state. ==> state.posts
// const initialState = {
//   posts: [],
//   status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
//   error: null,
// };

// optimisation:
const initialState = postsAdapter.getInitialState({
  // posts: [],
  status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
});

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get(POSTS_URL);
  return response.data;
});

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost);
    return response.data;
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async (initialPost) => {
    const { id } = initialPost;
    try {
      const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
      return response.data;
    } catch (err) {
      //return err.message;
      return initialPost; // only for testing Redux!
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (initialPost) => {
    const { id } = initialPost;
    try {
      const response = await axios.delete(`${POSTS_URL}/${id}`);
      if (response?.status === 200) return initialPost;
      return `${response?.status}: ${response?.statusText}`;
    } catch (err) {
      return err.message;
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // postAdded no longer needed since we are using thunks
    // postAdded: {
    //   // postAdded = createSlice automatically generates an action creator fn with the same name
    //   // when we export postAdded, we export this action creator fn
    //   reducer(state, action) {
    //     state.posts.push(action.payload); // immer js allows us to mutate state
    //   },
    //   prepare(title, content, userId) {
    //     return {
    //       payload: {
    //         id: nanoid(),
    //         title,
    //         content,
    //         date: new Date().toISOString(),
    //         userId,
    //         reactions: {
    //           thumbsUp: 0,
    //           thumbsDown: 0,
    //           wow: 0,
    //           funny: 0,
    //           heart: 0,
    //         },
    //       },
    //     };
    //   },
    // },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      // optimisation:
      // const existingPost = state.posts.find((post) => post.id === postId);
      const existingPost = state.entities[postId];
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
  // extra stuff with createAsyncThunk
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Adding date and reactions
        let min = 1;
        const loadedPosts = action.payload.map((post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            thumbsDown: 0,
            wow: 0,
            funny: 0,
            heart: 0,
          };
          return post;
        });

        // Add any fetched posts to the array
        // state.posts = state.posts.concat(loadedPosts);
        // optimisation: the postsAdapter has its own CRUD methods
        postsAdapter.upsertMany(state, loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        // Fix for API post IDs:
        // Creating sortedPosts & assigning the id
        // would be not be needed if the fake API
        // returned accurate new post IDs
        const sortedPosts = state.posts.sort((a, b) => {
          if (a.id > b.id) return 1;
          if (a.id < b.id) return -1;
          return 0;
        });
        action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
        // End fix for fake API post IDs

        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          thumbsDown: 0,
          wow: 0,
          funny: 0,
          heart: 0,
        };
        // console.log(action.payload);
        // optimisation
        // state.posts.push(action.payload);
        postsAdapter.addOne(state, action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log('Update could not complete');
          console.log(action.payload);
          return;
        }
        // optimisation
        // const { id } = action.payload;
        action.payload.date = new Date().toISOString(); // stays!
        // const posts = state.posts.filter((post) => post.id !== id);
        // state.posts = [...posts, action.payload];
        postsAdapter.upsertOne(state, action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log('Delete could not complete');
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        // optimisation
        // const posts = state.posts.filter((post) => post.id !== id);
        // state.posts = posts;
        postsAdapter.removeOne(state, id);
      });
  },
});

// optimisation
// export const selectAllPosts = (state) => state.posts.posts; // replaced
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;

// export const selectPostById = (state, postId) =>
//   state.posts.posts.find((post) => post.id === postId); // replaced

//   // optimisation: replace selectAllPosts and selectPostsByUser:
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  // pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors((state) => state.posts);

// // disabled when creating a memoised selector for PostExcerpts:
export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId)
);

// export const { postAdded, reactionAdded } = postsSlice.actions;
export const { reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
