import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Radio, Table, Typography } from "antd";
import { useEffect, useState } from "react";

import { useAxiosPrivate } from "../../../hooks/useAxiosPrivate";
import { useAlertStore } from "../../../store/alert-store";
import { useCustomToolStore } from "../../../store/custom-tool-store";
import { useSessionStore } from "../../../store/session-store";
import { ConfirmModal } from "../../widgets/confirm-modal/ConfirmModal";
import SpaceWrapper from "../../widgets/space-wrapper/SpaceWrapper";
import "./ManageLlmProfiles.css";
import { useExceptionHandler } from "../../../hooks/useExceptionHandler";
import { AddLlmProfile } from "../add-llm-profile/AddLlmProfile";
import { CustomButton } from "../../widgets/custom-button/CustomButton";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "LLM",
    dataIndex: "llm",
    key: "llm",
  },
  {
    title: "Embedding Model",
    dataIndex: "embedding_model",
    key: "embedding_model",
  },
  {
    title: "Vector Database",
    dataIndex: "vector_db",
    key: "vector_db",
  },
  {
    title: "Text Extractor",
    dataIndex: "text_extractor",
    key: "text_extractor",
  },
  {
    title: "",
    dataIndex: "delete",
    key: "delete",
    width: 30,
  },
  {
    title: "",
    dataIndex: "edit",
    key: "edit",
    width: 30,
  },
  {
    title: "Select Default",
    dataIndex: "select",
    key: "select",
    align: "center",
  },
];
function ManageLlmProfiles() {
  const [rows, setRows] = useState([]);
  const [isAddLlm, setIsAddLlm] = useState(false);
  const [editLlmProfileId, setEditLlmProfileId] = useState(null);
  const axiosPrivate = useAxiosPrivate();
  const { sessionDetails } = useSessionStore();
  const { details, defaultLlmProfile, updateCustomTool, llmProfiles } =
    useCustomToolStore();
  const { setAlertDetails } = useAlertStore();
  const handleException = useExceptionHandler();

  const handleDefaultLlm = (profileId) => {
    const body = {
      default_profile: profileId,
    };

    const requestOptions = {
      method: "PATCH",
      url: `/api/v1/unstract/${sessionDetails?.orgId}/prompt-studio/profiles/${details?.tool_id}/`,
      headers: {
        "X-CSRFToken": sessionDetails?.csrfToken,
        "Content-Type": "application/json",
      },
      data: body,
    };

    axiosPrivate(requestOptions)
      .then((res) => {
        const data = res?.data;
        const updatedState = {
          defaultLlmProfile: data?.default_profile,
        };
        updateCustomTool(updatedState);
        setAlertDetails({
          type: "success",
          content: "Default LLM Profile updated successfully",
        });
      })
      .catch((err) => {
        handleException(err, "Failed to set default LLM Profile");
      });
  };

  useEffect(() => {
    const modifiedRows = llmProfiles.map((item) => {
      return {
        key: item?.profile_id,
        name: item?.profile_name || "",
        llm: item?.llm || "",
        embedding_model: item?.embedding_model || "",
        vector_db: item?.vector_store || "",
        text_extractor: item?.x2text || "",
        delete: (
          <ConfirmModal
            handleConfirm={() => handleDelete(item?.profile_id)}
            content="The LLM profile will be permanently deleted."
          >
            <Button size="small" className="display-flex-align-center">
              <DeleteOutlined classID="manage-llm-pro-icon" />
            </Button>
          </ConfirmModal>
        ),
        edit: (
          <Button
            size="small"
            className="display-flex-align-center"
            onClick={() => handleEdit(item?.profile_id)}
          >
            <EditOutlined classID="manage-llm-pro-icon" />
          </Button>
        ),
        select: (
          <Radio
            checked={defaultLlmProfile === item?.profile_id}
            onClick={() => handleDefaultLlm(item?.profile_id)}
          />
        ),
      };
    });
    setRows(modifiedRows);
  }, [llmProfiles, defaultLlmProfile]);

  const handleEdit = (id) => {
    setEditLlmProfileId(id);
    setIsAddLlm(true);
  };

  const handleDelete = (id) => {
    const requestOptions = {
      method: "DELETE",
      url: `/api/v1/unstract/${sessionDetails?.orgId}/prompt-studio/profile-manager/${id}/`,
      headers: {
        "X-CSRFToken": sessionDetails?.csrfToken,
      },
    };

    axiosPrivate(requestOptions)
      .then(() => {
        const modifiedLlmProfiles = [...llmProfiles].filter(
          (item) => item?.profile_id !== id
        );
        const body = {
          llmProfiles: modifiedLlmProfiles,
        };

        // Reset the default LLM profile if it got deleted.
        if (id === defaultLlmProfile) {
          body["defaultLlmProfile"] = "";
        }

        updateCustomTool(body);
      })
      .catch((err) => {
        setAlertDetails(handleException(err, "Failed to delete"));
      });
  };

  if (isAddLlm) {
    return (
      <AddLlmProfile
        editLlmProfileId={editLlmProfileId}
        setEditLlmProfileId={setEditLlmProfileId}
        setIsAddLlm={setIsAddLlm}
        handleDefaultLlm={handleDefaultLlm}
      />
    );
  }

  return (
    <div className="settings-body-pad-top">
      <SpaceWrapper>
        <div>
          <Typography.Text className="add-cus-tool-header">
            LLM Profiles Manager
          </Typography.Text>
        </div>
        <div>
          <Table
            columns={columns}
            dataSource={rows}
            size="small"
            bordered
            max-width="100%"
            pagination={{ pageSize: 10 }}
          />
        </div>
      </SpaceWrapper>
      <div className="display-flex-right">
        <CustomButton type="primary" onClick={() => setIsAddLlm(true)}>
          Add New LLM Profile
        </CustomButton>
      </div>
    </div>
  );
}

export { ManageLlmProfiles };
