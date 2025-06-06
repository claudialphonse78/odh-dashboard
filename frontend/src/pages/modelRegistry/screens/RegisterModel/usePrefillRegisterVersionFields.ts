import React from 'react';
import { RegisteredModel, ModelVersion, ModelArtifact } from '#~/concepts/modelRegistry/types';
import {
  filterLiveVersions,
  getLastCreatedItem,
  uriToModelLocation,
} from '#~/concepts/modelRegistry/utils';
import { UpdateObjectAtPropAndValue } from '#~/pages/projects/types';
import useModelArtifactsByVersionId from '#~/concepts/modelRegistry/apiHooks/useModelArtifactsByVersionId';
import useModelVersionsByRegisteredModel from '#~/concepts/modelRegistry/apiHooks/useModelVersionsByRegisteredModel';
import { RegisterVersionFormData, ModelLocationType } from './useRegisterModelData';

type UsePrefillRegisterVersionFieldsArgs = {
  registeredModel?: RegisteredModel;
  setData: UpdateObjectAtPropAndValue<RegisterVersionFormData>;
};

type UsePrefillRegisterVersionFieldsReturnVal = {
  loadedPrefillData: boolean;
  loadPrefillDataError?: Error;
  latestVersion?: ModelVersion;
  latestArtifact?: ModelArtifact;
};

export const usePrefillRegisterVersionFields = ({
  registeredModel,
  setData,
}: UsePrefillRegisterVersionFieldsArgs): UsePrefillRegisterVersionFieldsReturnVal => {
  const [allModelVersions, loadedModelVersions, loadModelVersionsError] =
    useModelVersionsByRegisteredModel(registeredModel?.id);
  const liveModelVersions = filterLiveVersions(allModelVersions.items);
  const latestVersion = getLastCreatedItem(liveModelVersions);

  const [modelArtifacts, loadedModelArtifacts, loadModelArtifactsError] =
    useModelArtifactsByVersionId(latestVersion?.id);
  const latestArtifact = getLastCreatedItem(modelArtifacts.items);

  // We don't care about artifact loading state if there is no version
  const isLoadingVersionOrArtifact =
    !!registeredModel && (!loadedModelVersions || (!!latestVersion && !loadedModelArtifacts));
  const errorLoadingVersionOrArtifact = loadModelVersionsError || loadModelArtifactsError;

  // Prefill fields from latest artifact if present. Repeat if selected model changes.
  const prefilledForModelId = React.useRef<string | undefined>();
  React.useEffect(() => {
    if (
      registeredModel &&
      registeredModel.id !== prefilledForModelId.current &&
      !isLoadingVersionOrArtifact
    ) {
      prefilledForModelId.current = registeredModel.id;
      if (latestArtifact) {
        setData('sourceModelFormat', latestArtifact.modelFormatName || '');
        setData('sourceModelFormatVersion', latestArtifact.modelFormatVersion || '');

        const decodedUri = (latestArtifact.uri && uriToModelLocation(latestArtifact.uri)) || null;

        setData('modelLocationType', ModelLocationType.ObjectStorage);
        if (decodedUri?.s3Fields) {
          setData('modelLocationEndpoint', decodedUri.s3Fields.endpoint);
          setData('modelLocationBucket', decodedUri.s3Fields.bucket);
          setData('modelLocationRegion', decodedUri.s3Fields.region || '');
          // Don't prefill the path since a new version will have a new path.
        } else {
          // We don't want an old model's location staying here if we changed models but have no location to prefill.
          setData('modelLocationEndpoint', '');
          setData('modelLocationBucket', '');
          setData('modelLocationRegion', '');
        }
      } else {
        setData('sourceModelFormat', '');
        setData('sourceModelFormatVersion', '');
        setData('modelLocationType', ModelLocationType.ObjectStorage);
        setData('modelLocationEndpoint', '');
        setData('modelLocationBucket', '');
        setData('modelLocationRegion', '');
      }
    }
  }, [registeredModel, isLoadingVersionOrArtifact, latestArtifact, setData]);

  return {
    loadedPrefillData: !isLoadingVersionOrArtifact,
    loadPrefillDataError: errorLoadingVersionOrArtifact,
    latestVersion,
    latestArtifact,
  };
};
