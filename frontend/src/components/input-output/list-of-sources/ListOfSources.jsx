import { SearchOutlined } from "@ant-design/icons";
import { Input, List } from "antd";
import debounce from "lodash/debounce";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";

import { sourceTypes } from "../../../helpers/GetStaticData";
import { useAxiosPrivate } from "../../../hooks/useAxiosPrivate";
import { useAlertStore } from "../../../store/alert-store";
import { useSessionStore } from "../../../store/session-store";
import { SpinnerLoader } from "../../widgets/spinner-loader/SpinnerLoader";
import { DataSourceCard } from "../data-source-card/DataSourceCard";
import "./ListOfSources.css";
import { useExceptionHandler } from "../../../hooks/useExceptionHandler";

function ListOfSources({ setSelectedSourceId, type }) {
  const [sourcesList, setSourcesList] = useState([]);
  const [filteredSourcesList, setFilteredSourcesList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { sessionDetails } = useSessionStore();
  const { setAlertDetails } = useAlertStore();
  const axiosPrivate = useAxiosPrivate();
  const handleException = useExceptionHandler();

  const disabledIdsByType = {
    EMBEDDING: ["huggingface|90ec9ec2-1768-4d69-8fb1-c88b95de5e5a"],
    LLM: [
      "replicate|2715ce84-05af-4ab4-b8e9-67ac3211b81e",
      "anthropic|90ebd4cd-2f19-4cef-a884-9eeb6ac0f203",
    ],
    VECTOR_DB: [
      "supabase|e6998e3c-3595-48c0-a190-188dbd803858",
      "pinecone|83881133-485d-4ecc-b1f7-0009f96dc74a",
      "milvus|3f42f6f9-4b8e-4546-95f3-22ecc9aca442",
      "postgres|70ab6cc2-e86a-4e5a-896f-498a95022d34",
    ],
  };

  useEffect(() => {
    if (searchText?.length === 0) {
      setFilteredSourcesList(sourcesList);
    }
    const filteredList = [...sourcesList].filter((source) => {
      const name = source?.name?.toUpperCase();
      const searchUpperCase = searchText.toUpperCase();
      return name.includes(searchUpperCase);
    });
    setFilteredSourcesList(filteredList);
  }, [sourcesList, searchText]);

  useEffect(() => {
    if (!type) {
      setSourcesList([]);
      return;
    }
    getListOfSources();
  }, [type, open]);

  const getListOfSources = () => {
    let url = `/api/v1/unstract/${sessionDetails?.orgId}`;
    if (sourceTypes.connectors.includes(type)) {
      url += `/supported_connectors/?type=${type.toUpperCase()}`;
    } else {
      url += `/supported_adapters/?adapter_type=${type.toUpperCase()}`;
    }
    // API to get the list of adapters.
    const requestOptions = {
      method: "GET",
      url,
    };

    setIsLoading(true);
    setSourcesList([]);
    axiosPrivate(requestOptions)
      .then((res) => {
        const sources = res?.data || [];
        const updatedSources = sources?.map((source) => ({
          ...source,
          isDisabled: disabledIdsByType[source?.adapter_type]?.includes(
            source?.id
          ),
        }));
        setSourcesList(updatedSources || []);
      })
      .catch((err) => {
        setAlertDetails(handleException(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onSearchDebounce = useCallback(
    debounce(({ target: { value } }) => {
      setSearchText(value);
    }, 600),
    []
  );

  if (isLoading) {
    return <SpinnerLoader />;
  }

  return (
    <div className="list-of-srcs">
      <div className="searchbox">
        <Input
          placeholder="Search"
          prefix={<SearchOutlined className="search-outlined" />}
          onChange={onSearchDebounce}
        />
      </div>
      <div className="list">
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={filteredSourcesList}
          renderItem={(srcDetails) => (
            <List.Item>
              <DataSourceCard
                srcDetails={srcDetails}
                setSelectedSourceId={setSelectedSourceId}
              />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}

ListOfSources.propTypes = {
  setSelectedSourceId: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export { ListOfSources };
