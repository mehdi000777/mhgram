import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { imageShowe, videoShowe } from '../../Utils/mediaShow';

export default function PostThumb({ posts, result }) {

    const theme = useSelector(state => state.theme);

    if (result === 0) return <h2 className="text-center text-danger">No Post</h2>

    return (
        <div className="post_thumb">
            {
                posts.map(post => (
                    <Link key={post._id} to={`/post/${post._id}`} >
                        <div className="post_thumb_display">
                            {
                                post.images[0].url.match(/video/i)
                                    ? videoShowe(post.images[0].url, theme)
                                    : imageShowe(post.images[0].url, theme)
                            }
                            <div className="post_thumb_menu">
                                <i className="far fa-heart">{post.likes.length}</i>
                                <i className="far fa-comment">{post.comments.length}</i>
                            </div>
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}
