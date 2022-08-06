import { useRef, useCallback, useState, memo, useEffect } from 'react';
import Box from '@mui/material/Box';
import {
  useVirtualizer,
  observeElementOffset,
  observeElementRect,
} from '@tanstack/react-virtual';
import { LIMIT } from '../utils/feed';
import Button from '@mui/material/Button';

const INITIAL_SIZE = 121;

function RowVirtualizerDynamic({
  items,
  renderRow,
  hasNextPage,
  isLoading,
  isLoadingData,
  fetchMore,
}: {
  items: any;
  renderRow: any;
  hasNextPage: boolean;
  isLoadingData: boolean;
  isLoading: boolean;
  fetchMore: any;
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const parentRef2 = useRef<HTMLDivElement>(null);
  const rows = items ? items?.pages.flatMap((d: any) => d.posts) : [];
  const totalItems = rows?.length || 0; //rows[0] ? rows[0].total : 0;
  const [askForMore, setAskForMore] = useState(false);

  const rowVirtualizer = useVirtualizer({
    estimateSize: useCallback(() => INITIAL_SIZE, []),
    overscan: LIMIT,
    count: hasNextPage ? totalItems + 1 : totalItems,
    getScrollElement: () => parentRef.current,
  });

  useEffect(() => {
    if (isLoadingData) {
      return;
    }

    if (askForMore && !isLoading && hasNextPage) {
      setAskForMore(false);
      setTimeout(() => {
        fetchMore();
      }, 0);
    }
  }, [hasNextPage, fetchMore, isLoading, isLoadingData, askForMore]);

  if (!rows?.length) {
    return null;
  }

  return (
    <Box
      ref={parentRef2}
      className="List"
      style={{
        height: 400,
        overflowY: 'scroll',
        borderTop: '1px solid',
        width: '100%',
      }}
      onScroll={({ currentTarget }) => {
        const { scrollTop, offsetHeight } = currentTarget;
        const size = rowVirtualizer.getTotalSize();
        if (scrollTop + offsetHeight + INITIAL_SIZE * 4 >= size) {
          setAskForMore(true);
        }
      }}
    >
      <Box
        ref={parentRef}
        style={{
          height: rowVirtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow, i) => {
          const isLoaderRow = virtualRow.index > totalItems - 1;
          const idx = virtualRow.index;
          const item = rows[idx];
          return (
            <Box
              key={idx}
              ref={virtualRow.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {isLoaderRow ? (
                <Button
                  onClick={() => fetchMore()}
                  disabled={!hasNextPage || isLoading}
                  style={{
                    height: 121,
                    textAlign: 'center',
                    width: '100%',
                  }}
                >
                  {isLoading
                    ? 'Loading more...'
                    : hasNextPage
                    ? 'Load More'
                    : 'Nothing more to load'}
                </Button>
              ) : item ? (
                renderRow(item)
              ) : null}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default memo(RowVirtualizerDynamic);
