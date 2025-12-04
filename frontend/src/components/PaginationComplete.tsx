import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'

export const PaginationComplete = ({
  data,
  itemsPerPage,
  currentPage,
  handlePageChange,
}: {
  data: any
  itemsPerPage: number
  currentPage: number
  handlePageChange: (page: number) => void
}) => {
  // Calcular o número total de páginas
  const totalPages = Math.ceil((data?.totalCount ?? 1) / itemsPerPage)

  // Limitar o número de páginas a exibir
  const pagesToShow = 5
  let startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2))
  const endPage = Math.min(totalPages, startPage + pagesToShow - 1)

  // Ajustar startPage se o total de páginas for menor que o número de páginas a ser exibido
  if (endPage - startPage < pagesToShow - 1) {
    startPage = Math.max(1, endPage - pagesToShow + 1)
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage > 1) handlePageChange(currentPage - 1)
            }}
          />
        </PaginationItem>

        {/* Primeira página */}
        {startPage > 1 && (
          <>
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(1)
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>
            {startPage > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {/* Renderiza as páginas entre startPage e endPage */}
        {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
          const page = startPage + index
          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(page)
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        {/* Última página */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(totalPages)
                }}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage < totalPages) handlePageChange(currentPage + 1)
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
