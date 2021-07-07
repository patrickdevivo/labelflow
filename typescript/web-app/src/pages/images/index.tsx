import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import NextLink from "next/link";
import {
  VStack,
  Box,
  Image,
  Center,
  Spinner,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  Wrap,
  WrapItem,
  Heading,
} from "@chakra-ui/react";
import { isEmpty } from "lodash/fp";
import { RiArrowRightSLine } from "react-icons/ri";
import { KeymapButton } from "../../components/keymap-button";
import { ImportButton } from "../../components/import-button";
import { ExportButton } from "../../components/export-button";
import { Meta } from "../../components/meta";
import { Layout } from "../../components/layout";
import type { Image as ImageType } from "../../graphql-types.generated";
import { EmptyStateImage } from "../../components/empty-state";

export const imagesQuery = gql`
  query getImages {
    images {
      id
      name
      url
    }
  }
`;

const ImagesPage = () => {
  const { data: imagesResult } =
    useQuery<{ images: Pick<ImageType, "id" | "url" | "name">[] }>(imagesQuery);

  return (
    <>
      <Meta title="Labelflow | Images" />
      <Layout
        topBarLeftContent={
          <Breadcrumb
            spacing="8px"
            separator={<RiArrowRightSLine color="gray.500" />}
          >
            <BreadcrumbItem>
              <Text>Images</Text>
            </BreadcrumbItem>
          </Breadcrumb>
        }
        topBarRightContent={
          <>
            <KeymapButton />
            <ExportButton />
          </>
        }
      >
        {!imagesResult && (
          <Center h="full">
            <Spinner size="xl" />
          </Center>
        )}
        {imagesResult && isEmpty(imagesResult?.images) && (
          <Center h="full">
            <Box as="section">
              <Box
                maxW="2xl"
                mx="auto"
                px={{ base: "6", lg: "8" }}
                py={{ base: "16", sm: "20" }}
                textAlign="center"
              >
                <EmptyStateImage w="full" />
                <Heading as="h2">You don&apos;t have any images.</Heading>
              </Box>
            </Box>
          </Center>
        )}

        {imagesResult && !isEmpty(imagesResult?.images) && (
          <Wrap h="full" spacing={8} padding={8} justify="space-evenly">
            {imagesResult?.images?.map(({ id, name, url }) => (
              <NextLink href={`/images/${id}`} key={id}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>
                  <WrapItem p={4} background="white" rounded={8}>
                    <VStack w="20rem" h="20rem" justify="space-between">
                      <Heading
                        as="h3"
                        size="sm"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        w="full"
                      >
                        {name}
                      </Heading>
                      <Image
                        background="gray.100"
                        alt={name}
                        src={url}
                        ignoreFallback
                        objectFit="contain"
                        h="18rem"
                        w="full"
                      />
                    </VStack>
                  </WrapItem>
                </a>
              </NextLink>
            ))}
          </Wrap>
        )}
      </Layout>
    </>
  );
};

export default ImagesPage;
