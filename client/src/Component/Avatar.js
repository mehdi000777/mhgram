import React from 'react';
import { useSelector } from 'react-redux';
import videoImg from '../images/Video-Icon.png';

export default function Avatar({ src, size }) {

    const theme = useSelector(state => state.theme);

    return (
        <>
            {
                src &&
                    src.match(/video/i)
                    ? <video src={videoImg} alt="avatar" className={size}
                        style={{ filter: theme ? "invert(1)" : "invert(0)", border: "2px solid #fff" }} />

                    : <img src={src} alt="avatar" className={size}
                        style={{ filter: theme ? "invert(1)" : "invert(0)", border: "2px solid #fff" }} />
            }
        </>
    )
}
