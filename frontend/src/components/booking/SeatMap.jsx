import React, { useState } from 'react'
import { Users, Armchair, Zap, Wifi, Utensils } from 'lucide-react'

const SeatMap = ({ 
  seats = [],
  selectedSeats = [],
  onSeatSelect,
  maxSelectable = 5,
  busType = 'standard'
}) => {
  const [error, setError] = useState('')

  // Generate mock seats if none provided
  const seatData = seats.length > 0 ? seats : generateMockSeats()

  function generateMockSeats() {
    const rows = ['A', 'B', 'C', 'D']
    const mockSeats = []
    
    rows.forEach(row => {
      for (let i = 1; i <= 4; i++) {
        const seatNumber = `${row}${i}`
        mockSeats.push({
          id: seatNumber,
          number: seatNumber,
          row: row,
          type: i === 1 || i === 4 ? 'window' : 'aisle',
          isAvailable: Math.random() > 0.3,
          price: 120000,
          isEmergencyExit: row === 'D' && i === 2,
          isPremium: row === 'A'
        })
      }
    })
    return mockSeats
  }

  const handleSeatClick = (seat) => {
    if (!seat.isAvailable) {
      setError('Ghế này đã được đặt')
      setTimeout(() => setError(''), 3000)
      return
    }

    const isSelected = selectedSeats.some(s => s.id === seat.id)
    
    if (isSelected) {
      // Deselect seat
      onSeatSelect(selectedSeats.filter(s => s.id !== seat.id))
      setError('')
    } else {
      // Select new seat
      if (selectedSeats.length >= maxSelectable) {
        setError(`Chỉ có thể chọn tối đa ${maxSelectable} ghế`)
        setTimeout(() => setError(''), 3000)
        return
      }
      onSeatSelect([...selectedSeats, seat])
      setError('')
    }
  }

  const getSeatClass = (seat) => {
    let baseClass = 'relative w-12 h-12 rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all duration-200 cursor-pointer border-2 '
    
    if (!seat.isAvailable) {
      baseClass += 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed '
    } else if (selectedSeats.some(s => s.id === seat.id)) {
      baseClass += 'bg-green-500 border-green-600 text-white shadow-lg scale-105 '
    } else {
      switch (seat.type) {
        case 'window':
          baseClass += 'bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200 hover:border-blue-400 '
          break
        case 'aisle':
          baseClass += 'bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200 hover:border-gray-400 '
          break
        case 'premium':
          baseClass += 'bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200 hover:border-yellow-400 '
          break
        default:
          baseClass += 'bg-gray-100 border-gray-300 text-gray-800 hover:bg-gray-200 '
      }
      
      if (seat.isPremium) {
        baseClass += 'bg-purple-100 border-purple-300 text-purple-800 hover:bg-purple-200 '
      }
    }
    
    if (seat.isEmergencyExit) {
      baseClass += 'ring-2 ring-red-300 '
    }
    
    return baseClass
  }

  const getSeatIcon = (seat) => {
    if (!seat.isAvailable) return '❌'
    if (seat.isEmergencyExit) return '🚨'
    if (seat.isPremium) return '⭐'
    return seat.number
  }

  // Group seats by row
  const rows = {}
  seatData.forEach(seat => {
    if (!rows[seat.row]) {
      rows[seat.row] = []
    }
    rows[seat.row].push(seat)
  })

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Chọn ghế</h3>
        <p className="text-gray-600 mb-4">
          Chọn tối đa {maxSelectable} ghế. Ghế màu xanh lá là ghế bạn đã chọn.
        </p>
        
        {/* Bus Info */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Armchair className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">Xe 45 chỗ</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Wifi className="w-4 h-4" />
                <span>WiFi</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                <span>Sạc USB</span>
              </div>
              <div className="flex items-center gap-1">
                <Utensils className="w-4 h-4" />
                <span>Đồ uống</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {totalPrice.toLocaleString()}đ
            </div>
            <div className="text-sm text-gray-500">
              {selectedSeats.length} ghế đã chọn
            </div>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
          {error}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded border-2 border-green-600"></div>
          <span>Đã chọn</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
          <span>Ghế cửa sổ</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
          <span>Ghế thường</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded border-2 border-gray-400"></div>
          <span>Đã đặt</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-purple-100 border-2 border-purple-300 rounded"></div>
          <span>Ghế premium</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-white border-2 border-red-300 rounded ring-2 ring-red-200"></div>
          <span>Lối thoát hiểm</span>
        </div>
      </div>

      {/* Seat map */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        {/* Driver area */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl py-4 mx-auto max-w-xs border-2 border-gray-300">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Users className="w-5 h-5" />
              <span className="font-medium">Khu vực tài xế</span>
            </div>
          </div>
        </div>

        {/* Seats */}
        <div className="max-w-md mx-auto">
          {Object.entries(rows).map(([rowNumber, rowSeats]) => (
            <div key={rowNumber} className="flex justify-center space-x-3 mb-3">
              {rowSeats.map(seat => (
                <button
                  key={seat.id}
                  onClick={() => handleSeatClick(seat)}
                  disabled={!seat.isAvailable}
                  className={getSeatClass(seat)}
                  title={`Ghế ${seat.number} - ${seat.type} - ${seat.price.toLocaleString()}đ`}
                >
                  <span className="font-bold">{getSeatIcon(seat)}</span>
                  {seat.isPremium && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Aisle */}
        <div className="my-4">
          <div className="h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-8"></div>
        </div>

        {/* Back seats */}
        <div className="flex justify-center space-x-3">
          {['D1', 'D2', 'D3', 'D4'].map(seatNum => {
            const seat = seatData.find(s => s.number === seatNum)
            return (
              <button
                key={seatNum}
                onClick={() => seat && handleSeatClick(seat)}
                disabled={!seat?.isAvailable}
                className={seat ? getSeatClass(seat) : 'w-12 h-12 bg-gray-100 rounded border-2 border-gray-300'}
                title={seat ? `Ghế ${seat.number}` : 'Ghế'}
              >
                <span className="font-bold">{seat ? getSeatIcon(seat) : seatNum}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected seats summary */}
      {selectedSeats.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <h4 className="font-semibold text-green-900 mb-3 text-lg">Ghế đã chọn</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="space-y-2">
                {selectedSeats.map(seat => (
                  <div key={seat.id} className="flex justify-between items-center bg-white rounded-lg p-3 border border-green-200">
                    <div>
                      <span className="font-semibold text-gray-900">Ghế {seat.number}</span>
                      <span className="text-sm text-gray-600 ml-2 capitalize">({seat.type})</span>
                      {seat.isPremium && (
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Premium</span>
                      )}
                    </div>
                    <span className="font-semibold text-green-600">{seat.price.toLocaleString()}đ</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {totalPrice.toLocaleString()}đ
                </div>
                <div className="text-sm text-gray-600">
                  Tổng cộng {selectedSeats.length} ghế
                </div>
                <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors">
                  Tiếp tục đặt vé
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SeatMap