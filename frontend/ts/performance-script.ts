if (typeof PerformanceObserver !== 'undefined') {
  try {
    lcpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (shouldLog) {
          console.log('LCP candidate:', entry.startTime, entry)
        }
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true })
  } catch (err) {
    console.error(err)
  }
  try {
    clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          try {
            var clsData = {
              value: Math.round(entry.value * 100) / 100,
              node: entry.sources[0].node.outerHTML,
              sources: entry.sources,
            }
            window.reportCLS(clsData)
            window.clsCache.push(clsData)
            if (shouldLog) {
              console.log('Current CLS value:', cls, entry)
              console.log(entry.sources[0].node)
            }
          } catch (err) {
            console.error(err)
          }
          cls += entry.value

          if (entry && entry.sources && entry.sources[0]) {
          }
        }
      }
    }).observe({ type: 'layout-shift', buffered: true })
  } catch (err) {
    console.error(err)
  }
}
