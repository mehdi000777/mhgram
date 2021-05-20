import React from 'react'
import { useSelector } from 'react-redux'

export default function Icons({ setContent, content }) {
    const reactions = [
        "😄", "😀", "🙂", "😆", "😅", "😂", "🤣", "😊", "😌", "😉", "😍", "😘",
        "😗", "😙", "😚", "🤗", "😈", "😧", "😲", "😶", "😠", "😭", "😢", "😓",
        "😋", "😜", "😝", "😛", "🤜", "👊", "👌", "👍", "👎"
    ]

    const theme = useSelector(state => state.theme);

    return (
        <div className="nav-item dropdown" style={{ opacity: 1, filter: theme ? "invert(1)" : "invert(0)", zIndex: "10" }}>
            <span className="nav-link position-relative" href="#" id="navbarDropdown"
                role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span style={{ opacity: .4 }}>🙂</span>
            </span>
            <div className="dropdown-menu" aria-labelledby="narDavbropdown">
                <div className="reactions">
                    {
                        reactions.map(icon => (
                            <span key={icon} onClick={() => setContent(content + icon)}>
                                {icon}
                            </span>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
