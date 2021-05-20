import React from 'react'

export default function LoadMoreBtn({ load, page, result, loadMoreHandler }) {
    return (
        <>
            {
                result < 9 * (page - 1)
                    ? ""
                    : !load &&
                    < button className="btn btn-dark d-block mx-auto mb-5" onClick={loadMoreHandler}>
                        Load more
                    </button>
            }
        </>
    )
}
