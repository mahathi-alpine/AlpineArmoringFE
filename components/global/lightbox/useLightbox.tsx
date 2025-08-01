import * as React from 'react';
import dynamic from 'next/dynamic';
import type { LightboxExternalProps } from 'yet-another-react-lightbox';

const Lightbox = dynamic(() => import('./Lightbox'));

export default function useLightbox() {
  const [open, setOpen] = React.useState(false);
  const [interactive, setInteractive] = React.useState(false);

  const moveCloseButtonToSlide = React.useCallback(() => {
    const closeButton = document.querySelector(
      '.yarl__toolbar button[title="Close"]'
    );
    const currentSlide = document.querySelector('.yarl__slide_current');
    const slideInnerDiv = currentSlide?.querySelector('div');

    if (closeButton && slideInnerDiv) {
      // Check if button already exists in this slide to prevent infinite loop
      const existingButton = slideInnerDiv.querySelector(
        'button[title="Close"]'
      );
      if (existingButton) {
        return; // Button already exists, don't add another one
      }

      // Remove any existing custom close buttons from other slides
      const allExistingButtons = document.querySelectorAll(
        '.yarl__slide button[title="Close"]'
      );
      allExistingButtons.forEach((btn) => btn.remove());

      // Clone the button
      const clonedButton = closeButton.cloneNode(true) as HTMLButtonElement;

      // Style the inner div to be relative
      slideInnerDiv.style.position = 'relative';

      // Add the cloned button to the slide inner div
      slideInnerDiv.appendChild(clonedButton);

      // Style the button
      clonedButton.style.position = 'absolute';
      clonedButton.style.top = '3px';
      clonedButton.style.right = '3px';
      clonedButton.style.zIndex = '1001';
      clonedButton.style.background = 'rgba(0, 0, 0, 0.7)';
      clonedButton.style.backdropFilter = 'blur(4px)';

      // Remove all existing event listeners from cloned button
      const newClonedButton = clonedButton.cloneNode(true) as HTMLButtonElement;
      clonedButton.parentNode?.replaceChild(newClonedButton, clonedButton);

      // Add our own close handler
      newClonedButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
      });

      // Hide the original toolbar
      const toolbar = document.querySelector('.yarl__toolbar') as HTMLElement;
      if (toolbar) {
        toolbar.style.display = 'none';
      }
    }
  }, []);

  const openLightbox = React.useCallback(() => {
    setOpen(true);
    setInteractive(true);

    // Move button after lightbox renders
    setTimeout(() => {
      moveCloseButtonToSlide();

      // Only observe class changes on slides, not all DOM changes
      const slideObserver = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        mutations.forEach((mutation) => {
          // Only trigger on class changes that indicate slide change
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'class' &&
            (mutation.target as Element).classList.contains('yarl__slide')
          ) {
            shouldUpdate = true;
          }
        });

        if (shouldUpdate) {
          setTimeout(moveCloseButtonToSlide, 50);
        }
      });

      const lightboxContainer = document.querySelector('.yarl__container');
      if (lightboxContainer) {
        slideObserver.observe(lightboxContainer, {
          attributes: true,
          attributeFilter: ['class'],
          subtree: true,
        });
      }

      // Cleanup when lightbox closes
      const bodyObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            const lightboxExists = document.querySelector('.yarl__root');
            if (!lightboxExists) {
              slideObserver.disconnect();
              bodyObserver.disconnect();
            }
          }
        });
      });

      bodyObserver.observe(document.body, { childList: true });
    }, 100);
  }, [moveCloseButtonToSlide]);

  const renderLightbox = React.useCallback(
    (props?: Omit<LightboxExternalProps, 'open' | 'close'>) =>
      interactive ? (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          {...props}
          on={{
            ...props?.on,
            view: ({ index }) => {
              setTimeout(moveCloseButtonToSlide, 100);
              props?.on?.view?.({ index });
            },
          }}
        />
      ) : null,
    [open, interactive, moveCloseButtonToSlide]
  );

  return { openLightbox, renderLightbox };
}
