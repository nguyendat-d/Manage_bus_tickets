import React from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  MoreHorizontal
} from 'lucide-react'

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = '',
  showPageInfo = true,
  showPageSize = false,
  pageSize = 10,
  onPageSizeChange,
  totalItems = 0,
  siblingCount = 1,
  boundaryCount = 1,
  variant = 'default' // 'default', 'compact', 'minimal'
}) => {
  // Generate page numbers with ellipsis
  const generatePaginationItems = () => {
    const items = []
    const totalNumbers = (siblingCount * 2) + 3
    const totalBlocks = totalNumbers + 2

    if (totalPages <= totalBlocks) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        items.push(i)
      }
    } else {
      const startPages = []
      const endPages = []
      
      // Start pages
      for (let i = 1; i <= boundaryCount; i++) {
        startPages.push(i)
      }
      
      // End pages
      for (let i = totalPages - boundaryCount + 1; i <= totalPages; i++) {
        endPages.push(i)
      }
      
      // Siblings around current page
      const siblingsStart = Math.max(
        Math.min(
          currentPage - siblingCount,
          totalPages - totalNumbers + boundaryCount + 1
        ),
        boundaryCount + 2
      )
      
      const siblingsEnd = Math.min(
        Math.max(
          currentPage + siblingCount,
          totalNumbers - boundaryCount - 1
        ),
        totalPages - boundaryCount - 1
      )

      items.push(...startPages)
      
      if (siblingsStart > boundaryCount + 2) {
        items.push('start-ellipsis')
      } else if (boundaryCount + 1 < totalPages - boundaryCount) {
        items.push(boundaryCount + 1)
      }
      
      for (let i = siblingsStart; i <= siblingsEnd; i++) {
        items.push(i)
      }
      
      if (siblingsEnd < totalPages - boundaryCount - 1) {
        items.push('end-ellipsis')
      } else if (totalPages - boundaryCount > boundaryCount) {
        items.push(totalPages - boundaryCount)
      }
      
      items.push(...endPages)
    }

    return items
  }

  const paginationItems = generatePaginationItems()

  if (totalPages <= 1) return null

  const getPageInfo = () => {
    const startItem = (currentPage - 1) * pageSize + 1
    const endItem = Math.min(currentPage * pageSize, totalItems)
    return `Hiển thị ${startItem}-${endItem} của ${totalItems} mục`
  }

  const PageButton = ({ 
    children, 
    onClick, 
    disabled = false, 
    active = false,
    className = '',
    title = ''
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        relative inline-flex items-center justify-center min-w-[2.5rem] px-3 py-2 text-sm font-medium border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
        ${active 
          ? 'z-10 bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105' 
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
        }
        ${disabled 
          ? 'opacity-50 cursor-not-allowed bg-gray-100' 
          : 'hover:shadow-md'
        }
        ${className}
      `}
    >
      {children}
    </button>
  )

  const Ellipsis = () => (
    <span className="inline-flex items-center justify-center min-w-[2.5rem] px-3 py-2 text-sm text-gray-500">
      <MoreHorizontal size={16} />
    </span>
  )

  const renderPaginationContent = () => {
    switch (variant) {
      case 'minimal':
        return (
          <div className="flex items-center space-x-2">
            <PageButton
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              title="Trang trước"
            >
              <ChevronLeft size={16} />
            </PageButton>
            
            <div className="text-sm text-gray-600 px-3">
              {currentPage} / {totalPages}
            </div>
            
            <PageButton
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Trang sau"
            >
              <ChevronRight size={16} />
            </PageButton>
          </div>
        )

      case 'compact':
        return (
          <div className="flex items-center space-x-2">
            <PageButton
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              title="Trang đầu"
            >
              <ChevronsLeft size={16} />
            </PageButton>
            
            <PageButton
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              title="Trang trước"
            >
              <ChevronLeft size={16} />
            </PageButton>
            
            <div className="text-sm text-gray-600 px-3">
              Trang {currentPage} / {totalPages}
            </div>
            
            <PageButton
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Trang sau"
            >
              <ChevronRight size={16} />
            </PageButton>
            
            <PageButton
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              title="Trang cuối"
            >
              <ChevronsRight size={16} />
            </PageButton>
          </div>
        )

      default:
        return (
          <>
            {/* First Page */}
            <PageButton
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              title="Trang đầu"
              className="rounded-l-lg"
            >
              <ChevronsLeft size={16} />
            </PageButton>

            {/* Previous Page */}
            <PageButton
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              title="Trang trước"
            >
              <ChevronLeft size={16} />
            </PageButton>

            {/* Page Numbers */}
            {paginationItems.map((item, index) => {
              if (item === 'start-ellipsis' || item === 'end-ellipsis') {
                return <Ellipsis key={`ellipsis-${index}`} />
              }

              return (
                <PageButton
                  key={item}
                  onClick={() => onPageChange(item)}
                  active={currentPage === item}
                  title={`Trang ${item}`}
                >
                  {item}
                </PageButton>
              )
            })}

            {/* Next Page */}
            <PageButton
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Trang sau"
            >
              <ChevronRight size={16} />
            </PageButton>

            {/* Last Page */}
            <PageButton
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              title="Trang cuối"
              className="rounded-r-lg"
            >
              <ChevronsRight size={16} />
            </PageButton>
          </>
        )
    }
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 px-4 py-3 bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Left Section - Page Info */}
      <div className="flex items-center space-x-4">
        {showPageInfo && totalItems > 0 && (
          <div className="text-sm text-gray-600">
            {getPageInfo()}
          </div>
        )}
        
        {showPageSize && onPageSizeChange && (
          <div className="flex items-center space-x-2">
            <label htmlFor="page-size" className="text-sm text-gray-600">
              Hiển thị:
            </label>
            <select
              id="page-size"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {[10, 25, 50, 100].map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Center Section - Pagination Controls */}
      <div className="flex items-center space-x-1">
        {renderPaginationContent()}
      </div>

      {/* Right Section - Quick Page Input */}
      {variant === 'default' && totalPages > 10 && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Đến trang:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            defaultValue={currentPage}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const page = Math.max(1, Math.min(totalPages, parseInt(e.target.value) || 1))
                onPageChange(page)
                e.target.value = ''
              }
            }}
            className="w-16 border border-gray-300 rounded-md px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}
    </div>
  )
}

// Additional pagination variants
export const SimplePagination = (props) => (
  <Pagination {...props} variant="minimal" />
)

export const CompactPagination = (props) => (
  <Pagination {...props} variant="compact" />
)

export default Pagination