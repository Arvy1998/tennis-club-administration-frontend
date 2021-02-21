import React from 'react';

const post = ({post: {title, body}}) => {
  return (
    <div>
      <p>{title}</p>
      <p>{body}</p>
    </div >
  );
}

export default post;