/* eslint-disable jsx-a11y/anchor-is-valid */
import { memo } from "react";
import Link from "next/link";
import { Image, Box, Skeleton, Badge, AspectRatio } from "@chakra-ui/react";

import { itemHeight } from "./constants";

type Props = {
  size: number;
  start: number;
  url?: string;
  imageId?: string;
  datasetSlug?: string;
  isSelected: boolean;
  index: number;
};

export const GalleryItem = memo(
  ({ size, start, url, imageId, datasetSlug, isSelected, index }: Props) => {
    return (
      <Box
        position="absolute"
        top={0}
        left={0}
        height={itemHeight}
        width={`${size}px`}
        transform={`translateX(${start}px)`}
        pl="7.5px"
        pr="7.5px"
      >
        {imageId ? (
          <Link
            href={`/local/datasets/${datasetSlug}/images/${imageId}`}
            passHref
          >
            <a aria-current={isSelected ? "page" : undefined}>
              <Badge
                pointerEvents="none"
                position="absolute"
                top="5px"
                left="12.5px"
                bg="rgba(0, 0, 0, 0.6)"
                color="white"
                borderRadius="full"
                zIndex={2}
              >
                {index + 1}
              </Badge>
              <AspectRatio ratio={3 / 2}>
                <Image
                  src={url}
                  fallback={
                    <Skeleton height="100%" width="100%" borderRadius="md" />
                  }
                  height="100%"
                  width="100%"
                  align="center center"
                  fit="cover"
                  border="4px solid"
                  borderColor={isSelected ? "brand.500" : "transparent"}
                  borderRadius="md"
                />
              </AspectRatio>
            </a>
          </Link>
        ) : (
          <Skeleton height="100%" width="100%" borderRadius="md" />
        )}
      </Box>
    );
  }
) as (props: Props) => JSX.Element;
