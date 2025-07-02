
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useCallback } from 'react'

const Following = ({userId}) => {
  const [followings, setfollowings] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const itemsPerPage = 12

  const getPageParams = (pageNum) => {
    const start = (pageNum - 1) * itemsPerPage
    const end = pageNum * itemsPerPage
    return { start, end }
  }

  const fetchfollowings = async (pageNum, append = false) => {
    if (loading) return
    
    setLoading(true)
    try {
      const { start, end } = getPageParams(pageNum)
      
      const response = await fetch(`/api/user/following`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ start, end, limit: itemsPerPage, userId }),
      })
      const data = await response.json()
      
      if (data.followings && data.followings.length > 0) {
        if (append) {
          setfollowings(prev => [...prev, ...data.followings])
        } else {
          setfollowings(data.followings)
        }
        
        setHasMore(data.followings.length === itemsPerPage)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Failed to fetch followings:', error)
      setHasMore(false)
    }
    setLoading(false)
  }

  const loadMorefollowings = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchfollowings(nextPage, true)
    }
  }, [page, loading, hasMore, userId])

  const handleScroll = useCallback(() => {
  if (loading || !hasMore) return;

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  if (scrollTop + windowHeight >= documentHeight - 200) {
    loadMorefollowings();
  }
}, [loading, hasMore, loadMorefollowings]);

  useEffect(() => {
    if (userId) {
      fetchfollowings(1)
    }
  }, [userId])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  if (loading && followings.length === 0) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading followings...</span>
      </div>
    )
  }

  if (followings.length === 0 && !loading) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">😔</div>
        <p className="text-gray-500 text-lg">No Followings</p>
      </div>
    )
  }

  return (
    <div className="w-full px-0">
      <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 3xl:grid-cols-15 gap-1 sm:gap-2">
        {followings.map((following) => (
        <Link key={following.id} href={`/profile/${following.username}`}>
          <div className="">
            <Image
              src={following.avatar_url}
              alt={following.username}
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </Link>
        ))}
      </div>

      {loading && followings.length > 0 && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading more...</span>
        </div>
      )}

      {!loading && !hasMore && followings.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No More followings</p>
        </div>
      )}
    </div>
  )
}

export default Following