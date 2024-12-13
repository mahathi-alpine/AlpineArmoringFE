import React, { useState } from 'react';
import styles from './SocialShare.module.scss';

import FacebookIcon from 'components/icons/Facebook';
import XIcon from 'components/icons/X';
import LinkIcon from 'components/icons/Link';
import EmailIcon from 'components/icons/Mail';
import WhatsappIcon from 'components/icons/Whatsapp';

const SocialShare = ({ title, url }) => {
  const [copyStatus, setCopyStatus] = useState('Copy Link');

  const shareFacebook = () => {
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbShareUrl, '_blank', 'width=600,height=400');
  };

  const shareX = () => {
    const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(xShareUrl, '_blank', 'width=600,height=400');
  };

  const copyLink = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Copy Link'), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        setCopyStatus('Copy Failed');
      });
  };

  const shareWhatsapp = () => {
    const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`;
    window.open(whatsappShareUrl, '_blank', 'width=600,height=400');
  };

  const shareEmail = () => {
    const emailSubject = encodeURIComponent(`Check out this article: ${title}`);
    const emailBody = encodeURIComponent(
      `I thought you might find this interesting:\n\n${title}\n\nRead more: ${url}`
    );
    const mailtoLink = `mailto:?subject=${emailSubject}&body=${emailBody}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className={styles.socialShare}>
      <div className={styles.socialShare_icons}>
        <button
          onClick={copyLink}
          className={styles.socialShare_icon}
          aria-label={copyStatus}
        >
          <LinkIcon />
          <span className={styles.copyLinkTooltip}>{copyStatus}</span>
        </button>

        <button
          onClick={shareFacebook}
          className={styles.socialShare_icon}
          aria-label="Share on Facebook"
        >
          <FacebookIcon />
        </button>

        <button
          onClick={shareX}
          className={styles.socialShare_icon}
          aria-label="Share on X"
        >
          <XIcon />
        </button>

        <button
          onClick={shareWhatsapp}
          className={styles.socialShare_icon}
          aria-label="Share on WhatsApp"
        >
          <WhatsappIcon />
        </button>

        <button
          onClick={shareEmail}
          className={styles.socialShare_icon}
          aria-label="Share via Email"
        >
          <EmailIcon color="black" />
        </button>
      </div>
    </div>
  );
};

export default SocialShare;
