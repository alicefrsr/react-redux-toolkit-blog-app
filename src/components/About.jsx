const About = () => {
  return (
    <section>
      <h2 className='section-title'>Notes (to myself)</h2>
      <p>
        <span className='bold'>Fake Blog</span>: learning project built to
        understand how to manage remote data using{' '}
        <span className='purple'>Redux ToolKit</span> in isolation, with React
        and React Router, implementing all CRUD operations: the user can read
        all published posts, add a post, read, update and delete a specific
        post, and add a reaction to each post.
      </p>
      <p>
        The &#39;reactions&#39; buttons provide an opportunity to start using
        the profiler and look at more advanced patterns such as{' '}
        <span className='purple'>optimisation</span> to prevent unnecessary
        renders:
      </p>
      <p>
        1. using memoized selectors, 2. using state normalisation (recommended
        approach in docs for storing data) with <i>createEntityAdapter()</i>
      </p>
      <p className='underline'>To do next:</p>
      <p>
        Implementing{' '}
        <span className='purple'>authentication / authorisation</span> so that
        posts can only be edited / deleted by their (logged in) users
      </p>
    </section>
  );
};

export default About;
