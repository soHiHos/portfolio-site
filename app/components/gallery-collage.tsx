import { ImageIcon } from "lucide-react"
import gallery from "../content/gallery.json"
import LoadImg from "./effects/media-spinner"

// Paintings and photos beside the bio. To add one: put the file in /public/gallery and add
// { "src": "/gallery/<file>", "alt": "<what it shows>", "caption": "<optional title>" } to content/gallery.json.
// The first four fill the collage in order; the first gets the big slot.
// `featured` marks the one picture shown alone on the home page
export type GalleryImage = { src: string; alt: string; caption?: string; featured?: boolean }

export const FEATURED = (gallery as GalleryImage[]).find((i) => i.featured)

const IMAGES = (gallery as GalleryImage[]).slice(0, 4)

// Four slots on a golden grid: columns and rows both split 0.618 : 0.382, so the big tile is a square, the one beside
// it a tall 0.618 : 1 tile, the one under it a wide 1.618 : 1 tile and the last a small square. The collage fills the
// height of the bio card beside it. The first picture takes the big square, so put the squarest picture first.
const SLOTS = [
  "col-start-1 row-start-1",
  "col-start-2 row-start-1",
  "col-start-1 row-start-2",
  "col-start-2 row-start-2",
]

export default function GalleryCollage() {
  return (
    <div className="grid aspect-square h-full w-full grid-cols-[0.618fr_0.382fr] grid-rows-[0.618fr_0.382fr] gap-2 lg:aspect-auto">
      {SLOTS.map((slot, i) => {
        const image = IMAGES[i]
        return (
          <figure key={slot} className={`group relative overflow-hidden border border-line bg-surface ${slot}`}>
            {image ? (
              <>
                <LoadImg
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
                />
                {image.caption && (
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pt-6 pb-2 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {image.caption}
                  </figcaption>
                )}
              </>
            ) : (
              // Empty slot until an image is added
              <div className="flex h-full items-center justify-center text-muted/40" aria-hidden="true">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}
          </figure>
        )
      })}
    </div>
  )
}
