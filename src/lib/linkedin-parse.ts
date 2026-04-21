export interface LinkedInContact {
  name: string
  email?: string
  company?: string
  title?: string
  linkedinUrl?: string
}

// LinkedIn CSV export columns (standard export format)
// "First Name","Last Name","Email Address","Company","Position","Connected On","URL"
export function parseLinkedInCSV(csv: string): LinkedInContact[] {
  const lines = csv.trim().split('\n')
  if (lines.length < 2) return []

  const headers = parseCSVRow(lines[0]).map((h) => h.trim().toLowerCase())

  const idx = {
    firstName: headers.indexOf('first name'),
    lastName: headers.indexOf('last name'),
    email: headers.indexOf('email address'),
    company: headers.indexOf('company'),
    position: headers.indexOf('position'),
    url: headers.indexOf('url'),
  }

  const results: LinkedInContact[] = []

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVRow(lines[i])
    if (row.length < 2) continue

    const firstName = idx.firstName >= 0 ? row[idx.firstName]?.trim() : ''
    const lastName = idx.lastName >= 0 ? row[idx.lastName]?.trim() : ''
    const name = [firstName, lastName].filter(Boolean).join(' ')

    if (!name) continue

    results.push({
      name,
      email: idx.email >= 0 ? row[idx.email]?.trim() || undefined : undefined,
      company: idx.company >= 0 ? row[idx.company]?.trim() || undefined : undefined,
      title: idx.position >= 0 ? row[idx.position]?.trim() || undefined : undefined,
      linkedinUrl: idx.url >= 0 ? row[idx.url]?.trim() || undefined : undefined,
    })
  }

  return results
}

function parseCSVRow(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}
