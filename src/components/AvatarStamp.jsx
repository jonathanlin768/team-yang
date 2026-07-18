// 武将画像：优先显示真实头像（profile.avatar），无头像时回退到首字印章占位
export default function AvatarStamp({ name = '?', avatar = '', size = 'md', className = '' }) {
  const sizes = {
    sm: 'text-2xl',
    md: 'text-5xl',
    lg: 'text-7xl',
    xl: 'text-8xl',
  }
  const initial = name.trim().charAt(0)
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-b from-xuantie-800 to-xuantie-950 bg-brushed ${className}`}
    >
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className={`font-calligraphy text-gilded select-none ${sizes[size]}`}>{initial}</span>
      )}
      {/* 四角暗金角纹 */}
      <span className="absolute left-1 top-1 h-3 w-3 border-l-2 border-t-2 border-gold-700/60" />
      <span className="absolute right-1 top-1 h-3 w-3 border-r-2 border-t-2 border-gold-700/60" />
      <span className="absolute bottom-1 left-1 h-3 w-3 border-b-2 border-l-2 border-gold-700/60" />
      <span className="absolute bottom-1 right-1 h-3 w-3 border-b-2 border-r-2 border-gold-700/60" />
    </div>
  )
}
