// 火漆印章元素
export default function SealStamp({ text = '杨', size = 'md', className = '' }) {
  const sizes = { sm: 'h-7 w-7 text-[10px]', md: 'h-10 w-10 text-xs', lg: 'h-14 w-14 text-sm' }
  return (
    <span
      className={`inline-flex rotate-[-8deg] items-center justify-center border-2 border-cinnabar bg-cinnabar/15 font-calligraphy text-cinnabar ${sizes[size]} ${className}`}
      style={{ borderRadius: '4px' }}
    >
      {text}
    </span>
  )
}
