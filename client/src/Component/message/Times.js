import React from 'react'

export default function Times({ total }) {
    return (
        <div>
            <span>
                {
                    parseInt(total / 3600).toString.length < 2
                        ? "0" + parseInt(total / 3600)
                        : parseInt(total / 3600)
                }
            </span>
            <span>:</span>
            <span>
                {
                    parseInt(total / 60).toString.length < 2
                        ? "0" + parseInt(total / 60)
                        : parseInt(total / 60)
                }
            </span>
            <span>:</span>
            <span>
                {
                    parseInt(total % 60).toString.length < 2
                        ? "0" + parseInt(total % 60)
                        : parseInt(total % 60)
                }
            </span>
        </div>
    )
}
