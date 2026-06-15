'use client'

import { useRouter } from 'next/navigation'
import { useEffect, forwardRef, useCallback } from 'react'
import { sweepIn, isTransitioning } from '@/lib/transitions'

interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
}

const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  function TransitionLink({ href, children, onClick, ...props }, ref) {
    const router = useRouter()

    // Prefetch the destination route for near-instant navigation after sweepIn
    useEffect(() => {
      if (href.startsWith('/') && !href.startsWith('//')) {
        router.prefetch(href)
      }
    }, [href, router])

    const handleClick = useCallback(
      async (e: React.MouseEvent<HTMLAnchorElement>) => {
        // Pass through: modifier keys, non-internal links, same-page anchors
        if (
          e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
          !href.startsWith('/') ||
          href.startsWith('//')
        ) {
          onClick?.(e)
          return
        }

        e.preventDefault()

        // Don't stack transitions
        if (isTransitioning()) return

        // Don't animate same-page navigation
        if (href === window.location.pathname) return

        onClick?.(e)

        await sweepIn()
        router.push(href)
      },
      [href, router, onClick]
    )

    return (
      <a ref={ref} href={href} onClick={handleClick} {...props}>
        {children}
      </a>
    )
  }
)

export default TransitionLink
