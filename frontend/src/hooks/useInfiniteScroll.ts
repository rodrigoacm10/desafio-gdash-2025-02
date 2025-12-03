import { useEffect, useRef } from 'react'

type UseInfiniteScrollParams = {
  hasNextPage?: boolean
  isLoadingMore?: boolean
  onLoadMore: () => void
}

export const useInfiniteScroll = ({
  hasNextPage,
  isLoadingMore,
  onLoadMore,
}: UseInfiniteScrollParams) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasNextPage && !isLoadingMore) {
          onLoadMore()
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0,
      },
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [hasNextPage, isLoadingMore, onLoadMore])

  return { loadMoreRef }
}
