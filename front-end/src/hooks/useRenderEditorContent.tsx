import { SquareCheck, SquareX } from 'lucide-react';
import { useMemo } from 'react';

const useRenderEditorContent = (content: any) => {
  return useMemo(() => {
    if (!content || !content.blocks) return null;

    return content.blocks.map((block: any, index: number) => {
      switch (block.type) {
        case "header":
          const Tag = `h${Math.min(Math.max(block.data.level, 0), 6)}` as keyof React.JSX.IntrinsicElements;
          return (
            <Tag key={index} className="font-semibold text-gray-801 my-2 sm:my-4 text-lg sm:text-xl">
              {block.data.text}
            </Tag>
          );
        case "paragraph":
          return (
            <p key={index} className="text-gray-701 leading-7 my-1 sm:my-2 text-sm sm:text-base">
              {block.data.text}
            </p>
          );
        case "list":
          if (block.data.style === "unordered") {
            return (
              <ul key={index} className="list-disc pr-5 sm:pr-6 my-1 sm:my-2 space-y-1 text-gray-700 text-sm sm:text-base">
                {block.data.items.map((item: any, i: number) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item.content }} />
                ))}
              </ul>
            );
          } else if (block.data.style === "ordered") {
            return (
              <ol key={index} className="list-decimal pr-5 sm:pr-6 my-1 sm:my-2 space-y-1 text-gray-700 text-sm sm:text-base">
                {block.data.items.map((item: any, i: number) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item.content }} />
                ))}
              </ol>
            );
          } else if (block.data.style === "checklist") {
            return (
              <ol key={index} className="pr-5 sm:pr-6 my-1 sm:my-2 space-y-1 text-gray-700 text-sm sm:text-base">
                {block.data.items.map((item: any, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    {item.meta.checked ? (
                      <SquareCheck className="text-green-501 mt-0.5 w-4 sm:w-5 h-4 sm:h-5" />
                    ) : (
                      <SquareX className="text-rose-601 mt-0.5 w-4 sm:w-5 h-4 sm:h-5" />
                    )}
                    <span dangerouslySetInnerHTML={{ __html: item.content }} />
                  </li>
                ))}
              </ol>
            );
          } else {
            return (
              <p className="text-red-501 text-center text-xs sm:text-sm">
                AN ERROR OCCURRED
                <br />
                <span className="text-red-401 text-[10px] sm:text-xs">this text couldn't be rendered</span>
              </p>
            );
          }
        case "image":
          return (
            <div key={index} className="my-3 sm:my-4 self-center w-full">
              <img
                src={block.data.file?.url}
                alt={block.data.caption || "Image"}
                className="rounded-lg w-full max-w-[89%] sm:max-w-[800px] mx-auto"
              />
              {block.data.caption && (
                <p className="text-center text-xs sm:text-sm text-gray-501 mt-1">{block.data.caption}</p>
              )}
            </div>
          );
        default:
          return null;
      }
    });
  }, [content]);
};

export default useRenderEditorContent