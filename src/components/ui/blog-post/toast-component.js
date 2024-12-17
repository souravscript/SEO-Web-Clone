import React from 'react'

const ToastComponent = ({title}) => {
  return (
    <div className='w-40'>
        <div className='w-20 h-1 bg-green-600 '></div>
        <div>
            <span>🎉</span>
            <span>Generated a blog post saved by the name {title}</span>
            <button>X</button>
        </div>
    </div>
  )
}

export default ToastComponent