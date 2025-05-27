import mixpanel from 'mixpanel-browser'

export const identifyUser = (id: string, walletAddress: string) => {
  mixpanel.identify(id)
  mixpanel.people.set({
    name: walletAddress,
  })
}
export const trackEvent = (eventName: string, properties?: Record<string, string>) => {
  mixpanel.track(eventName, properties)
}

export const resetUser = () => {
  mixpanel.reset()
}

export const MIXPANEL_EVENTS = {
  VIEW_LANDING_PAGE: 'view_landing_page',
  LOGIN: 'login',
  // ... other events
}
