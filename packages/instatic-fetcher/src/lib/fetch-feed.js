import got from 'got'
import callFn from './call-fn'

const API = 'https://api.instagram.com/v1/users/self/media/recent'

export default async function * fetchFeed (
  instagramToken,
  postedAfter,
  events = {},
  fetchLimit = Infinity,
  fetchCount = 0,
  page
) {
  if (fetchCount !== 0 && typeof page === 'undefined') {
    return
  }

  if (fetchCount === fetchLimit) {
    return
  }

  callFn(events.preFetchPage, fetchCount)

  const res = await got(API, {
    query: {
      access_token: instagramToken,
      min_id: postedAfter,
      max_id: page,
      count: 999
    },
    json: true
  })

  callFn(events.postFetchPage, fetchCount)

  const { pagination, data } = res.body

  for (const item of data) {
    if (item.id === postedAfter) {
      continue
    }

    yield item
  }

  yield * fetchFeed(
    instagramToken,
    postedAfter,
    events,
    fetchLimit,
    fetchCount + 1,
    pagination.next_max_id
  )
}
