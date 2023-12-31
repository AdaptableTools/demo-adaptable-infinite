"use client";
import { allColumns, data } from "./data/frameworks";
import { useState } from "react";

import "@adaptabletools/adaptable-infinite-react/index.css";

import {
  Adaptable,
  AdaptableApi,
  components,
} from "@adaptabletools/adaptable-infinite-react";

import { AccentColorPicker } from "./components/AccentColorPicker";
import { Settings } from "./components/Settings";
import { ADAPTABLE_ID } from "./adaptableId";
import tableView from "./views/tableView";
import groupedView from "./views/groupedView";
import pivotView from "./views/pivotView";
import { ViewPicker } from "./components/ViewPicker";

const licenseKey = import.meta.env.VITE_ADAPTABLE_INFINITE_LICENSE_KEY;

const { Button, Layout } = components;

export default function App() {
  const [adaptableApi, setAdaptableApi] = useState<AdaptableApi | undefined>(
    undefined
  );

  const [settingsVisible, doSetSettingsVisible] = useState(() => {
    return localStorage.getItem("settingsVisible") === "true";
  });

  const setSettingsVisible = (visible: boolean) => {
    localStorage.setItem("settingsVisible", visible.toString());
    doSetSettingsVisible(visible);
  };
  return (
    <Adaptable.Provider
      licenseKey={licenseKey}
      adaptableId={ADAPTABLE_ID}
      data={data}
      onReady={(params) => {
        setAdaptableApi(params.adaptableApi);
      }}
      defaultState={{
        globalEntities: {
          availableColumns: {
            ...allColumns,
            "2xstars": {
              expression: "[github_stars] * 2",
              label: "2 x Stars",
              dataType: "number",
            },
            total_pr_count: {
              expression: "[open_pr_count] + [closed_pr_count]",
              label: "All PRs",
              width: 120,
              dataType: "number",
              aggregatable: true,
            },
          },
        },
        grid: {},
        theme: "dark",
        primaryKey: "id",
        dashboard: {
          top: {
            widgets: [
              {
                id: "settingsPanel",
                type: "settingsPanel",
              },
              {
                id: "views",
                type: "view",
              },
              {
                id: "qs",
                type: "quickSearch",
                align: "end",
              },
              {
                id: "export",
                type: "export",
                value: "Current Data",
                align: "end",
              },
            ],
          },
          bottom: {
            widgets: [
              {
                id: "row-count",
                type: "row-count",
              },
              {
                id: "appliction-nme",
                type: "application-name",
                align: "end",
              },
            ],
          },
        },
        styledCell: {
          popular: {
            label: "Popular repos",
            condition: {
              type: "booleanExpression",
              expression: "[github_stars] > 100000",
            },
            scope: {
              columns: ["github_stars"],
            },
            style: {
              fontWeight: "bold",
              color: "var(--adaptable-color-accent)",
              background: "var(--adaptable-text-color-0)",
            },
          },
        },
        view: {
          currentViewId: "table-view",
          views: [
            {
              ...tableView,
              styledCells: ["popular"],
            },
            groupedView,
            pivotView,
          ],
        },
      }}
    >
      <h2 className="font-bold p-2 flex flex-row items-center">
        <div className="text-2xl flex flex-row items-center dark:text-zinc-50 text-zinc-700">
          <img
            alt="Adaptable Logo"
            className="AdaptableLogo h-8 inline-block mr-2"
          />{" "}
          AdapTable for Infinite Table for React Demo
        </div>
        <div className=" grow text-end flex flex-row justify-end items-center">
          <ViewPicker />
          <AccentColorPicker />

          <Layout mt={3} ml={5}>
            <Button
              variant="text"
              icon="settings"
              onClick={() => {
                setSettingsVisible(!settingsVisible);
              }}
            ></Button>
          </Layout>
        </div>
      </h2>
      <div className="grow p-2 flex flex-col">
        <div className=" flex flex-row grow">
          <div className="border flex flex-col border-zinc-400 grow">
            <Adaptable.UI />
          </div>
          {settingsVisible && adaptableApi && (
            <Settings
              adaptableApi={adaptableApi}
              onClose={() => {
                setSettingsVisible(false);
              }}
            />
          )}
        </div>
      </div>
    </Adaptable.Provider>
  );
}
