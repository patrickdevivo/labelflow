import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
// import { useQueryParam, StringParam, withDefault } from "use-query-params";
import { useApolloClient } from "@apollo/client";
import { ImportImagesModalUrlList } from "./modal-url-list/modal-url-list";
import { datasetDataQuery } from "../../../pages/[workspaceSlug]/datasets/[datasetSlug]/images";
import { getDatasetsQuery } from "../../../pages/[workspaceSlug]/datasets";

export const ImportImagesModal = ({
  isOpen = false,
  onClose = () => {},
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  const client = useApolloClient();
  const router = useRouter();
  const { datasetSlug, workspaceSlug } = router?.query;

  const [isCloseable, setCloseable] = useState(true);
  const [hasUploaded, setHasUploaded] = useState(false);

  useEffect(() => {
    // Manually refetch
    if (hasUploaded) {
      client.query({
        query: datasetDataQuery,
        variables: {
          slug: datasetSlug,
          workspaceSlug,
        },
        fetchPolicy: "network-only",
      });
      client.query({ query: getDatasetsQuery, fetchPolicy: "network-only" });
    }
  }, [hasUploaded]);

  return (
    <Modal
      isOpen={isOpen}
      size="xl"
      scrollBehavior="inside"
      onClose={() => {
        if (!isCloseable) return;
        onClose();
        setHasUploaded(false);
      }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent height="80vh">
        <ModalCloseButton disabled={!isCloseable} />
        <ImportImagesModalUrlList
          setMode={() => {}}
          onUploadStart={() => {
            setCloseable(false);
          }}
          onUploadEnd={() => {
            setCloseable(true);
            setHasUploaded(true);
          }}
        />

        <ModalFooter visibility={hasUploaded ? "visible" : "hidden"}>
          <Button
            colorScheme="brand"
            onClick={() => {
              onClose();
              setHasUploaded(false);
            }}
          >
            Start labelling
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
