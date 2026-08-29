import { useCallback, useEffect, useRef, useState } from "react";
import type { ProjectImage } from "../../types/project";

type ProjectGalleryProps = {
  images: readonly ProjectImage[];
  projectTitle: string;
};

export default function ProjectGallery({ images, projectTitle }: ProjectGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const closeGallery = useCallback(() => {
    setSelectedIndex(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const showPrevious = useCallback(() => {
    setSelectedIndex((current) =>
      current === null ? 0 : (current - 1 + images.length) % images.length,
    );
  }, [images.length]);

  const showNext = useCallback(() => {
    setSelectedIndex((current) =>
      current === null ? 0 : (current + 1) % images.length,
    );
  }, [images.length]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeGallery();
        return;
      }

      if (event.key === "ArrowLeft" && images.length > 1) {
        event.preventDefault();
        showPrevious();
        return;
      }

      if (event.key === "ArrowRight" && images.length > 1) {
        event.preventDefault();
        showNext();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLButtonElement>(
        "button:not([disabled])",
      );
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeGallery, images.length, selectedIndex, showNext, showPrevious]);

  if (images.length === 0) return null;

  const selectedImage = selectedIndex === null ? null : images[selectedIndex];

  return (
    <section className="glass panel project-detail-section" aria-labelledby="project-gallery">
      <h2 id="project-gallery">Galerie</h2>

      <div className="project-gallery">
        {images.map((image, index) => (
          <button
            className="project-gallery__trigger"
            key={image.src}
            type="button"
            onClick={(event) => {
              triggerRef.current = event.currentTarget;
              setSelectedIndex(index);
            }}
            aria-label={`Agrandir : ${image.alt}`}
          >
            <img src={image.src} alt={image.alt} loading="lazy" />
            <span aria-hidden="true">Agrandir</span>
          </button>
        ))}
      </div>

      {selectedImage ? (
        <div
          className="project-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-lightbox-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeGallery();
          }}
        >
          <div className="project-lightbox__panel" ref={dialogRef}>
            <header className="project-lightbox__header">
              <div>
                <h3 id="project-lightbox-title">Galerie — {projectTitle}</h3>
                <span className="project-lightbox__counter" aria-live="polite">
                  Image {(selectedIndex ?? 0) + 1} sur {images.length}
                </span>
              </div>
              <button
                className="btn project-lightbox__close"
                type="button"
                onClick={closeGallery}
                ref={closeButtonRef}
              >
                Fermer
              </button>
            </header>

            <figure className="project-lightbox__figure">
              <img src={selectedImage.src} alt={selectedImage.alt} />
              <figcaption>{selectedImage.alt}</figcaption>
            </figure>

            {images.length > 1 ? (
              <div className="project-lightbox__navigation" aria-label="Navigation de la galerie">
                <button className="btn" type="button" onClick={showPrevious}>
                  <span aria-hidden="true">←</span> Image précédente
                </button>
                <button className="btn" type="button" onClick={showNext}>
                  Image suivante <span aria-hidden="true">→</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
