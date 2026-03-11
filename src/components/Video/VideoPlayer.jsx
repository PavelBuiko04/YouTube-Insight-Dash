export default function VideoPlayer({ videoId }) {
  return (
    <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video player"
        className="w-full h-full"
      />
    </div>
  )
}
