import Image from "next/image"
import Link from "next/link"

const Memes = ({ memes = [] }) => {
  const defaultMemes = [
    { id: 1, image: "/images.jpeg", alt: "User meme 1" },
    { id: 2, image: "/images.jpeg", alt: "User meme 2" },
    { id: 3, image: "/images.jpeg", alt: "User meme 3" },
    { id: 4, image: "/images.jpeg", alt: "User meme 4" },
    { id: 5, image: "/images.jpeg", alt: "User meme 5" },
    { id: 6, image: "/images.jpeg", alt: "User meme 6" }
  ]

  const userMemes = memes.length > 0 ? memes : defaultMemes

  if (userMemes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No memes uploaded yet</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2">
        {userMemes.map((meme) => (
          <Link href={`/meme/${meme.id}`} key={meme.id}>
            <div className="aspect-square overflow-hidden rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <Image 
                src={meme.image} 
                width={150} 
                height={150} 
                alt={meme.alt || "User uploaded meme"}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Memes