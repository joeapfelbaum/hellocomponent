import React, { useState } from "react";
import ProfileSaver from "./components/ProfileSaver/ProfileSaver";
import AutoScroll from "./components/AutoScroll/AutoScroll";
import LinkNavigator from "./components/LinkNavigator/LinkNavigator";
import SkoolSidekick from "./components/SkoolSideKick/SkoolSidekick";
import OpenResponseGenerator from "./components/OpenResponseGenerator/OpenResponseGenerator";
import SmartLinkSaver from "./components/SmartLinkSaver/SmartLinkSaver";

type ComponentEntry = {
  name: string;
  label: string;
};

type ComponentMap = {
  [key: string]: JSX.Element;
};

const App: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>("ProfileSaver");

  const componentMap: ComponentMap = {
    ProfileSaver: <ProfileSaver />,
    AutoScroll: <AutoScroll />,
    LinkNavigator: <LinkNavigator />,
    SkoolSidekick: <SkoolSidekick />,
    OpenResponseGenerator: <OpenResponseGenerator />,
    SmartLinkSaver: <SmartLinkSaver />,
  };

  const components: ComponentEntry[] = [
    { name: "ProfileSaver", label: "Profile Saver" },
    { name: "AutoScroll", label: "Auto Scroll" },
    { name: "LinkNavigator", label: "Link Navigator" },
    { name: "SkoolSidekick", label: "Skool Sidekick" },
    { name: "OpenResponseGenerator", label: "Open Response Generator" },
    { name: "SmartLinkSaver", label: "Smart Link Saver" },
  ];

  return (
    <div className="flex flex-col h-screen">

      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Component Selector</h1>
        <div className="relative">
          <select
            className="block appearance-none w-full bg-gray-700 text-white py-2 px-4 pr-8 rounded shadow focus:outline-none focus:ring focus:ring-blue-400"
            value={activeComponent}
            onChange={(e) => setActiveComponent(e.target.value)}
          >
            {components.map((component) => (
              <option key={component.name} value={component.name}>
                {component.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 p-6 bg-gray-100 overflow-auto rounded shadow">
        {componentMap[activeComponent]}
      </div>
    </div>
  );
};

export default App;