import type { LanguageOption } from '@/utils/language-options'

function resolveTargetCode(language: string, options: LanguageOption[]): string {
  const match = options.find((item) => item.code === language)
  return match?.googleCode ?? language
}

/**
 * Translate plain text using Google Translate (client-side).
 * Splits long strings to avoid payload limits and keeps line breaks.
 */
export async function translateWithGoogle(
  text: string,
  language: string,
  options: LanguageOption[],
  signal?: AbortSignal,
): Promise<string> {
  if (!text.trim()) return text

  const {
    public: { googleTranslateKey },
  } = useRuntimeConfig()

  if (!googleTranslateKey) throw new Error('Missing google translate key (NUXT_PUBLIC_GOOGLE_TRANSLATE_KEY)')

  const target = resolveTargetCode(language, options)
  const translateChunk = async (chunk: string): Promise<string> => {
    const htmlText = chunk.replace(/\n/g, '<br/>')
    const payload = [[[htmlText], 'auto', target], 'wt_lib']
    const res = await fetch('https://translate-pa.googleapis.com/v1/translateHtml', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json+protobuf',
        'X-Goog-API-Key': googleTranslateKey,
        Accept: '*/*',
      },
      body: JSON.stringify(payload),
      signal,
    })

    if (!res.ok) throw new Error(`Google translate failed with status ${res.status}`)
    const data = await res.json()
    const raw =
      Array.isArray(data) && Array.isArray(data[0]) && typeof data[0][0] === 'string' ? (data[0][0] as string) : chunk
    const decoded = raw.replace(/<br\s*\/?>/gi, '\n')
    return decodeEntities(decoded)
  }

  const chunks: string[] = []
  for (let i = 0; i < text.length; i += 1800) chunks.push(text.slice(i, i + 1800))
  const translated = await Promise.all(chunks.map((chunk) => translateChunk(chunk)))
  return translated.join('')
}

function decodeEntities(str: string) {
  if (typeof window !== 'undefined') {
    const txt = document.createElement('textarea')
    txt.innerHTML = str
    return txt.value
  }
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

