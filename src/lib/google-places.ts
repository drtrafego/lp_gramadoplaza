import { RATING as FALLBACK_RATING, TESTIMONIALS as FALLBACK_TESTIMONIALS, type Testimonial } from './site'

export const GOOGLE_PLACE_ID = 'ChIJ7ZeNoeEzGZUR0Oo0GIdOH40'
export const GOOGLE_MAPS_URI = `https://www.google.com/maps/place/?q=place_id:${GOOGLE_PLACE_ID}`

const FIELD_MASK = [
  'rating',
  'userRatingCount',
  'googleMapsUri',
  'reviews.rating',
  'reviews.text',
  'reviews.authorAttribution',
  'reviews.relativePublishTimeDescription',
].join(',')

const API_URL = `https://places.googleapis.com/v1/places/${GOOGLE_PLACE_ID}?languageCode=pt-BR&regionCode=BR`

interface PlacesApiReview {
  rating?: number
  text?: { text?: string; languageCode?: string }
  authorAttribution?: { displayName?: string; photoUri?: string; uri?: string }
  relativePublishTimeDescription?: string
}

interface PlacesApiResponse {
  rating?: number
  userRatingCount?: number
  googleMapsUri?: string
  reviews?: PlacesApiReview[]
}

export interface PlaceReviewsData {
  rating: number
  count: number
  source: 'Google' | 'TripAdvisor'
  mapsUri: string
  testimonials: readonly Testimonial[]
}

function truncate(text: string, max = 240): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const sliced = clean.slice(0, max)
  const lastSpace = sliced.lastIndexOf(' ')
  return `${sliced.slice(0, lastSpace > max * 0.6 ? lastSpace : max)}…`
}

function toTestimonial(review: PlacesApiReview): Testimonial | null {
  const text = review.text?.text
  const name = review.authorAttribution?.displayName
  if (!text || !name) return null
  return {
    name,
    text: truncate(text, 260),
    source: 'Google',
  }
}

const FALLBACK: PlaceReviewsData = {
  rating: FALLBACK_RATING.value,
  count: FALLBACK_RATING.count,
  source: 'TripAdvisor',
  mapsUri: 'https://www.google.com/maps/search/?api=1&query=Gramado+Plazza+Restaurante+Gramado+RS',
  testimonials: FALLBACK_TESTIMONIALS,
}

export async function fetchPlaceReviews(): Promise<PlaceReviewsData> {
  const key = process.env.GOOGLE_PLACES_API_KEY
  if (!key) {
    console.warn('[places] GOOGLE_PLACES_API_KEY ausente — usando fallback.')
    return FALLBACK
  }

  try {
    const res = await fetch(API_URL, {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': FIELD_MASK,
      },
      next: { revalidate: 86400 },
    })

    if (!res.ok) {
      console.warn('[places] HTTP', res.status, await res.text())
      return FALLBACK
    }

    const data = (await res.json()) as PlacesApiResponse

    const testimonials = (data.reviews ?? [])
      .filter(r => (r.rating ?? 0) >= 4)
      .map(toTestimonial)
      .filter((t): t is Testimonial => t !== null)
      .slice(0, 3)

    if (testimonials.length === 0) {
      console.warn('[places] Nenhuma review 4+ encontrada — usando fallback de testimonials.')
      return {
        rating: data.rating ?? FALLBACK.rating,
        count: data.userRatingCount ?? FALLBACK.count,
        source: 'Google',
        mapsUri: data.googleMapsUri ?? FALLBACK.mapsUri,
        testimonials: FALLBACK_TESTIMONIALS,
      }
    }

    return {
      rating: data.rating ?? FALLBACK.rating,
      count: data.userRatingCount ?? FALLBACK.count,
      source: 'Google',
      mapsUri: data.googleMapsUri ?? FALLBACK.mapsUri,
      testimonials,
    }
  } catch (err) {
    console.error('[places] Falha ao buscar reviews:', err)
    return FALLBACK
  }
}
