import { MutableRefObject, useEffect, useState, useCallback } from "react";
import { Feature, Map as OlMap } from "ol";
import { Geometry, Polygon } from "ol/geom";
import { Vector as OlSourceVector } from "ol/source";
import Collection from "ol/Collection";
import { extend } from "@labelflow/react-openlayers-fiber";
import { ApolloClient, useApolloClient, gql, useQuery } from "@apollo/client";
import { useToast, UseToastOptions } from "@chakra-ui/react";
import { ModifyEvent } from "ol/interaction/Modify";
import { TranslateEvent } from "ol/interaction/Translate";
import { LabelType } from "@labelflow/graphql-types";
import { SelectInteraction } from "./select-interaction";
import { Tools, useLabelingStore } from "../../../../connectors/labeling-state";
import {
  ResizeIogBox,
  ResizeIogEvent,
} from "./resize-and-translate-box-interaction-iog";
import {
  ResizeAndTranslateBox,
  ResizeAndTranslateEvent,
} from "./resize-and-translate-box-interaction";
import { Effect, useUndoStore } from "../../../../connectors/undo-store";
import { createUpdateLabelEffect } from "../../../../connectors/undo-store/effects/update-label";
import { createRunIogEffect } from "../../../../connectors/undo-store/effects/run-iog";
import {
  extractSmartToolInputInputFromIogMask,
  getIogMaskIdFromLabelId,
  getLabelIdFromIogMaskId,
} from "../../../../connectors/iog";

// Extend react-openlayers-catalogue to include resize and translate interaction
extend({
  ResizeAndTranslateBox: { object: ResizeAndTranslateBox, kind: "Interaction" },
  ResizeIogBox: { object: ResizeIogBox, kind: "Interaction" },
});

const getLabelQuery = gql`
  query getLabel($id: ID!) {
    label(where: { id: $id }) {
      type
      id
      geometry {
        type
        coordinates
      }
      labelClass {
        id
        color
      }
    }
  }
`;

export const interactionEnd = async (
  e:
    | TranslateEvent
    | ModifyEvent
    | ResizeAndTranslateEvent
    | ResizeIogEvent
    | null,
  perform: (effect: Effect<any>) => Promise<void>,
  client: ApolloClient<Object>,
  imageId: string,
  toast: (options: UseToastOptions) => void
) => {
  const feature = e?.features?.item(0) as Feature<Polygon>;
  if (feature != null) {
    const coordinates = feature.getGeometry().getCoordinates();
    const geometry = { type: "Polygon", coordinates };
    const { id: labelId } = feature.getProperties();
    try {
      await perform(
        createUpdateLabelEffect(
          {
            labelId,
            geometry,
            imageId,
          },
          { client }
        )
      );
    } catch (error) {
      toast({
        title: "Error updating label",
        // @ts-ignore
        description: error?.message,
        isClosable: true,
        status: "error",
        position: "bottom-right",
        duration: 10000,
      });
    }
  }
  return true;
};

export const interactionEndIog = async (
  e:
    | TranslateEvent
    | ModifyEvent
    | ResizeAndTranslateEvent
    | ResizeIogEvent
    | null,
  perform: (effect: Effect<any>) => Promise<void>,
  client: ApolloClient<Object>,
  toast: (options: UseToastOptions) => void
) => {
  const feature = e?.features?.item(0) as Feature<Polygon>;
  if (feature != null) {
    const { id: labelIdIog } = feature.getProperties();
    try {
      await perform(
        createRunIogEffect(
          {
            labelId: getLabelIdFromIogMaskId(labelIdIog),
            ...extractSmartToolInputInputFromIogMask(
              feature.getGeometry().getCoordinates()
            ),
          },
          { client }
        )
      );
    } catch (error) {
      toast({
        title: "Error running IOG",
        // @ts-ignore
        description: error?.message,
        isClosable: true,
        status: "error",
        position: "bottom-right",
        duration: 10000,
      });
    }
  }
  return true;
};

