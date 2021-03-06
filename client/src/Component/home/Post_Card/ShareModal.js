import React from 'react';
import {
    EmailShareButton, EmailIcon,
    FacebookShareButton, FacebookIcon,
    TelegramShareButton, TelegramIcon,
    TwitterShareButton, TwitterIcon,
    WhatsappShareButton, WhatsappIcon,
    RedditShareButton, RedditIcon
} from 'react-share';

export default function ShareModal({ url, theme }) {
    return (
        <div className="d-flex justify-content-between px-4 py-2"
            style={{ filter: theme ? "invert(1)" : "invert(0)" }}>
            <FacebookShareButton url={url}>
                <FacebookIcon round={true} size={32} />
            </FacebookShareButton>

            <EmailShareButton url={url}>
                <EmailIcon round={true} size={32} />
            </EmailShareButton>

            <TelegramShareButton url={url}>
                <TelegramIcon round={true} size={32} />
            </TelegramShareButton>

            <TwitterShareButton url={url}>
                <TwitterIcon round={true} size={32} />
            </TwitterShareButton>

            <WhatsappShareButton url={url}>
                <WhatsappIcon round={true} size={32} />
            </WhatsappShareButton>

            <RedditShareButton url={url}>
                <RedditIcon round={true} size={32} />
            </RedditShareButton>
        </div>
    )
}
