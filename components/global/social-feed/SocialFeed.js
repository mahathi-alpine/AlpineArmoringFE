// components/SocialFeed/SocialFeed.js
import { useState, useEffect, useCallback } from 'react';
import styles from './SocialFeed.module.scss';
import SocialPostItem from './SocialPostItem';

const SocialFeed = ({ socialPosts = [] }) => {
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const POSTS_PER_PAGE = 6;

  // Initialize with first batch
  useEffect(() => {
    setDisplayedPosts(socialPosts.slice(0, POSTS_PER_PAGE));
  }, [socialPosts]);

  const loadMore = useCallback(() => {
    setIsLoading(true);

    // Simulate loading delay (remove in production)
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = currentPage * POSTS_PER_PAGE;
      const endIndex = startIndex + POSTS_PER_PAGE;
      const nextBatch = socialPosts.slice(startIndex, endIndex);

      setDisplayedPosts((prev) => [...prev, ...nextBatch]);
      setCurrentPage(nextPage);
      setIsLoading(false);
    }, 500);
  }, [currentPage, socialPosts]);

  const hasMore = displayedPosts.length < socialPosts.length;

  return (
    <div className={`${styles.socialFeed} container_small`}>
      <div className={styles.socialFeed_grid}>
        {displayedPosts.map((post, index) => (
          <SocialPostItem
            key={`${post.platform}-${post.postId}-${index}`}
            post={post}
          />
        ))}
      </div>

      {hasMore && (
        <div className={styles.socialFeed_loadMore}>
          <button
            onClick={loadMore}
            disabled={isLoading}
            className={styles.socialFeed_loadMoreButton}
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SocialFeed;
