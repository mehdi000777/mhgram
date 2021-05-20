import React from 'react'
import LeftSide from '../../Component/message/LeftSide'
import RightSide from '../../Component/message/RightSide'

export default function Conversation() {
    return (
        <div className="message d-flex">
            <div className="col-md-4 border-end px-0 left_mess">
                <LeftSide />
            </div>

            <div className="col-md-8 px-0 right_conversation">
                <RightSide />
            </div>
        </div>
    )
}
