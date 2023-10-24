import { useState, ChangeEvent } from "react";

import { Form, Spinner } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
// import { useUploadDocument } from "hooks/reactQuery/useAgentsApi";
import { Trans, useTranslation } from "react-i18next";

type UploadFileProps = {
  isOpen: boolean;
  agentId: string;
  onClose: () => void;
  setIsPolling?: React.Dispatch<React.SetStateAction<boolean>>;
};

function UploadFile({
  isOpen,
  onClose,
  agentId,
  setIsPolling,
}: UploadFileProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [validationMessage, setValidationMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { t } = useTranslation();
  // const { mutate: uploadDocument } = useUploadDocument();

  const handleClose = () => {
    setSelectedFiles([]);
    setValidationMessage("");
    setIsUploading(false);
    onClose();
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", selectedFiles[0], selectedFiles[0].name);
    setIsUploading(true);
    // uploadDocument(
    //   { agentId, payload: formData },
    //   {
    //     onSuccess: data => {
    //       handleClose();
    //       if (data.data.status === "success") {
    //         !data.data.data.agent.is_active && setIsPolling(true);
    //       }
    //     },
    //   }
    // );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputFiles = event.target.files;
    if (inputFiles === null) return;

    const newFiles = Array.from(inputFiles);
    const validFiles = newFiles.filter(file => {
      const isPDF = file.type === "application/pdf";
      const isSizeValid = file.size <= 5 * 1024 * 1024; // 5MB in bytes
      return isPDF && isSizeValid;
    });

    if (validFiles.length === 0) {
      setValidationMessage(t("createAgent.knowledge.maxFileSize"));
    } else {
      setValidationMessage("");
      setSelectedFiles([...selectedFiles, ...validFiles]);
    }
  };

  return (
    <Modal
      className="bot-name-modal"
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={isOpen}
      onHide={handleClose}
    >
      <Modal.Header closeButton className="d-flex align-items-center">
        <Modal.Title>
          <h5 className="mb-0">
            <strong>{t("createAgent.knowledge.addDocuments")}</strong>
          </h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>
              <h6>{t("createAgent.knowledge.uploadFile.title")}</h6>
            </Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
            <p className="mt-2">
              <small>
                <span className="mr-2 text-muted">
                  <Trans
                    i18nKey="createAgent.knowledge.uploadFile.maxSize"
                    components={{ b: <b /> }}
                  />
                </span>{" "}
                <span className="text-muted">
                  <Trans
                    i18nKey="createAgent.knowledge.uploadFile.supportedType"
                    components={{ b: <b /> }}
                  />
                </span>
              </small>
            </p>
          </Form.Group>
        </Form>
        {validationMessage && (
          <p className="text-danger">{validationMessage}</p>
        )}
        {selectedFiles?.map((file, index) => (
          <>
            <div className="flex gap-2 bg-light align-items-center p-3 my-2">
              <div className="btn_icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="32"
                  height="32"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path
                    d="M5 4H15V8H19V20H5V4ZM3.9985 2C3.44749 2 3 2.44405 3 2.9918V21.0082C3 21.5447 3.44476 22 3.9934 22H20.0066C20.5551 22 21 21.5489 21 20.9925L20.9997 7L16 2H3.9985ZM10.4999 7.5C10.4999 9.07749 10.0442 10.9373 9.27493 12.6534C8.50287 14.3757 7.46143 15.8502 6.37524 16.7191L7.55464 18.3321C10.4821 16.3804 13.7233 15.0421 16.8585 15.49L17.3162 13.5513C14.6435 12.6604 12.4999 9.98994 12.4999 7.5H10.4999ZM11.0999 13.4716C11.3673 12.8752 11.6042 12.2563 11.8037 11.6285C12.2753 12.3531 12.8553 13.0182 13.5101 13.5953C12.5283 13.7711 11.5665 14.0596 10.6352 14.4276C10.7999 14.1143 10.9551 13.7948 11.0999 13.4716Z"
                    fill="rgba(0,125,136,1)"
                  ></path>
                </svg>
              </div>
              <span>{file.name}</span>
              <Button
                variant="secondary"
                className="ml-auto btn_icon"
                onClick={() => {
                  const updatedFiles = [...selectedFiles];
                  updatedFiles.splice(index, 1);
                  setSelectedFiles(updatedFiles);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path
                    d="M17 4H22V6H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V6H2V4H7V2H17V4ZM9 9V17H11V9H9ZM13 9V17H15V9H13Z"
                    fill="rgba(255,255,255,1)"
                  ></path>
                </svg>
              </Button>
            </div>
          </>
        ))}
        {isUploading && (
          <div className="flex items-center gap-2 mt-2">
            <Spinner />
            <span>{t("common.uploading")}</span>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="flex ml-auto gap-2">
          <Button
            className="btn-modal-ok"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {t("common.ok")}
          </Button>
          <Button
            className="btn-light btn-modal-cancel"
            variant="link"
            onClick={() => onClose()}
          >
            {t("common.cancel")}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

UploadFile.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default UploadFile;
