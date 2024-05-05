'use client'

import { useRef, useLayoutEffect, type FunctionComponent } from 'react'
import { usePathname } from 'next/navigation'

const ViewportExtra: FunctionComponent<{
  minWidth?: number
  maxWidth?: number
}> = ({
  minWidth,
  maxWidth,
}) => {
  const pathname = usePathname()

  const previousPathname = useRef('')

  useLayoutEffect(() => {
    if (pathname !== previousPathname.current) {
      previousPathname.current = pathname
      ;(async () => {
        const { setContent, updateReference } = await import('viewport-extra')
        updateReference()
        const content: Parameters<typeof setContent>[0] = {}
        if (typeof minWidth === 'number') content.minWidth = minWidth
        if (typeof maxWidth === 'number') content.maxWidth = maxWidth
        setContent(content)
      })()
    }
  }, [pathname, previousPathname, minWidth, maxWidth])

  return <></>
}

export default ViewportExtra
