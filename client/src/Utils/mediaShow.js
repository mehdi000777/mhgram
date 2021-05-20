export const imageShowe = (src, theme) => {
    return (
        <img src={src}
            className="img-thumbnail" alt="images"
            style={{ filter: theme ? "invert(1)" : "invert(0)" }} />
    )
}

export const videoShowe = (src, theme) => {
    return (
        <video controls src={src}
            className="img-thumbnail" alt="images"
            style={{ filter: theme ? "invert(1)" : "invert(0)" }} />
    )
}