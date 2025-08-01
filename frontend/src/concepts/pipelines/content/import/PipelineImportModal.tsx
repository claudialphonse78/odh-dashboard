/* eslint-disable camelcase */
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePipelinesAPI } from '#~/concepts/pipelines/context';
import { PipelineKF } from '#~/concepts/pipelines/kfTypes';
import { pipelineVersionDetailsRoute } from '#~/routes/pipelines/global';
import { getNameEqualsFilter } from '#~/concepts/pipelines/utils';
import { fireFormTrackingEvent } from '#~/concepts/analyticsTracking/segmentIOUtils';
import { TrackingOutcome } from '#~/concepts/analyticsTracking/trackingProperties';
import { DSPipelineAPIServerStore } from '#~/k8sTypes.ts';
import { usePipelineImportModalData } from './useImportModalData';
import PipelineImportBase from './PipelineImportBase';
import { PipelineUploadOption } from './utils';

type PipelineImportModalProps = {
  onClose: (pipeline?: PipelineKF) => void;
  redirectAfterImport?: boolean;
};

const pipelineImported = 'Pipeline Imported';
const PipelineImportModal: React.FC<PipelineImportModalProps> = ({
  redirectAfterImport = true,
  onClose,
}) => {
  const navigate = useNavigate();
  const { api, namespace } = usePipelinesAPI();
  const [modalData, setData, resetData] = usePipelineImportModalData();

  const handleClose = React.useCallback(
    async (pipeline?: PipelineKF) => {
      if (!pipeline) {
        fireFormTrackingEvent(pipelineImported, { outcome: TrackingOutcome.cancel });
      }
      onClose(pipeline);

      if (pipeline && redirectAfterImport) {
        const { pipeline_versions: versions } = await api.listPipelineVersions(
          {},
          pipeline.pipeline_id,
          {
            pageSize: 1,
          },
        );
        const versionId = versions?.[0].pipeline_version_id;

        if (versionId) {
          navigate(pipelineVersionDetailsRoute(namespace, pipeline.pipeline_id, versionId));
        }
      }
    },
    [api, namespace, redirectAfterImport, navigate, onClose],
  );

  const submitAction = React.useCallback(() => {
    const { name, description, fileContents, pipelineUrl, uploadOption, displayName } = modalData;
    fireFormTrackingEvent(pipelineImported, {
      outcome: TrackingOutcome.submit,
      mode: uploadOption === PipelineUploadOption.FILE_UPLOAD ? 'file' : 'url',
    });
    if (uploadOption === PipelineUploadOption.FILE_UPLOAD) {
      return api.uploadPipeline({}, name, description, fileContents, displayName);
    }
    return api.createPipelineAndVersion(
      {},
      {
        pipeline: {
          name,
          display_name: displayName,
          description,
        },
        pipeline_version: {
          name,
          display_name: displayName,
          description,
          package_url: {
            pipeline_url: pipelineUrl,
          },
        },
      },
    );
  }, [api, modalData]);

  const checkForDuplicateName = React.useCallback(
    async (value: string, pipelineStore?: DSPipelineAPIServerStore) => {
      if (value) {
        // extra handling for k8s store pipelines since DSPA does not support getNameEqualsFilter for k8s store
        let duplicatePipelines: PipelineKF[];
        if (pipelineStore === DSPipelineAPIServerStore.KUBERNETES) {
          const allPipelines = await api.listPipelines({});
          duplicatePipelines = (allPipelines.pipelines || []).filter(
            (pipeline) => pipeline.display_name === value,
          );
        } else {
          duplicatePipelines =
            (await api.listPipelines({}, getNameEqualsFilter(value))).pipelines || [];
        }

        if (duplicatePipelines.length) {
          return true;
        }
      }
      return false;
    },
    [api],
  );

  return (
    <PipelineImportBase
      title="Import pipeline"
      submitButtonText="Import pipeline"
      onClose={handleClose}
      data={modalData}
      setData={setData}
      resetData={resetData}
      submitAction={submitAction}
      checkForDuplicateName={checkForDuplicateName}
    />
  );
};

export default PipelineImportModal;
