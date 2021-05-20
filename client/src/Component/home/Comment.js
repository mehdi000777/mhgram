import React, { useEffect, useState } from 'react';
import CommentDisplay from './comments/CommentDisplay';

export default function Comment({ post }) {

    const [comments, setComments] = useState([]);
    const [showComment, setShowComment] = useState([]);
    const [next, setNext] = useState(2);

    const [replyComments, setReplyComments] = useState([]);

    useEffect(() => {
        const newCm = post.comments.filter(item => !item.reply);
        setComments(newCm);
        setShowComment(newCm.slice(newCm.length - next));
    }, [post.comments, next]);

    useEffect(() => {
        const newRep = post.comments.filter(item => item.reply);
        setReplyComments(newRep);
    }, [post.comments]);

    return (
        <div className="comments">
            {
                showComment.map((comment, index) => (
                    <CommentDisplay key={index} comment={comment} post={post}
                        replyCm={replyComments.filter(item => item.reply === comment._id)} />
                ))
            }

            {
                comments.length - next > 0 ?
                    <div className="p-2 border-top" onClick={() => setNext(next + 20)}
                        style={{ cursor: "pointer", color: "crimson" }}>
                        show more Comments....
                    </div>
                    : comments.length > 2 &&
                    < div className="p-2 border-top" onClick={() => setNext(2)}
                        style={{ cursor: "pointer", color: "crimson" }}>
                        Hide Comments
                    </div>
            }
        </div >
    )
}
