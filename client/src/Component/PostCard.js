import React from 'react';
import Comment from './home/Comment';
import InputeComment from './home/InputeComment';
import CardBody from './home/Post_Card/CardBody';
import CardFooter from './home/Post_Card/CardFooter';
import CardHeader from './home/Post_Card/CardHeader';

export default function PostCard({ posts }) {
    return (
        <div className="posts">
            {
                posts.map(post => (
                    <div key={post._id} className="card my-3">
                        <CardHeader post={post} />
                        <CardBody post={post} />
                        <CardFooter post={post} />
                        <Comment post={post} />
                        <InputeComment post={post} />
                    </div>
                ))
            }
        </div>
    )
}
