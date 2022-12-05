import React, { useState } from "react";

import Config from "./components/Config/Config";
import Result from "./components/Result/Result";

import styles from "./App.module.css";
import Tabs from "./components/Tabs/Tabs";
import Button from "./components/Button/Button";

export enum FormItemType {
  Number = "number",
  String = "string",
  MultiLine = "multi-line",
  Boolean = "boolean",
  Date = "date",
  Enum = "enum",
}

interface FormItem {
  label: string;
  type: FormItemType;
}

interface FormAction {
  text: string;
}

export interface FormConfig {
  title?: string;
  items?: Array<FormItem>;
  actions?: Array<FormAction>;
}

enum SupportedTab {
  Config = "config",
  Result = "result",
}

function App() {
  const [activeTab, setActiveTab] = useState(SupportedTab.Config);

  const [text, setText] = useState(
    '{"title":"My Form","items":[{"label":"Name","type":"string"},{"label":"Age","type":"number"},{"label":"About you","type":"multi-line"},{"label":"Single","type":"boolean"},{"label":"Birthday","type":"date"},{"label":"Sexual orientation","type":"enum"}],"actions":[{"text":"Cancel"},{"text":"Submit"}]}'
  );
  const [errorMessage, setErrorMessage] = useState("");

  const [formConfig, setFormConfig] = useState<FormConfig>();

  const handleTextChange = (text: string): void => {
    setText(text);
  };

  const handleApplyClick = (): void => {
    let formConfig;

    // TODO: Sanitaze 'text' #nevertrustuserinput

    try {
      formConfig = JSON.parse(text);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Unknown error.");
      }

      console.error(err);
      return;
    }

    setErrorMessage("");

    setFormConfig(formConfig);
    setActiveTab(SupportedTab.Result);
  };

  ///- Tabs

  const handleTabChange = (tab: SupportedTab) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.root}>
      <Tabs<SupportedTab>
        activeTab={activeTab}
        onActiveTabChange={handleTabChange}
        tabs={[
          { id: SupportedTab.Config, title: "Config" },
          { id: SupportedTab.Result, title: "Result" },
        ]}
      />

      {activeTab === SupportedTab.Config && (
        <>
          <Config
            className={styles.tabContent}
            value={text}
            onChange={handleTextChange}
            errorMessage={errorMessage}
          />

          <Button
            className={styles.applyButton}
            onClick={handleApplyClick}
            disabled={text.length < 1}
          >
            Apply
          </Button>
        </>
      )}

      {activeTab === SupportedTab.Result && (
        <Result className={styles.tabContent} formConfig={formConfig} />
      )}
    </div>
  );
}

export default App;
