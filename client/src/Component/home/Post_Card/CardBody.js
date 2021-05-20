import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Carousel from './Carousel';

export default function CardBody({ post }) {

    const [readMore, setReadMore] = useState(false);

    const theme = useSelector(state => state.theme);

    return (
        <div className="card_body">
            <div className="body_content"
                style={{
                    filter: theme ? "invert(1)" : "invert(0)",
                    color: theme ? "#fff" : "#000"
                }}>
                <span>
                    {
                        post.content.length < 60 ? post.content :
                            readMore ? post.content + "  " : post.content.slice(0, 60) + "......"
                    }
                </span>
                <span className="readMore" onClick={() => setReadMore(!readMore)}>
                    {
                        post.content.length > 60 ? readMore ? "Hide content" : "Read more" : ""
                    }
                </span>
            </div>
            {
                post.images.length > 0 && <Carousel images={post.images} id={post._id} />
            }
        </div>
    )
}
