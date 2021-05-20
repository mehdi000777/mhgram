import React from 'react'

export default function Toast({ msg, handelShow, bgColor }) {
    return (
        <div className={`toast show position-fixed text-light ${bgColor}`}
            style={{ top: "5px", right: "5px", zIndex: 50, minWidth: "200px" }}>
            <div className={`toast-header text-light ${bgColor}`}>
                <strong className="mr-auto text-light">{msg.title}</strong>
                <button className="ml-2 mb-1 close text-light" data-dismiss="toast"
                    style={{ outline: "none", background: "none", border: "none", position: "absolute", right: "10px" }}
                    onClick={handelShow}>
                    &times;
                </button>
            </div>
            <div className="toast-body">
                {msg.body}
            </div>
        </div>
    )
}

