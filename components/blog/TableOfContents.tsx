import { useState, useEffect, useRef } from 'react';
import useLocale from 'hooks/useLocale';
import styles from './TableOfContents.module.scss';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentId?: string;
  showH3?: boolean;
}

const TableOfContents = ({
  contentId = 'blogContent',
  showH3 = true,
}: TableOfContentsProps) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Extract headings from the DOM and generate IDs
  useEffect(() => {
    const contentElement = document.getElementById(contentId);
    if (!contentElement) return;

    const headingElements = contentElement.querySelectorAll('h2, h3');
    const headingList: Heading[] = [];

    headingElements.forEach((heading) => {
      const level = parseInt(heading.tagName.substring(1));

      // Skip h3 if showH3 is false
      if (level === 3 && !showH3) return;

      const text = heading.textContent || '';

      // Generate a slug-based ID from the heading text
      let id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      // Ensure unique IDs by appending index if duplicate
      const existingId = heading.id;
      if (existingId) {
        id = existingId;
      } else {
        const duplicateCount = headingList.filter((h) => h.id === id).length;
        if (duplicateCount > 0) {
          id = `${id}-${duplicateCount}`;
        }
        heading.id = id;
      }

      headingList.push({ id, text, level });
    });

    setHeadings(headingList);

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [contentId, showH3]);

  // Set up IntersectionObserver for active heading detection
  useEffect(() => {
    if (headings.length === 0) return;

    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Account for sticky header offset
    const headerOffset = 100;

    const observerOptions = {
      rootMargin: `-${headerOffset}px 0px -66% 0px`,
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    observerRef.current = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe all heading elements
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [headings]);

  // Smooth scroll to heading with header offset
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;

    const headerOffset = 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });

    // Update URL hash without jumping
    if (history.pushState) {
      history.pushState(null, '', `#${id}`);
    }
  };
  const { lang } = useLocale();

  if (headings.length === 0) return null;

  return (
    <nav className={styles.toc} aria-label="Table of contents">
      <div className={styles.toc_title}>{lang.tableOfContents}</div>
      <ul className={styles.toc_list}>
        {headings.map(({ id, text, level }) => (
          <li
            key={id}
            className={`${styles.toc_item} ${
              level === 3 ? styles.toc_item_nested : ''
            } ${activeId === id ? styles.toc_item_active : ''}`}
          >
            <a
              href={`#${id}`}
              onClick={(e) => handleClick(e, id)}
              className={styles.toc_link}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
