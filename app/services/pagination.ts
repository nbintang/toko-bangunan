const ALLOWED_PER_PAGE = new Set([10, 20, 50, 100])

export function getPaginationParams(pageInput: unknown, perPageInput: unknown) {
  const parsedPage = Number(pageInput)
  const parsedPerPage = Number(perPageInput)

  return {
    page: Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1,
    perPage: ALLOWED_PER_PAGE.has(parsedPerPage) ? parsedPerPage : 10,
  }
}
