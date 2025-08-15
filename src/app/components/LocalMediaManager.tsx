"use client";

import { useState } from "react";

export type LocalMediaFile = {
  id: string; // temporary ID for local state
  url: string;
  fileName: string;
  fileType: string;
};

type LocalMediaManagerProps = {
  mediaFiles: LocalMediaFile[];
  onMediaChange: (mediaFiles: LocalMediaFile[]) => void;
  readOnly?: boolean;
};

export function LocalMediaManager({
  mediaFiles,
  onMediaChange,
  readOnly = false,
}: LocalMediaManagerProps) {
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [newMediaName, setNewMediaName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const generateId = () =>
    `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const getFileTypeFromUrl = (url: string): string => {
    const extension = url.split(".").pop()?.toLowerCase();

    if (!extension) return "unknown";

    const imageTypes = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
    const videoTypes = ["mp4", "avi", "mov", "wmv", "flv", "webm"];
    const audioTypes = ["mp3", "wav", "ogg", "aac"];
    const documentTypes = ["pdf", "doc", "docx", "txt"];

    if (imageTypes.includes(extension)) return "image";
    if (videoTypes.includes(extension)) return "video";
    if (audioTypes.includes(extension)) return "audio";
    if (documentTypes.includes(extension)) return "document";

    return "unknown";
  };

  const handleAddMedia = () => {
    if (!newMediaUrl.trim()) return;

    setError(null);

    try {
      // Validate URL
      new URL(newMediaUrl.trim());

      const finalFileName =
        newMediaName.trim() || newMediaUrl.split("/").pop() || "media-file";
      const finalFileType = getFileTypeFromUrl(newMediaUrl.trim());

      const newMedia: LocalMediaFile = {
        id: generateId(),
        url: newMediaUrl.trim(),
        fileName: finalFileName,
        fileType: finalFileType,
      };

      onMediaChange([...mediaFiles, newMedia]);
      setNewMediaUrl("");
      setNewMediaName("");
      setIsAddingMedia(false);
    } catch {
      setError("Please enter a valid URL");
    }
  };

  const handleDeleteMedia = (mediaId: string) => {
    onMediaChange(mediaFiles.filter((media) => media.id !== mediaId));
  };

  const isImageType = (media: LocalMediaFile): boolean => {
    return (
      media.fileType === "image" ||
      media.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) !== null
    );
  };

  const isVideoType = (media: LocalMediaFile): boolean => {
    return (
      media.fileType === "video" ||
      media.url.match(/\.(mp4|avi|mov|wmv|flv|webm)$/i) !== null
    );
  };

  return (
    <div className="space-y-4">
      {/* Media Grid */}
      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mediaFiles.map((media, index) => (
            <div
              key={media.id}
              className="relative group bg-gray-800/50 rounded-lg overflow-hidden animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-video bg-gray-700 flex items-center justify-center">
                {isImageType(media) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={media.url}
                    alt={media.fileName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to document icon if image fails to load
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.classList.remove(
                        "hidden"
                      );
                    }}
                  />
                ) : isVideoType(media) ? (
                  <video
                    src={media.url}
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                  />
                ) : (
                  <div className="text-center p-4">
                    <div className="text-2xl mb-2">📄</div>
                    <span className="text-xs text-gray-400 break-all">
                      {media.fileName}
                    </span>
                  </div>
                )}

                {/* Fallback for failed images */}
                <div className="hidden text-center p-4">
                  <div className="text-2xl mb-2">📄</div>
                  <span className="text-xs text-gray-400 break-all">
                    {media.fileName}
                  </span>
                </div>
              </div>

              {/* Media Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <div className="text-xs text-white">
                  <div className="truncate font-medium">{media.fileName}</div>
                  <div className="text-gray-300">
                    🔗 Link • {media.fileType}
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => handleDeleteMedia(media.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove media"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}

              {/* View/Open Button */}
              <a
                href={media.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-2 left-2 w-6 h-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Open in new tab"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {mediaFiles.length === 0 && (
        <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-700 rounded-lg">
          <div className="text-4xl mb-2">🖼️</div>
          <p>No media files yet</p>
          {!readOnly && (
            <p className="text-sm">
              Add images, videos, or documents to showcase your work
            </p>
          )}
        </div>
      )}

      {/* Add Media Section */}
      {!readOnly && (
        <div className="border-t border-gray-700 pt-4">
          {!isAddingMedia ? (
            <button
              type="button"
              onClick={() => setIsAddingMedia(true)}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-600 hover:border-indigo-500 text-gray-400 hover:text-indigo-400 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Media Link
            </button>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="bg-red-900/20 border border-red-700/50 text-red-300 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Media URL *
                </label>
                <input
                  type="url"
                  required
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newMediaUrl.trim()) {
                      e.preventDefault();
                      handleAddMedia();
                    }
                  }}
                  className="w-full rounded-lg border border-gray-600 px-3 py-2 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Display Name (Optional)
                </label>
                <input
                  type="text"
                  value={newMediaName}
                  onChange={(e) => setNewMediaName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newMediaUrl.trim()) {
                      e.preventDefault();
                      handleAddMedia();
                    }
                  }}
                  className="w-full rounded-lg border border-gray-600 px-3 py-2 bg-gray-800/50 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                  placeholder="My awesome design..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingMedia(false);
                    setNewMediaUrl("");
                    setNewMediaName("");
                    setError(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddMedia}
                  disabled={!newMediaUrl.trim()}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Add Media
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
