import React from 'react'
import { Box, Typography, Paper } from '@mui/material'

interface DataPoint {
  label: string
  value: number
  color?: string
}

interface SimpleBarChartProps {
  data: DataPoint[]
  title: string
  height?: number
  maxValue?: number
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ 
  data, 
  title, 
  height = 200,
  maxValue 
}) => {
  const max = maxValue || Math.max(...data.map(d => d.value))
  
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ height, display: 'flex', alignItems: 'flex-end', gap: 1 }}>
        {data.map((item, index) => (
          <Box
            key={index}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {item.value}
            </Typography>
            <Box
              sx={{
                width: '100%',
                backgroundColor: item.color || 'primary.main',
                borderRadius: 1,
                height: `${(item.value / max) * 80}%`,
                minHeight: '4px',
                transition: 'height 0.3s ease',
              }}
            />
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                transform: 'rotate(-45deg)',
                fontSize: '0.65rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '60px',
              }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  )
}

interface SimpleLineChartProps {
  data: DataPoint[]
  title: string
  height?: number
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({ 
  data, 
  title, 
  height = 200 
}) => {
  const max = Math.max(...data.map(d => d.value))
  const min = Math.min(...data.map(d => d.value))
  const range = max - min

  const getY = (value: number) => {
    if (range === 0) return 50
    return 90 - ((value - min) / range) * 80
  }

  const pathData = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = getY(point.value)
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ height, position: 'relative' }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(25, 118, 210, 0.3)" />
              <stop offset="100%" stopColor="rgba(25, 118, 210, 0.05)" />
            </linearGradient>
          </defs>
          
          {/* Area under the curve */}
          <path
            d={`${pathData} L 100 100 L 0 100 Z`}
            fill="url(#lineGradient)"
            stroke="none"
          />
          
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#1976d2"
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          />
          
          {/* Data points */}
          {data.map((point, index) => (
            <circle
              key={index}
              cx={(index / (data.length - 1)) * 100}
              cy={getY(point.value)}
              r="1"
              fill="#1976d2"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        
        {/* Labels */}
        <Box sx={{ 
          position: 'absolute', 
          bottom: -20, 
          left: 0, 
          right: 0, 
          display: 'flex', 
          justifyContent: 'space-between' 
        }}>
          {data.map((point, index) => (
            <Typography 
              key={index}
              variant="caption" 
              color="text.secondary"
              sx={{ fontSize: '0.65rem' }}
            >
              {point.label}
            </Typography>
          ))}
        </Box>
      </Box>
    </Paper>
  )
}

interface DonutChartProps {
  data: DataPoint[]
  title: string
  size?: number
}

export const SimpleDonutChart: React.FC<DonutChartProps> = ({ 
  data, 
  title, 
  size = 120 
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let cumulativePercentage = 0

  const colors = [
    '#1976d2', '#dc004e', '#ed6c02', '#2e7d32', '#9c27b0', 
    '#d32f2f', '#7b1fa2', '#303f9f', '#0288d1', '#00796b'
  ]

  return (
    <Paper sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <svg width={size} height={size}>
          <g transform={`translate(${size/2}, ${size/2})`}>
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const startAngle = (cumulativePercentage / 100) * 360
              const endAngle = ((cumulativePercentage + percentage) / 100) * 360
              
              cumulativePercentage += percentage

              const startAngleRad = (startAngle * Math.PI) / 180
              const endAngleRad = (endAngle * Math.PI) / 180
              
              const outerRadius = size * 0.4
              const innerRadius = size * 0.25
              
              const x1 = Math.cos(startAngleRad) * outerRadius
              const y1 = Math.sin(startAngleRad) * outerRadius
              const x2 = Math.cos(endAngleRad) * outerRadius
              const y2 = Math.sin(endAngleRad) * outerRadius
              const x3 = Math.cos(endAngleRad) * innerRadius
              const y3 = Math.sin(endAngleRad) * innerRadius
              const x4 = Math.cos(startAngleRad) * innerRadius
              const y4 = Math.sin(startAngleRad) * innerRadius

              const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

              const pathData = `
                M ${x1} ${y1} 
                A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
                L ${x3} ${y3} 
                A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
                Z
              `

              return (
                <path
                  key={index}
                  d={pathData}
                  fill={item.color || colors[index % colors.length]}
                  stroke="#fff"
                  strokeWidth="1"
                />
              )
            })}
          </g>
        </svg>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
          {data.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: item.color || colors[index % colors.length],
                  borderRadius: '50%',
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {item.label}: {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  )
}