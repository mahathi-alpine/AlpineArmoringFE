import { useState, useEffect } from 'react';
import VideoSingle from './SocialPostItem';
import styles from './SocialFeed.module.scss';

// Sample data structure for the feed
type VideoData = {
  id: string;
  attributes: {
    title: string;
    URLExternal?: string; // YouTube video ID
    videoFile?: string; // Direct video file URL
    thumbnailImage?: string; // Custom thumbnail URL
    description?: string;
    duration?: string;
    uploadDate?: string;
    author?: string;
  };
};

type VideoFeedProps = {
  videos?: VideoData[];
  large?: boolean;
  onVideoSelect?: (video: VideoData) => void;
};

const VideoFeed: React.FC<VideoFeedProps> = ({
  videos = [],
  large = false,
}) => {
  const [feedData, setFeedData] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sample data for demonstration
  const sampleVideos: VideoData[] = [
    {
      id: '1',
      attributes: {
        title: 'Building Modern Web Apps with Next.js',
        URLExternal: 'dQw4w9WgXcQ', // YouTube video ID
        thumbnailImage: 'https://picsum.photos/630/400?random=1',
        description:
          'Learn how to build scalable web applications using Next.js framework with modern best practices.',
        duration: '15:42',
        uploadDate: '2024-01-15',
        author: 'TechChannel',
      },
    },
    {
      id: '2',
      attributes: {
        title: 'Custom Video Upload Demo',
        videoFile:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailImage: 'https://picsum.photos/630/400?random=2',
        description:
          'This is a demo of a manually uploaded video file with custom thumbnail support.',
        duration: '10:34',
        uploadDate: '2024-01-10',
        author: 'VideoCreator',
      },
    },
    {
      id: '3',
      attributes: {
        title: 'React State Management Patterns',
        URLExternal: 'dQw4w9WgXcQ',
        thumbnailImage: 'https://picsum.photos/630/400?random=3',
        description:
          'Explore different state management patterns in React applications.',
        duration: '22:18',
        uploadDate: '2024-01-05',
        author: 'ReactExperts',
      },
    },
    {
      id: '4',
      attributes: {
        title: 'Advanced CSS Animations',
        videoFile:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnailImage: 'https://picsum.photos/630/400?random=4',
        description:
          'Master advanced CSS animation techniques for modern web design.',
        duration: '18:55',
        uploadDate: '2024-01-01',
        author: 'CSSMaster',
      },
    },
  ];

  useEffect(() => {
    // Simulate API call or use provided videos
    const loadVideos = async () => {
      setIsLoading(true);
      try {
        // Use provided videos or fallback to sample data
        const videosToUse = videos.length > 0 ? videos : sampleVideos;

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        setFeedData(videosToUse);
        setError(null);
      } catch (err) {
        setError('Failed to load videos');
        console.error('Error loading videos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, [videos]);

  if (isLoading) {
    return (
      <div className={styles.feed_loading}>
        <div className={styles.loading_spinner}></div>
        <p>Loading videos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.feed_error}>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (feedData.length === 0) {
    return (
      <div className={styles.feed_empty}>
        <p>No videos available</p>
      </div>
    );
  }

  return (
    <div className={`${styles.social_feed} container_small`}>
      <div className={`${styles.social_feed_wrap}`}>
        {feedData.map((video) => (
          <VideoSingle key={video.id} props={video} large={large} />
        ))}
      </div>
    </div>
  );
};

export default VideoFeed;
