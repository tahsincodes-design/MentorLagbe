export const homeRefreshEvent = "mentorlagbe:home-refresh"

let homeScrollPending = false

export function requestHomeScroll() {
  homeScrollPending = true
}

export function consumeHomeScroll() {
  const pending = homeScrollPending
  homeScrollPending = false
  return pending
}
