import React from 'react';
import { map } from 'lodash';
import Post from './Post.jsx';

const PostList = ({posts}) => (
  <div>
    {map(posts, post => <Post key={post.id} post={post} />)}
  </div>
);

export default PostList;