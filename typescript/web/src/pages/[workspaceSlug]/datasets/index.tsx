import React, { useCallback } from "react";
import { gql, useQuery } from "@apollo/client";

import { Flex, Text } from "@chakra-ui/react";

import { useQueryParam } from "use-query-params";

import type { Dataset as DatasetType } from "@labelflow/graphql-types";
import { useRouter } from "next/router";
import { Meta } from "../../../components/meta";
import { Layout } from "../../../components/layout";
import { IdParam, BoolParam } from "../../../utils/query-param-bool";
import { NewDatasetCard, DatasetCard } from "../../../components/datasets";

import { UpsertDatasetModal } from "../../../components/datasets/upsert-dataset-modal";
import { DeleteDatasetModal } from "../../../components/datasets/delete-dataset-modal";
import { ServiceWorkerManagerModal } from "../../../components/service-worker-manager";
import { AuthManager } from "../../../components/auth-manager";
import { WelcomeManager } from "../../../components/welcome-manager";
import { CookieBanner } from "../../../components/cookie-banner";

export const getDatasetsQuery = gql`
  query getDatasets($where: DatasetWhereInput) {
    datasets(where: $where) {
      id
      name
      slug
      images(first: 1) {
        id
        url
      }
      imagesAggregates {
        totalCount
      }
      labelsAggregates {
        totalCount
      }
      labelClassesAggregates {
        totalCount
      }
    }
  }
`;

const DatasetPage = () => {
  const workspaceSlug = useRouter().query?.workspaceSlug;

  const { data: datasetsResult } = useQuery<{
    datasets: Pick<
      DatasetType,
      | "id"
      | "name"
      | "slug"
      | "images"
      | "imagesAggregates"
      | "labelClassesAggregates"
      | "labelsAggregates"
    >[];
  }>(getDatasetsQuery, {
    variables: { where: { workspaceSlug } },
    skip: workspaceSlug == null,
  });

  const [isCreatingDataset, setIsCreatingDataset] = useQueryParam(
    "modal-create-dataset",
    BoolParam
  );
  const [editDatasetId, setEditDatasetId] = useQueryParam(
    "modal-edit-dataset",
    IdParam
  );
  const [deleteDatasetId, setDeleteDatasetId] = useQueryParam(
    "alert-delete-dataset",
    IdParam
  );

  const onClose = useCallback(() => {
    if (editDatasetId) {
      setEditDatasetId(null, "replaceIn");
    }

    if (isCreatingDataset) {
      setIsCreatingDataset(false, "replaceIn");
    }

    if (deleteDatasetId) {
      setDeleteDatasetId(null, "replaceIn");
    }
  }, [editDatasetId, isCreatingDataset, deleteDatasetId]);

  return (
    <>
      <ServiceWorkerManagerModal />
      <WelcomeManager />
      <AuthManager />
      <Meta title="LabelFlow | Datasets" />
      <CookieBanner />
      <Layout breadcrumbs={[<Text key={0}>Datasets</Text>]}>
        <UpsertDatasetModal
          isOpen={isCreatingDataset || editDatasetId != null}
          onClose={onClose}
          datasetId={editDatasetId}
        />

        <DeleteDatasetModal
          isOpen={deleteDatasetId != null}
          onClose={onClose}
          datasetId={deleteDatasetId}
        />

        <Flex direction="row" wrap="wrap" p={4}>
          <NewDatasetCard
            addDataset={() => {
              setIsCreatingDataset(true, "replaceIn");
            }}
          />

          {datasetsResult?.datasets?.map(
            ({
              id,
              slug,
              images,
              name,
              imagesAggregates,
              labelsAggregates,
              labelClassesAggregates,
            }) => (
              <DatasetCard
                key={id}
                url={`/${workspaceSlug}/datasets/${slug}`}
                imageUrl={images[0]?.url}
                datasetName={name}
                imagesCount={imagesAggregates.totalCount}
                labelClassesCount={labelClassesAggregates.totalCount}
                labelsCount={labelsAggregates.totalCount}
                editDataset={() => {
                  setEditDatasetId(id, "replaceIn");
                }}
                deleteDataset={() => {
                  setDeleteDatasetId(id, "replaceIn");
                }}
              />
            )
          )}
        </Flex>
      </Layout>
    </>
  );
};

export default DatasetPage;