export const SelectAndModifyFeature = (props: {
  sourceVectorLabelsRef: MutableRefObject<OlSourceVector<Geometry> | null>;
  map: OlMap | null;
  image: { id?: string; width?: number; height?: number };
  setIsContextMenuOpen?: (state: boolean) => void;
  editClassOverlayRef?: MutableRefObject<HTMLDivElement | null>;
}) => {
  const {
    sourceVectorLabelsRef,
    image: { id: imageId },
  } = props;

  // We need to have this state in order to store the selected feature in the addfeature listener below
  const [selectedFeature, setSelectedFeature] =
    useState<Feature<Polygon> | null>(null);
  const [selectedFeatureIog, setSelectedFeatureIog] =
    useState<Feature<Polygon> | null>(null);
  const selectedLabelId = useLabelingStore((state) => state.selectedLabelId);
  const selectedTool = useLabelingStore((state) => state.selectedTool);

  const { data: labelData } = useQuery(getLabelQuery, {
    variables: { id: selectedLabelId },
    skip: selectedLabelId == null,
  });

  const getSelectedFeature = useCallback(() => {
    if (selectedFeature?.getProperties()?.id !== selectedLabelId) {
      if (selectedLabelId == null) {
        setSelectedFeature(null);
      } else {
        const featureFromSource = sourceVectorLabelsRef.current
          ?.getFeatures()
          ?.filter(
            (feature) => feature.getProperties().id === selectedLabelId
          )?.[0];
        if (featureFromSource != null) {
          setSelectedFeature(featureFromSource as Feature<Polygon>);
        }
        const featureFromSourceIog = sourceVectorLabelsRef.current
          ?.getFeatures()
          ?.filter(
            (feature) =>
              feature.getProperties().id ===
              getIogMaskIdFromLabelId(selectedLabelId)
          )?.[0];
        if (featureFromSourceIog != null) {
          setSelectedFeatureIog(featureFromSourceIog as Feature<Polygon>);
        }
      }
    }
  }, [selectedLabelId, sourceVectorLabelsRef.current]);

  // This is needed to make sure that each time a new feature is added to OL we check if it's the selected feature (for instance when we reload the page and we have a selected label but labels haven't been added to OL yet)
  useEffect(() => {
    sourceVectorLabelsRef.current?.on("addfeature", getSelectedFeature);
    return () =>
      sourceVectorLabelsRef.current?.un("addfeature", getSelectedFeature);
  }, [sourceVectorLabelsRef.current, selectedLabelId]);

  useEffect(() => {
    getSelectedFeature();
  }, [selectedLabelId]);

  const client = useApolloClient();
  const { perform } = useUndoStore();
  const toast = useToast();
  return (
    <>
      <SelectInteraction key="SelectInteraction" {...props} />

      {selectedTool === Tools.SELECTION &&
        labelData?.label?.type === LabelType.Box && (
          /* @ts-ignore - We need to add this because resizeAndTranslateBox is not included in the react-openalyers-fiber original catalogue */
          <resizeAndTranslateBox
            args={{ selectedFeature, pixelTolerance: 20 }}
            onInteractionEnd={async (e: ResizeAndTranslateEvent | null) => {
              return await interactionEnd(
                e,
                perform,
                client,
                imageId as string,
                toast
              );
            }}
          />
        )}
      {selectedTool === Tools.IOG && (
        /* @ts-ignore - We need to add this because resizeAndTranslateBox is not included in the react-openalyers-fiber original catalogue */
        <resizeIogBox
          args={{ selectedFeature: selectedFeatureIog, pixelTolerance: 20 }}
          onInteractionEnd={async (e: ResizeIogEvent | null) => {
            return await interactionEndIog(e, perform, client, toast);
          }}
        />
      )}
      {selectedTool === Tools.SELECTION &&
        labelData?.label?.type === LabelType.Polygon &&
        selectedFeature && (
          <>
            <olInteractionTranslate
              args={{ features: new Collection([selectedFeature]) }}
              onTranslateend={async (e: TranslateEvent | null) => {
                return await interactionEnd(
                  e,
                  perform,
                  client,
                  imageId as string,
                  toast
                );
              }}
            />
            <olInteractionModify
              args={{
                features: new Collection([selectedFeature]),
                pixelTolerance: 20,
              }}
              onModifyend={async (e: ModifyEvent | null) => {
                return await interactionEnd(
                  e,
                  perform,
                  client,
                  imageId as string,
                  toast
                );
              }}
            />
            <olInteractionPointer
              args={{
                handleMoveEvent: (e) => {
                  const mapTargetViewport = e.map.getViewport();
                  if (mapTargetViewport != null) {
                    const clonedFeature = selectedFeature.clone();
                    clonedFeature.getGeometry().scale(0.95);
                    if (
                      clonedFeature
                        ?.getGeometry()
                        ?.intersectsCoordinate(e.coordinate) ??
                      false
                    ) {
                      mapTargetViewport.style.cursor = "move";
                    }
                  }
                },
              }}
            />
          </>
        )}
    </>
  );
};
