import { useState } from "react";
import { storyArt } from "./art.js";
import { storyUI } from "./scenes.js";

export function SceneArt({ sceneId, className = "" }) {
  const art = storyArt[sceneId];
  const [failed, setFailed] = useState(false);
  if (!art) return null;

  return (
    <figure className={`story-art ${className}`.trim()}>
      {failed ? (
        <div className="story-art-fallback" role="img" aria-label={art.alt}>
          <span>{storyUI.closeArtFallback}</span>
        </div>
      ) : (
        <img
          src={art.src}
          alt={art.alt}
          width={art.width}
          height={art.height}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
      <figcaption>{storyUI.artCaption}</figcaption>
    </figure>
  );
}
