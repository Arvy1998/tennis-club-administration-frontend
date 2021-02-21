import React, { Component } from 'react';
import PostList from './PostList.jsx';

class App extends Component {
    constructor() {
        super();
        this.state = {
            posts: [],
        };
    }

    componentDidMount() {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(res => {
                res.json()
                    .then(posts => {
                        console.log({ posts });
                        this.setState({ posts });
                    });
            });
    }

    render() {
        console.log({ x: this.state });
        return (
            <div>
                <PostList posts={this.state.posts} />
            </div>
        );
    }
}

export default App;