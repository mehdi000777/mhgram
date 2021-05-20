import React, { useEffect, useState } from 'react'
import CommentCard from './CommentCard'

export default function CommentDisplay({ post, comment, replyCm }) {

    const [showRep, setShowRep] = useState([]);
    const [next, setNext] = useState(1);

    useEffect(() => {
        setShowRep(replyCm.slice(replyCm.length - next));
    }, [replyCm, next])

    return (
        <div className="comment_display">
            <CommentCard post={post} comment={comment} commentId={comment._id}>
                <div className="ps-4">
                    {
                        showRep.map((item, index) => (
                            item.reply &&
                            <CommentCard key={index} post={post} comment={item} commentId={comment._id} />
                        ))
                    }
                    {
                        replyCm.length - next > 0 ?
                            <div className="p-2 border-top" onClick={() => setNext(next + 10)}
                                style={{ cursor: "pointer", color: "crimson" }}>
                                show more Comments....
                            </div>
                            : replyCm.length > 1 &&
                            < div className="p-2 border-top" onClick={() => setNext(1)}
                                style={{ cursor: "pointer", color: "crimson" }}>
                                Hide Comments
                            </div>
                    }
                </div>
            </CommentCard>
        </div>
    )
}
