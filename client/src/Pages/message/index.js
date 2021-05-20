import React from 'react'
import LeftSide from '../../Component/message/LeftSide'

export default function Message() {
    return (
        <div className="message d-flex">
            <div className="col-md-4 border-end px-0 left_messanger">
                <LeftSide />
            </div>

            <div className="col-md-8 px-0 right_mess">
                <div className="d-flex justify-content-center align-items-center flex-column h-100">
                    <i className="fab fa-facebook-messenger text-primary" style={{ fontSize: "5rem" }}></i>
                    <h4>Messenger</h4>
                </div>
            </div>
        </div>
    )
}
