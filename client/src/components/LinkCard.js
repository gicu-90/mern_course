import React from 'react'

export const LinkCard = ({link}) => {
    return (
        <>
            <h2>Linkul</h2>

            <p>Linkul dvs.: <a href={link.to} target="_blank" rel="noopener noreferrer">{link.to}</a></p>
            <p>Din: <a href={link.from} target="_blank" rel="noopener noreferrer">{link.from}</a></p>
            <p>Cantitatea de clickuri: <strong>{link.clicks}</strong></p>
            <p>Data crearii: <strong>{new Date(link.date).toLocaleDateString()}</strong></p>
        </>
    )
}