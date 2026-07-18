// Bilibili 嵌入式播放器
export default function BilibiliPlayer({ bvid, title = '' }) {
  return (
    <div className="clip-corner-sm relative aspect-video w-full overflow-hidden border border-gold-800/60 bg-black">
      <iframe
        src={`//player.bilibili.com/player.html?bvid=${bvid}&autoplay=0`}
        title={title || bvid}
        scrolling="no"
        frameBorder="0"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  )
}
