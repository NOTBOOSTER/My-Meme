
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useCallback } from 'react'
import { IoIosClose } from "react-icons/io";

const Follower = ({userId}) => {
  const [followers, setfollowers] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const itemsPerPage = 12

  const getPageParams = (pageNum) => {
    const start = (pageNum - 1) * itemsPerPage
    const end = pageNum * itemsPerPage
    return { start, end }
  }

  const fetchfollowers = async (pageNum, append = false) => {
    if (loading) return
    
    setLoading(true)
    try {
      const { start, end } = getPageParams(pageNum)
      
      const response = await fetch(`/api/user/followers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ start, end, limit: itemsPerPage, userId }),
      })
      const data = await response.json();
      
      if (data.followers && data.followers.length > 0) {
        if (append) {
          setfollowers(prev => [...prev, ...data.followers])
        } else {
          setfollowers(data.followers)
        }
        
        setHasMore(data.followers.length === itemsPerPage)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Failed to fetch followers:', error)
      setHasMore(false)
    }
    setLoading(false)
  }

  const loadMorefollowers = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchfollowers(nextPage, true)
    }
  }, [page, loading, hasMore, userId])

  const handleScroll = useCallback(() => {
  if (loading || !hasMore) return;

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  if (scrollTop + windowHeight >= documentHeight - 200) {
    loadMorefollowers();
  }
}, [loading, hasMore, loadMorefollowers]);

  useEffect(() => {
    if (userId) {
      fetchfollowers(1)
    }
  }, [userId])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  if (loading && followers.length === 0) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading followers...</span>
      </div>
    )
  }

  if (followers.length === 0 && !loading) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">😔</div>
        <p className="text-gray-500 text-lg">No followers</p>
      </div>
    )
  }

  return (
    <div className="w-full px-0">
      <div className="flex flex-row flex-wrap items-center justify-center gap-2" >
        {followers.map((follower) => (
          <div key={follower.follower_id
} className="flex flex-row justify-between min-w-80 px-4 py-2 border-2 rounded-md  border-violet-200 ">
            <Link href={`/profile/${follower.username}`} className="flex flex-row gap-2 items-center">
              <div className="rounded-full z-10 overflow-hidden">
                <Image
                  src={follower.avatar_url}
                  alt={follower.username}
                  width={50}
                  height={50}
                />
              </div>
              <div className="flex flex-col items-center">
                <p className="text-sm font-semibold">{follower?.first_name} {follower?.last_name ? follower?.last_name : ""}</p>
                <p className="text-xs">{follower?.username}</p>
              </div>
            </Link>
            
          </div>
        ))}
      </div>

      {loading && followers.length > 0 && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Loading more...</span>
        </div>
      )}

      {!loading && !hasMore && followers.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No More followers</p>
        </div>
      )}
    </div>
  )
}

export default Follower