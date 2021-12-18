import React, { useRef, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import { useVirtual } from 'react-virtual';

export default function RowVirtualizerDynamic({
  items: rows,
  renderRow,
  hasNextPage,
  isLoading,
  fetchMore,
}: {
  items: any;
  renderRow: any;
  hasNextPage: any;
  isLoading: any;
  fetchMore: any;
}) {
  //console.log(rows);
  const parentRef = useRef();

  const rowVirtualizer = useVirtual({
    parentRef,
    size: hasNextPage ? rows.length + 1 : rows.length,
    estimateSize: useCallback(() => 121, []),
    overscan: 10,
  });

  useEffect(() => {
    console.log('paginate');
    const [lastItem] = [...rowVirtualizer.virtualItems].reverse();

    if (!lastItem) {
      return;
    }

    if (hasNextPage && !isLoading) {
      fetchMore();
    }
  }, [
    fetchMore,
    hasNextPage,
    isLoading,
    rowVirtualizer.virtualItems,
    rows.length,
  ]);

  return (
    <>
      <Box
        ref={parentRef}
        className="List"
        style={{
          height: 500,
          overflowY: 'scroll',
          borderTop: '1px solid',
          width: '100%',
        }}
      >
        <Box
          style={{
            height: `${rowVirtualizer.totalSize}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.virtualItems.map((virtualRow) => {
            const isLoaderRow = virtualRow.index > rows.length - 1;
            return (
              <Box
                key={virtualRow.index}
                ref={virtualRow.measureRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${rows[virtualRow.index]}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {isLoaderRow
                  ? hasNextPage
                    ? 'Loading'
                    : 'Nothing more to load'
                  : renderRow(rows[virtualRow.index])}
              </Box>
            );
          })}
        </Box>
      </Box>
    </>
  );
}
